export default `
<h2>String Matching at Production Scale</h2>

<p>String similarity looks simple until you need to run it on 100K+ candidates in a Python runtime. Comparing two short strings with Levenshtein distance takes microseconds. Comparing millions takes minutes. FuzzyBunny exists to close that gap.</p>

<p>The naive recursive edit distance implementation has exponential time complexity. The standard dynamic programming approach (Wagner-Fischer) brings it to <strong>O(N * M)</strong> where N and M are the string lengths. Even that becomes a bottleneck once your search space exceeds a few thousand entries in Python.</p>

<h2>Wagner-Fischer: The Foundation</h2>

<p>Wagner-Fischer builds a matrix where cell <code>(i, j)</code> holds the minimum edits needed to transform the first <code>i</code> characters of string A into the first <code>j</code> characters of string B:</p>

<pre><code>dp[i][j] = min(
    dp[i-1][j] + 1,       // deletion
    dp[i][j-1] + 1,       // insertion
    dp[i-1][j-1] + cost   // substitution (cost = 0 if chars match)
)</code></pre>

<p>The full matrix allocates <strong>O(N * M)</strong> space. Two 1000-character strings produce a million-cell matrix. At thousands of comparisons per second, allocation overhead alone becomes a problem.</p>

<svg viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;margin:32px auto;display:block;">
  <style>
    .diagram-text { font-family: var(--font-mono); font-size: 13px; fill: var(--text-primary); }
    .diagram-label { font-family: var(--font-body); font-size: 14px; fill: var(--text-secondary); }
  </style>
  <text x="20" y="20" class="diagram-label" font-weight="600">Full Matrix vs Single-Row Optimization</text>
  <rect x="20" y="35" width="240" height="150" fill="var(--bg-surface)" stroke="var(--border-default)" stroke-width="1.5"/>
  <text x="140" y="55" class="diagram-label" text-anchor="middle">Full Matrix O(N*M)</text>
  <g transform="translate(40, 65)">
    <rect x="0" y="0" width="40" height="22" fill="var(--accent)" fill-opacity="0.2" stroke="var(--border-default)" stroke-width="1"/>
    <rect x="40" y="0" width="40" height="22" fill="var(--accent)" fill-opacity="0.2" stroke="var(--border-default)" stroke-width="1"/>
    <rect x="80" y="0" width="40" height="22" fill="var(--accent)" fill-opacity="0.2" stroke="var(--border-default)" stroke-width="1"/>
    <rect x="120" y="0" width="40" height="22" fill="var(--accent)" fill-opacity="0.2" stroke="var(--border-default)" stroke-width="1"/>
    <rect x="160" y="0" width="40" height="22" fill="var(--accent)" fill-opacity="0.2" stroke="var(--border-default)" stroke-width="1"/>
    <rect x="0" y="22" width="40" height="22" fill="var(--accent)" fill-opacity="0.2" stroke="var(--border-default)" stroke-width="1"/>
    <rect x="40" y="22" width="40" height="22" fill="var(--accent)" fill-opacity="0.2" stroke="var(--border-default)" stroke-width="1"/>
    <rect x="80" y="22" width="40" height="22" fill="var(--accent)" fill-opacity="0.2" stroke="var(--border-default)" stroke-width="1"/>
    <rect x="120" y="22" width="40" height="22" fill="var(--accent)" fill-opacity="0.2" stroke="var(--border-default)" stroke-width="1"/>
    <rect x="160" y="22" width="40" height="22" fill="var(--accent)" fill-opacity="0.2" stroke="var(--border-default)" stroke-width="1"/>
    <rect x="0" y="44" width="40" height="22" fill="var(--accent)" fill-opacity="0.2" stroke="var(--border-default)" stroke-width="1"/>
    <rect x="40" y="44" width="40" height="22" fill="var(--accent)" fill-opacity="0.2" stroke="var(--border-default)" stroke-width="1"/>
    <rect x="80" y="44" width="40" height="22" fill="var(--accent)" fill-opacity="0.2" stroke="var(--border-default)" stroke-width="1"/>
    <rect x="120" y="44" width="40" height="22" fill="var(--accent)" fill-opacity="0.2" stroke="var(--border-default)" stroke-width="1"/>
    <rect x="160" y="44" width="40" height="22" fill="var(--accent)" fill-opacity="0.2" stroke="var(--border-default)" stroke-width="1"/>
    <text x="100" y="90" class="diagram-text" text-anchor="middle" fill="var(--text-muted)">N*M cells allocated</text>
  </g>
  <rect x="320" y="35" width="260" height="150" fill="var(--bg-surface)" stroke="var(--border-default)" stroke-width="1.5"/>
  <text x="450" y="55" class="diagram-label" text-anchor="middle">Single Row O(min(N,M))</text>
  <g transform="translate(340, 100)">
    <rect x="0" y="0" width="40" height="22" stroke="var(--accent)" stroke-width="2" fill="var(--accent)" fill-opacity="0.25"/>
    <rect x="40" y="0" width="40" height="22" stroke="var(--accent)" stroke-width="2" fill="var(--accent)" fill-opacity="0.25"/>
    <rect x="80" y="0" width="40" height="22" stroke="var(--accent)" stroke-width="2" fill="var(--accent)" fill-opacity="0.25"/>
    <rect x="120" y="0" width="40" height="22" stroke="var(--accent)" stroke-width="2" fill="var(--accent)" fill-opacity="0.25"/>
    <rect x="160" y="0" width="40" height="22" stroke="var(--accent)" stroke-width="2" fill="var(--accent)" fill-opacity="0.25"/>
    <text x="100" y="45" class="diagram-text" text-anchor="middle" fill="var(--accent)">Only 1 row reused</text>
  </g>
</svg>

<h2>Single-Row Optimization</h2>

<p>Each row of the DP matrix only depends on the previous row. So we can keep a single array of length <code>min(N, M) + 1</code> and update it in place, using a temp variable for the diagonal:</p>

<pre><code>int levenshtein(const std::string&amp; s1, const std::string&amp; s2) {
    const size_t len1 = s1.size(), len2 = s2.size();
    std::vector&lt;int&gt; col(len2 + 1);

    std::iota(col.begin(), col.end(), 0);

    for (size_t i = 1; i &lt;= len1; ++i) {
        int prev = col[0];
        col[0] = i;
        for (size_t j = 1; j &lt;= len2; ++j) {
            int temp = col[j];
            if (s1[i - 1] == s2[j - 1]) {
                col[j] = prev;
            } else {
                col[j] = 1 + std::min({prev, col[j], col[j - 1]});
            }
            prev = temp;
        }
    }
    return col[len2];
}</code></pre>

<p>Space drops from <strong>O(N * M)</strong> to <strong>O(min(N, M))</strong>. For matching user queries against 100K+ entry dictionaries, this eliminated the memory pressure that was causing allocation stalls in tight loops.</p>

<h2>The Pybind11 Boundary Problem</h2>

<p>Moving Levenshtein from Python to C++ via Pybind11 gives a 40-80x speedup per comparison. But calling the C++ function once per candidate pair introduces a new bottleneck: the <strong>Python-C++ boundary crossing cost</strong>.</p>

<p>Each Pybind11 call involves reference counting, GIL acquisition/release, string marshaling, and return value conversion. Overhead per call is around 1-2 microseconds. Against 100,000 candidates, that accumulates to 100-200ms, often exceeding the actual computation time.</p>

<h3>The batch_match Solution</h3>

<p>Instead of calling <code>levenshtein(query, candidate)</code> 100K times from Python, pass the entire candidate list to C++ in one call:</p>

<pre><code>std::vector&lt;std::pair&lt;int, double&gt;&gt; batch_match(
    const std::string&amp; query,
    const std::vector&lt;std::string&gt;&amp; candidates,
    double threshold
) {
    std::vector&lt;std::pair&lt;int, double&gt;&gt; results;
    const int qlen = query.size();

    for (size_t i = 0; i &lt; candidates.size(); ++i) {
        int dist = levenshtein(query, candidates[i]);
        double score = 1.0 - (double)dist / std::max(qlen, (int)candidates[i].size());
        if (score &gt;= threshold) {
            results.emplace_back(i, score);
        }
    }
    return results;
}</code></pre>

<p>One boundary crossing instead of 100K. The batch version processes 100K candidates in ~15ms versus ~220ms for the per-call approach. That is a <strong>14x improvement</strong> just from eliminating boundary overhead.</p>

<h2>Unicode Handling</h2>

<p>Levenshtein operates on character sequences. UTF-8 encodes "e" as two bytes (<code>0xC3 0xA9</code>), while "e" is one byte. Computing distance on raw bytes gives wrong results. We normalize all inputs to NFC (Canonical Decomposition followed by Canonical Composition) and operate on Unicode code points instead of bytes.</p>

<h2>Why Not Myers' Bit-Parallelism?</h2>

<p>Myers' algorithm packs character comparisons into bitwise operations, processing an entire DP row in one CPU instruction for strings under 64 characters. We skipped it for the initial release for two reasons:</p>

<ul>
  <li><strong>Maintainability:</strong> Bit-parallel code is hard to read and debug. The single-row Wagner-Fischer is clear enough that any contributor can understand and modify it.</li>
  <li><strong>Diminishing returns:</strong> For 5-30 character queries against product catalogs, the batch_match optimization provides more real-world throughput improvement than bit-parallelism would.</li>
</ul>

<p>Myers' is on the roadmap for a future version targeting genomic sequence matching, where strings exceed 10,000 characters.</p>

<h2>Results</h2>

<p>The final FuzzyBunny pipeline processes 100K candidate comparisons in under 20ms on commodity hardware. Single-row Levenshtein in C++, batch processing across the Pybind11 boundary, NFC-normalized Unicode. Algorithmic optimization reduces per-comparison cost. System-level optimization reduces per-invocation overhead. Both matter.</p>
`;
