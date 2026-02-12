export default `
<h2>Where Character-Level Comparison Breaks Down</h2>

<p>Levenshtein distance handles typos well. "recieve" vs "receive" gives an edit distance of 2, which maps directly to what the user meant. But try "John Doe" vs "Doe John." Edit distance is 8, suggesting completely different strings. They are the same person with reordered tokens.</p>

<p>This shows up everywhere: address matching ("123 Main St Apt 4" vs "Apt 4, 123 Main St"), product search ("wireless bluetooth headphones" vs "headphones bluetooth wireless"), entity resolution across databases. Levenshtein is position-sensitive. It penalizes rearrangement as heavily as corruption.</p>

<h2>Tokenization Strategies</h2>

<p>Before comparing multi-word strings, we need to break them into meaningful units. Two approaches, different tradeoffs.</p>

<svg viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;margin:32px auto;display:block;">
  <style>
    .d-text { font-family: var(--font-mono); font-size: 12px; fill: var(--text-primary); }
    .d-label { font-family: var(--font-body); font-size: 13px; fill: var(--text-secondary); }
  </style>
  <text x="20" y="20" class="d-label" font-weight="600">Tokenization: Two Approaches</text>
  <rect x="20" y="35" width="260" height="65" fill="var(--bg-surface)" stroke="var(--border-default)" stroke-width="1.5"/>
  <text x="150" y="53" class="d-label" text-anchor="middle" font-weight="500">Whitespace Splitting</text>
  <text x="150" y="73" class="d-text" text-anchor="middle">"wireless bluetooth headphones"</text>
  <text x="150" y="90" class="d-text" text-anchor="middle" fill="var(--accent)">[wireless, bluetooth, headphones]</text>
  <rect x="320" y="35" width="260" height="65" fill="var(--bg-surface)" stroke="var(--border-default)" stroke-width="1.5"/>
  <text x="450" y="53" class="d-label" text-anchor="middle" font-weight="500">Character N-grams (n=3)</text>
  <text x="450" y="73" class="d-text" text-anchor="middle">"wireless"</text>
  <text x="450" y="90" class="d-text" text-anchor="middle" fill="var(--accent)">[wir, ire, rel, ele, les, ess]</text>
  <rect x="20" y="120" width="560" height="60" fill="var(--accent)" fill-opacity="0.15" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="300" y="142" class="d-label" text-anchor="middle">Whitespace: preserves semantic units, fast, order-dependent</text>
  <text x="300" y="162" class="d-label" text-anchor="middle">N-grams: captures subword similarity, handles typos, slower</text>
</svg>

<p><strong>Whitespace splitting</strong> produces semantic tokens that preserve word boundaries. Fast, works well for structured text like names or addresses. <strong>N-gram generation</strong> slides a window of size n across the string, producing overlapping substrings. Trigrams are robust to typos because a single character error affects at most n grams out of the total.</p>

<h2>Token Sort: Normalizing Word Order</h2>

<p>Token Sort addresses the reordering problem directly:</p>

<ol>
  <li>Lowercase both strings</li>
  <li>Split each into tokens on whitespace</li>
  <li>Sort tokens alphabetically</li>
  <li>Rejoin and compute Levenshtein on the sorted strings</li>
</ol>

<pre><code>def token_sort_ratio(s1, s2):
    sorted_s1 = " ".join(sorted(s1.lower().split()))
    sorted_s2 = " ".join(sorted(s2.lower().split()))
    max_len = max(len(sorted_s1), len(sorted_s2))
    if max_len == 0:
        return 1.0
    distance = levenshtein(sorted_s1, sorted_s2)
    return 1.0 - distance / max_len</code></pre>

<p>"John Doe" and "Doe John" both become "doe john" after sorting. Perfect similarity score of 1.0.</p>

<h2>Set-Based Similarity: Jaccard Index</h2>

<p>When content overlap matters more than sequential alignment, Jaccard measures the ratio of shared elements to total distinct elements:</p>

<pre><code>J(A, B) = |A ∩ B| / |A ∪ B|</code></pre>

<p>For tokenized strings: A = {"wireless", "bluetooth", "headphones"} and B = {"bluetooth", "headphones", "wireless", "earbuds"}. Intersection is 3, union is 4, Jaccard = 0.75.</p>

<p>Jaccard is <strong>order-invariant</strong> and <strong>duplicate-invariant</strong>. Works well for document-level similarity where texts on the same topic share vocabulary regardless of sentence structure. The weakness: it treats all tokens as equally important.</p>

<h2>Hybrid Scorers: Weighted Approach</h2>

<p>In practice, neither Levenshtein nor Jaccard alone gives optimal ranking. FuzzyBunny uses a hybrid scoring system:</p>

<pre><code>struct HybridScore {
    double levenshtein_score;
    double token_sort_score;
    double jaccard_score;

    double combined(double w_lev, double w_tok, double w_jac) const {
        return w_lev * levenshtein_score
             + w_tok * token_sort_score
             + w_jac * jaccard_score;
    }
};</code></pre>

<p>Default weights for product catalog search: <strong>0.3 Levenshtein + 0.3 Token Sort + 0.4 Jaccard</strong>. Tuned empirically against human-labeled relevance judgments.</p>

<h3>Choosing the Right Scorer</h3>

<p>Depends on the entropy characteristics of your dataset:</p>

<ul>
  <li><strong>Low entropy (names, codes):</strong> Short strings where typos are the primary mismatch. Weight Levenshtein heavily.</li>
  <li><strong>Medium entropy (product titles, addresses):</strong> Word order varies, partial matches matter. Balance all three.</li>
  <li><strong>High entropy (descriptions, documents):</strong> Content overlap matters more than alignment. Weight Jaccard heavily.</li>
</ul>

<h2>Performance</h2>

<p>For a query matched against 50K candidates with average string length of 25 characters:</p>

<ul>
  <li><strong>Pure Levenshtein:</strong> ~8ms (C++ batched)</li>
  <li><strong>Token Sort + Levenshtein:</strong> ~12ms</li>
  <li><strong>Jaccard (whitespace tokens):</strong> ~3ms</li>
  <li><strong>Full Hybrid (all three):</strong> ~15ms (shared tokenization amortizes cost)</li>
</ul>

<p>15ms for 50K comparisons is well within interactive latency budgets. Combining multiple similarity metrics gives significantly better ranking quality than any single metric, at marginal extra cost.</p>
`;
