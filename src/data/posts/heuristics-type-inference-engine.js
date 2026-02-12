export default `
<h2>Beyond Storage Types</h2>

<p>A CSV file tells you almost nothing about what its data means. Pandas reads columns as <code>int64</code>, <code>float64</code>, <code>object</code>, <code>bool</code>. But the integer 90210 could be a ZIP code (categorical), a measurement (continuous), or a record ID (identifier). The cleaning strategy for each is fundamentally different.</p>

<p>HashPrep's type inference engine classifies each column into semantic types that map directly to preprocessing pipelines. The gap between a column's storage type and its meaning is where most data preparation mistakes happen.</p>

<svg viewBox="0 0 600 260" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;margin:32px auto;display:block;">
  <style>
    .tt { font-family: var(--font-mono); font-size: 11px; fill: var(--text-primary); }
    .tl { font-family: var(--font-body); font-size: 13px; fill: var(--text-secondary); }
    .tbox { fill: var(--bg-surface); stroke: var(--border-default); stroke-width: 1.5; }
    .tabox { fill: var(--accent); fill-opacity: 0.18; stroke: var(--accent); stroke-width: 1.5; }
  </style>
  <text x="300" y="18" class="tl" text-anchor="middle" font-weight="600">Semantic Type Classification</text>
  <rect x="210" y="35" width="180" height="30" class="tbox"/>
  <text x="300" y="55" class="tt" text-anchor="middle">Raw Column: int64</text>
  <line x1="250" y1="65" x2="100" y2="95" stroke="var(--text-muted)" stroke-width="1.5"/>
  <line x1="300" y1="65" x2="300" y2="95" stroke="var(--text-muted)" stroke-width="1.5"/>
  <line x1="350" y1="65" x2="500" y2="95" stroke="var(--text-muted)" stroke-width="1.5"/>
  <rect x="20" y="95" width="160" height="50" class="tabox"/>
  <text x="100" y="115" class="tt" text-anchor="middle" fill="var(--accent)">Numeric-Continuous</text>
  <text x="100" y="133" class="tt" text-anchor="middle" fill="var(--text-muted)">age, temperature, price</text>
  <rect x="220" y="95" width="160" height="50" class="tabox"/>
  <text x="300" y="115" class="tt" text-anchor="middle" fill="var(--accent)">Numeric-Discrete</text>
  <text x="300" y="133" class="tt" text-anchor="middle" fill="var(--text-muted)">count, rating (1-5)</text>
  <rect x="420" y="95" width="160" height="50" class="tabox"/>
  <text x="500" y="115" class="tt" text-anchor="middle" fill="var(--accent)">Categorical-ID</text>
  <text x="500" y="133" class="tt" text-anchor="middle" fill="var(--text-muted)">zip_code, user_id</text>
  <g transform="translate(20, 170)">
    <rect x="0" y="0" width="170" height="28" class="tbox"/>
    <text x="85" y="18" class="tt" text-anchor="middle">Normalize / Scale</text>
    <rect x="210" y="0" width="170" height="28" class="tbox"/>
    <text x="295" y="18" class="tt" text-anchor="middle">Bin / Leave as-is</text>
    <rect x="410" y="0" width="170" height="28" class="tbox"/>
    <text x="495" y="18" class="tt" text-anchor="middle">Encode / Drop</text>
  </g>
  <text x="300" y="230" class="tl" text-anchor="middle">Same dtype, three different preprocessing strategies</text>
</svg>

<h2>Probabilistic Classification Signals</h2>

<p>The engine uses a battery of heuristic signals, each contributing a probability weight toward a type classification. No single signal is definitive. The final result is a <strong>weighted vote</strong> across all signals.</p>

<p>Key signals for numeric columns:</p>

<ul>
  <li><strong>Cardinality ratio:</strong> <code>unique_values / total_rows</code>. Above 0.5 suggests continuous. Below 0.05 suggests discrete or categorical.</li>
  <li><strong>Value range:</strong> All values as integers between 1 and 10 likely means a discrete rating or category code.</li>
  <li><strong>Distribution shape:</strong> Continuous measurements tend toward smooth distributions. Identifiers have uniform or near-uniform distributions.</li>
  <li><strong>Column name patterns:</strong> Regex matching against known patterns. Names containing "id", "code", "zip", "phone" are likely identifiers.</li>
  <li><strong>Sequential analysis:</strong> Monotonically increasing integers with no gaps means auto-increment ID.</li>
</ul>

<h2>Handling String Columns</h2>

<p>"2024-01-15" stored as a string is a date. "https://example.com/page" is a URL. "550e8400-e29b-41d4-a716-446655440000" is a UUID. Pandas says they are all <code>object</code> dtype.</p>

<p>HashPrep runs a cascade of regex detectors on string columns:</p>

<pre><code>DETECTORS = [
    ("date_iso", r"^\\d{4}-\\d{2}-\\d{2}"),
    ("date_us", r"^\\d{1,2}/\\d{1,2}/\\d{2,4}"),
    ("url", r"^https?://"),
    ("email", r"^[\\w.+-]+@[\\w-]+\\.[\\w.]+$"),
    ("uuid", r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}"),
    ("phone", r"^[\\+]?[\\d\\s\\-\\(\\)]{7,15}$"),
]</code></pre>

<p>If more than 80% of non-null values match a pattern, the column gets classified accordingly. The 80% threshold accounts for data quality issues. A date column with 5% malformed entries still has a recognizable dominant pattern.</p>

<h2>Mixed-Type Columns</h2>

<p>Real data is messy. A "price" column Pandas reads as <code>object</code> might contain: <code>["12.50", "15.00", "N/A", "unknown", "20.75"]</code>. Semantically numeric, but contains string corruption.</p>

<p>HashPrep's approach:</p>

<ol>
  <li>Try numeric coercion with <code>pd.to_numeric(col, errors='coerce')</code></li>
  <li>Measure the <strong>coercion success rate</strong></li>
  <li>Above 90% success: classify as numeric with a "corruption" flag</li>
  <li>The flag triggers a cleaning step that replaces non-numeric values with NaN before imputation</li>
</ol>

<p>This avoids the all-or-nothing behavior of <code>pd.to_numeric(errors='raise')</code>, which rejects the entire column because of a few bad entries.</p>

<h2>Extensibility: The TypePreparer Plugin</h2>

<p>Different domains have different types. Genomics has gene identifiers (ENSG00000141510). Finance has ISIN codes (US0378331005). HashPrep can't anticipate every domain, so it provides a plugin interface:</p>

<pre><code>class GeneIdPreparer(TypePreparer):
    name = "gene_id"
    pattern = r"^ENSG\\d{11}$"
    preprocessing = "label_encode"

    def detect(self, series):
        match_rate = series.str.match(self.pattern).mean()
        return match_rate > 0.8</code></pre>

<p>Custom preparers register into the detection cascade and run after built-in detectors. Users can override or extend default behavior without modifying the core engine.</p>

<h2>Accuracy</h2>

<p>The engine achieves <strong>94% accuracy</strong> on a benchmark of 200 real-world Kaggle datasets, measured against human-labeled ground truth. The remaining 6% are mostly ambiguous columns, integers with 20-50 unique values that could be either discrete counts or category codes. For those, HashPrep presents both interpretations with confidence scores and defers to domain expertise.</p>
`;
