export default `
<h2>When Linear Correlation Misses the Signal</h2>

<p>Pearson's r measures linear relationships. An r of 0.0 gets interpreted as "no relationship." But take Y = X squared. The relationship is perfectly deterministic, knowing X gives you Y exactly. Pearson's r is still 0.0 because the relationship is parabolic.</p>

<p>In feature engineering, these non-linear dependencies create predictive power. A model limited to linearly correlated features misses signal encoded in quadratic, periodic, and threshold-based relationships. HashPrep's interaction analysis goes beyond Pearson to catch them.</p>

<svg viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;margin:32px auto;display:block;">
  <style>
    .it { font-family: var(--font-mono); font-size: 12px; fill: var(--text-primary); }
    .il { font-family: var(--font-body); font-size: 13px; fill: var(--text-secondary); }
  </style>
  <text x="300" y="16" class="il" text-anchor="middle" font-weight="600">Pearson r = 0.0 Does Not Mean Independence</text>
  <g transform="translate(30, 30)">
    <text x="100" y="10" class="il" text-anchor="middle">Linear: r = 0.95</text>
    <line x1="0" y1="140" x2="200" y2="140" stroke="var(--border-default)" stroke-width="1.5"/>
    <line x1="0" y1="140" x2="0" y2="20" stroke="var(--border-default)" stroke-width="1.5"/>
    <circle cx="20" cy="125" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="40" cy="115" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="55" cy="105" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="80" cy="90" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="100" cy="78" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="120" cy="65" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="145" cy="50" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="170" cy="38" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="190" cy="28" r="4" fill="var(--accent)" opacity="0.8"/>
  </g>
  <g transform="translate(370, 30)">
    <text x="100" y="10" class="il" text-anchor="middle">Quadratic: r = 0.0</text>
    <line x1="0" y1="140" x2="200" y2="140" stroke="var(--border-default)" stroke-width="1.5"/>
    <line x1="0" y1="140" x2="0" y2="20" stroke="var(--border-default)" stroke-width="1.5"/>
    <circle cx="10" cy="35" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="30" cy="65" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="55" cy="100" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="75" cy="120" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="100" cy="135" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="125" cy="120" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="145" cy="100" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="170" cy="65" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="190" cy="35" r="4" fill="var(--accent)" opacity="0.8"/>
  </g>
</svg>

<h2>Entropy-Based Association: Theil's U</h2>

<p>Theil's U (Uncertainty Coefficient) measures the <strong>proportional reduction in entropy</strong> of one variable given knowledge of another. It captures any form of statistical association: linear, non-linear, or categorical.</p>

<pre><code>U(X|Y) = (H(X) - H(X|Y)) / H(X)</code></pre>

<p>H(X) is the entropy of X, H(X|Y) is conditional entropy of X given Y. Ranges from 0 (Y tells you nothing about X) to 1 (Y completely determines X).</p>

<p>Important property: <strong>Theil's U is asymmetric</strong>. U(X|Y) is not equal to U(Y|X). If U(ZIP_code | State) = 1.0 but U(State | ZIP_code) = 0.3, that means ZIP code fully determines state, but state only partially determines ZIP code. For feature selection, this asymmetry reveals which features are redundant given others.</p>

<h2>Cramer's V for Categorical Pairs</h2>

<p>For two categorical variables, Cramer's V provides a symmetric association measure based on chi-square:</p>

<pre><code>V = sqrt(chi2 / (n * min(r-1, c-1)))</code></pre>

<p>Where n is sample size, r is categories of variable 1, c is categories of variable 2 in the contingency table. V ranges from 0 to 1. Needs correction for small samples.</p>

<p>HashPrep computes Cramer's V for all categorical pairs and Theil's U for all directed associations. Results go into an <strong>interaction heatmap</strong>, a matrix where cell intensity represents association strength.</p>

<h2>The O(N squared) Problem</h2>

<p>With P features, the pairwise matrix has P squared / 2 cells. At P = 100, that is 4,950 pairs. At P = 1000, it is 499,500. Each pair needs a statistical test over the full dataset.</p>

<p>HashPrep uses three optimizations:</p>

<ul>
  <li><strong>Sampling:</strong> Above 50K rows, compute on a stratified sample. 10K samples give sufficient statistical power while cutting computation 5x.</li>
  <li><strong>Pruning:</strong> Skip pairs where both features have very low variance. Constant or near-constant columns always have near-zero association.</li>
  <li><strong>Parallel computation:</strong> Pairwise computation is embarrassingly parallel. Each pair is independent. HashPrep distributes across available CPU cores.</li>
</ul>

<p>A 1000-feature dataset completes interaction analysis in under 30 seconds on an 8-core machine.</p>

<h2>Feature Clusters</h2>

<p>The heatmap reveals groups of strongly associated features. Practical implications:</p>

<ul>
  <li><strong>Redundancy:</strong> Features in a high-association cluster carry overlapping information. Including all of them wastes model capacity and increases overfitting.</li>
  <li><strong>Interaction candidates:</strong> Features with moderate association (V or U between 0.3-0.7) are good candidates for engineered interaction terms (products, ratios, differences).</li>
  <li><strong>Validation:</strong> Features expected to be independent but showing high association may indicate data quality issues or hidden confounders.</li>
</ul>

<h2>Toward Shapley-Based Interactions</h2>

<p>Pairwise metrics miss higher-order interactions, cases where three features together predict the target but no pair does individually. Shapley interaction values decompose predictions into individual feature contributions and their interactions.</p>

<p>Exact Shapley computation is exponential in feature count. Current research focuses on approximation methods with bounded error in polynomial time. HashPrep's roadmap includes an approximate Shapley module for datasets under 50 features, where the computation stays tractable.</p>

<p>For now, pairwise analysis captures the majority of detectable interactions in typical tabular datasets. The heatmap gives an immediate, interpretable summary for feature selection and engineering decisions without full model training.</p>
`;
