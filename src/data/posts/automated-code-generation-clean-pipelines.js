export default `
<h2>The Notebook-to-Production Gap</h2>

<p>Data scientists write cleaning logic in Jupyter notebooks. Data engineers rewrite it for production. This translation step is where bugs breed. A <code>.fillna(0)</code> in the notebook becomes <code>.fillna(df.mean())</code> in production because someone "improved" it. The model trained on zero-filled data now gets mean-filled data at inference, and accuracy degrades.</p>

<p>HashPrep's <code>codegen</code> module eliminates this gap by <strong>generating production-ready Python code directly from the cleaning operations</strong> discovered during profiling. The output is a standalone, idempotent pipeline that produces identical transformations in training and inference.</p>

<h2>Representing Cleaning Steps as a Graph</h2>

<p>Each cleaning operation (imputation, encoding, type casting, outlier clipping) is a node in a DAG. Edges encode dependencies: you need column types before choosing imputation, and you need imputation before encoding categoricals.</p>

<svg viewBox="0 0 600 260" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;margin:32px auto;display:block;">
  <style>
    .gt { font-family: var(--font-body); font-size: 12px; fill: var(--text-primary); }
    .gl { font-family: var(--font-body); font-size: 13px; fill: var(--text-secondary); }
    .gbox { fill: var(--bg-surface); stroke: var(--border-default); stroke-width: 1.5; }
    .garrow { stroke: var(--text-muted); stroke-width: 1.5; fill: none; marker-end: url(#ah3); }
  </style>
  <defs>
    <marker id="ah3" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <path d="M0,0 L10,3.5 L0,7" fill="var(--text-muted)"/>
    </marker>
  </defs>
  <text x="300" y="18" class="gl" text-anchor="middle" font-weight="600">Cleaning Pipeline DAG</text>
  <rect x="215" y="30" width="170" height="36" class="gbox"/>
  <text x="300" y="53" class="gt" text-anchor="middle">Type Inference</text>
  <path d="M245 66 L155 90" class="garrow"/>
  <path d="M355 66 L445 90" class="garrow"/>
  <rect x="60" y="90" width="190" height="36" class="gbox"/>
  <text x="155" y="113" class="gt" text-anchor="middle">Missing Value Detection</text>
  <rect x="350" y="90" width="190" height="36" class="gbox"/>
  <text x="445" y="113" class="gt" text-anchor="middle">Outlier Detection</text>
  <path d="M155 126 L155 150" class="garrow"/>
  <path d="M445 126 L445 150" class="garrow"/>
  <rect x="60" y="150" width="190" height="36" class="gbox"/>
  <text x="155" y="173" class="gt" text-anchor="middle">Imputation Strategy</text>
  <rect x="350" y="150" width="190" height="36" class="gbox"/>
  <text x="445" y="173" class="gt" text-anchor="middle">Clip / Transform</text>
  <path d="M155 186 L255 210" class="garrow"/>
  <path d="M445 186 L345 210" class="garrow"/>
  <rect x="210" y="210" width="180" height="36" class="gbox" stroke="var(--accent)" stroke-width="2"/>
  <text x="300" y="233" class="gt" text-anchor="middle" fill="var(--accent)">Code Generation</text>
</svg>

<p>Each node is a Python dataclass with a <code>to_code()</code> method that returns the exact source needed to apply that operation:</p>

<pre><code>class ImputeMedian:
    column: str
    value: float

    def to_code(self):
        return f"df['{self.column}'].fillna({self.value}, inplace=True)"</code></pre>

<p>The DAG gets topologically sorted and each node's <code>to_code()</code> output is concatenated into a single Python module. The result is a flat, readable script with no framework dependencies.</p>

<h2>The fix_registry Pattern</h2>

<p>HashPrep discovers dozens of data quality issues during profiling: missing values, type mismatches, high cardinality, skewed distributions, potential leakage. Each issue type has candidate fixes. The <code>fix_registry</code> decouples <strong>issue detection</strong> from <strong>fix application</strong>.</p>

<pre><code>fix_registry = {
    "missing_numeric": [ImputeMedian, ImputeMean, ImputeZero],
    "missing_categorical": [ImputeMode, ImputeConstant],
    "high_cardinality": [FrequencyEncode, TargetEncode, DropColumn],
    "skewed_distribution": [LogTransform, BoxCoxTransform],
}</code></pre>

<p>When the profiler finds a "missing_numeric" issue on column "age", it queries the registry for candidates, evaluates each based on data characteristics (distribution shape, missing rate, downstream model type), and selects the best one. The selection logic is pluggable. Users can override default heuristics with custom ranking functions.</p>

<p>Adding a new fix strategy requires implementing <code>to_code()</code> and registering in the registry. No changes to detection or code generation systems.</p>

<h2>Type Inference Beyond dtypes</h2>

<p>Pandas <code>dtype</code> says a column contains integers. It does not say whether those integers are:</p>

<ul>
  <li>A continuous measurement (age, temperature)</li>
  <li>A discrete count (number of children, error count)</li>
  <li>A categorical identifier (ZIP code, user ID, product SKU)</li>
</ul>

<p>The distinction drives preprocessing. Continuous features get normalization. Discrete counts may need Poisson-aware transforms. Categorical identifiers should never be treated as numeric. An "average ZIP code" is meaningless.</p>

<p>HashPrep classifies each column into semantic types: <strong>Numeric-Continuous</strong>, <strong>Numeric-Discrete</strong>, <strong>Categorical-Nominal</strong>, <strong>Categorical-Ordinal</strong>, or <strong>Identifier</strong>. This classification drives all downstream fix selection.</p>

<h2>Generating Idempotent Code</h2>

<p>The generated pipeline must produce the same result whether applied once or twice. This is idempotency, and it matters for production reliability.</p>

<p>Non-idempotent: <code>df["price"] = df["price"].apply(log)</code>. Running this twice applies log twice, producing wrong values. The idempotent version checks state first:</p>

<pre><code>if "price_log_transformed" not in df.columns:
    df["price_log_transformed"] = np.log1p(df["price"])
    df.drop("price", axis=1, inplace=True)</code></pre>

<p>HashPrep wraps every transformation in idempotency guards. The generated module runs safely in the training pipeline, the CI test suite, and the inference API handler without side effects.</p>

<h2>From Interactive to Declarative</h2>

<p>The goal of <code>codegen</code> is to shift data preparation from interactive ad-hoc work to declarative, reproducible pipelines. Instead of manually writing fifty lines of pandas cleanup in a notebook, run HashPrep's profiler, review suggested fixes, approve or modify, and get a production-ready module.</p>

<p>The generated code becomes the <strong>single source of truth</strong> for how raw data becomes model-ready data. Versioned alongside the model, tested in CI, executed identically everywhere. The notebook stays useful for exploration but stops being the artifact that defines the pipeline.</p>
`;
