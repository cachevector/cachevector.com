export default `
<h2>When the Model Cheats</h2>

<p>You build a model, 99% accuracy on cross-validation. Deploy it. Production accuracy: 52%, barely above coin flip. No bugs, no pipeline errors, no distribution shift. The model was exploiting features that encode target information, information that won't be available at prediction time.</p>

<p>This is target leakage. It produces models that look excellent on every metric until they hit real data. Unlike software bugs that throw errors, leakage produces plausible-looking results that are completely wrong.</p>

<h2>How Leakage Shows Up</h2>

<p>Take the Titanic dataset. The "Ticket" column has alphanumeric IDs like "A/5 21171" or "PC 17599". A model that includes raw ticket strings learns that certain prefixes correlate with survival, because tickets encode passenger class and boarding location, which correlate with cabin proximity to lifeboats.</p>

<svg viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;margin:32px auto;display:block;">
  <style>
    .lt { font-family: var(--font-mono); font-size: 12px; fill: var(--text-primary); }
    .ll { font-family: var(--font-body); font-size: 13px; fill: var(--text-secondary); }
    .lbox { fill: var(--bg-surface); stroke: var(--border-default); stroke-width: 1.5; }
    .lbox-warn { fill: var(--bg-surface); stroke: var(--accent); stroke-width: 2; }
    .larrow { stroke: var(--text-muted); stroke-width: 1.5; fill: none; marker-end: url(#ah4); }
  </style>
  <defs>
    <marker id="ah4" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <path d="M0,0 L10,3.5 L0,7" fill="var(--text-muted)"/>
    </marker>
  </defs>
  <text x="300" y="18" class="ll" text-anchor="middle" font-weight="600">Leakage Path: Ticket to Survival</text>
  <rect x="20" y="40" width="120" height="40" class="lbox-warn"/>
  <text x="80" y="65" class="lt" text-anchor="middle" fill="var(--accent)">Ticket ID</text>
  <path d="M140 60 L180 60" class="larrow"/>
  <rect x="180" y="40" width="120" height="40" class="lbox"/>
  <text x="240" y="65" class="lt" text-anchor="middle">Cabin Class</text>
  <path d="M300 60 L340 60" class="larrow"/>
  <rect x="340" y="40" width="120" height="40" class="lbox"/>
  <text x="400" y="65" class="lt" text-anchor="middle">Deck Location</text>
  <path d="M460 60 L500 60" class="larrow"/>
  <rect x="500" y="40" width="80" height="40" class="lbox"/>
  <text x="540" y="65" class="lt" text-anchor="middle">Survived</text>

  <rect x="100" y="120" width="400" height="55" fill="var(--accent)" fill-opacity="0.15" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="300" y="142" class="ll" text-anchor="middle" fill="var(--accent)">Model learns Ticket correlates with Survived</text>
  <text x="300" y="160" class="ll" text-anchor="middle" fill="var(--accent)">but causal path (Cabin > Deck > Lifeboat) doesn't generalize</text>
</svg>

<p>During training, the ticket-survival correlation is strong because the data is a closed set, a fixed passenger manifest. In production with new passengers, ticket IDs are entirely new and the learned correlations are useless.</p>

<h2>Detection via Mutual Information</h2>

<p>Mutual Information (MI) quantifies how much one variable tells you about another:</p>

<pre><code>MI(X, Y) = sum sum p(x,y) * log(p(x,y) / (p(x) * p(y)))</code></pre>

<p>High MI between a feature and target is expected. You want predictive features. But when MI is <strong>disproportionately high relative to the feature's domain semantics</strong>, it signals leakage.</p>

<p>HashPrep flags features where:</p>

<ul>
  <li>MI with target exceeds a configurable threshold (default: 0.8 for binary classification)</li>
  <li>Feature cardinality approaches sample size (near-unique identifiers)</li>
  <li>Feature was generated from a temporal process that could encode future information</li>
</ul>

<h2>High-Cardinality Proxy Detection</h2>

<p>Identifiers (user IDs, transaction IDs, session tokens) are the most common leakage source. They show up as columns with cardinality approaching row count. HashPrep computes a <strong>cardinality ratio</strong>:</p>

<pre><code>cardinality_ratio = n_unique_values / n_total_rows</code></pre>

<p>Features above 0.9 get flagged as potential identifiers. Combined with high MI against the target, they are classified as <strong>likely leakage sources</strong>.</p>

<p>False positive rate is low. Legitimate high-cardinality features (free-text, high-precision continuous values) rarely achieve MI above 0.5 with binary targets. Identifiers that encode structural target information regularly exceed 0.8.</p>

<h2>Temporal Leakage</h2>

<p>In time-series datasets, a subtler form: features containing future information relative to the prediction point.</p>

<ul>
  <li>"days_since_last_purchase" computed using the full dataset, including purchases after the prediction timestamp</li>
  <li>"average_account_balance" including balance snapshots from dates after the target event</li>
  <li>"customer_lifetime_value" in a churn model. LTV is only fully known after the customer has churned or been retained</li>
</ul>

<p>HashPrep detects temporal leakage by checking for <strong>look-ahead dependencies</strong>: if a feature's values are computed from data with later timestamps, it gets flagged. Requires the user to specify a timestamp column, but once provided, the check is automated.</p>

<h2>Leakage as a CI/CD Gate</h2>

<p>Leakage detection is not a one-time check. New features from a team member, schema changes upstream, modifications to feature engineering, all can introduce leakage.</p>

<p>HashPrep runs the leakage scanner on every pipeline change and blocks deployment if new sources are detected:</p>

<pre><code>{
  "feature": "transaction_id",
  "cardinality_ratio": 0.97,
  "mi_score": 0.91,
  "verdict": "LIKELY_LEAKAGE",
  "recommendation": "Drop this feature. It is a near-unique identifier with high mutual information against the target."
}</code></pre>

<p>Automated quality gate on every commit. The cost of false positives is a brief review. The cost of undetected leakage is a deployed model that fails in production.</p>
`;
