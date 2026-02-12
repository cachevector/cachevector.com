export default `
<h2>When Your Model Degrades Without Warning</h2>

<p>A model that hits 95% accuracy during development can drop to 70% in production. No code change. No infrastructure failure. No pipeline error. The incoming data distribution shifted relative to the training distribution, and the model's predictions became increasingly wrong.</p>

<p>Drift doesn't trigger errors. The model produces predictions. The API returns 200s. Dashboards show green. Everything looks fine except the predictions are garbage.</p>

<h2>Why Simple Statistics Miss It</h2>

<p>The most common monitoring approach tracks summary statistics: mean, standard deviation, min, max. If a feature's mean shifts by more than 2 standard deviations, raise an alert.</p>

<p>This has a blind spot: <strong>distribution shape changes that preserve summary statistics</strong>. A feature can shift from normal to bimodal while keeping nearly identical mean and variance. The model learned decision boundaries calibrated to the original distribution and will misclassify observations in the new modes.</p>

<svg viewBox="0 0 600 220" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;margin:32px auto;display:block;">
  <style>
    .dt { font-family: var(--font-mono); font-size: 12px; fill: var(--text-primary); }
    .dl { font-family: var(--font-body); font-size: 13px; fill: var(--text-secondary); }
    .dl-bold { font-family: var(--font-body); font-size: 13px; fill: var(--text-primary); font-weight: 500; }
  </style>
  <text x="300" y="18" class="dl-bold" text-anchor="middle">Same Mean/Std, Different Distributions</text>

  <g transform="translate(30, 40)">
    <text x="120" y="10" class="dl" text-anchor="middle">Training Distribution</text>
    <line x1="0" y1="150" x2="240" y2="150" stroke="var(--border-default)" stroke-width="1.5"/>
    <line x1="0" y1="150" x2="0" y2="30" stroke="var(--border-default)" stroke-width="1.5"/>
    <path d="M10,148 Q60,145 80,130 Q100,100 120,50 Q140,100 160,130 Q180,145 230,148" stroke="var(--accent)" stroke-width="2.5" fill="var(--accent)" fill-opacity="0.15"/>
    <text x="120" y="170" class="dt" text-anchor="middle">mu=50, sigma=15</text>
  </g>

  <g transform="translate(330, 40)">
    <text x="120" y="10" class="dl" text-anchor="middle">Production Distribution</text>
    <line x1="0" y1="150" x2="240" y2="150" stroke="var(--border-default)" stroke-width="1.5"/>
    <line x1="0" y1="150" x2="0" y2="30" stroke="var(--border-default)" stroke-width="1.5"/>
    <path d="M10,148 Q30,140 50,80 Q65,140 80,148 Q100,148 140,148 Q160,140 180,80 Q195,140 210,148 L230,148" stroke="var(--accent)" stroke-width="2.5" fill="var(--accent)" fill-opacity="0.15"/>
    <text x="120" y="170" class="dt" text-anchor="middle">mu~50, sigma~15 (bimodal)</text>
  </g>
</svg>

<h2>Kolmogorov-Smirnov Test for Continuous Variables</h2>

<p>The KS test compares empirical CDFs of two samples. The test statistic D is the maximum absolute vertical distance between them:</p>

<pre><code>D = max|F_train(x) - F_production(x)|</code></pre>

<p>Unlike moment-based comparisons, KS is sensitive to any distributional difference: location shifts, scale changes, shape changes. It is non-parametric and makes no assumptions about the underlying distribution.</p>

<p>HashPrep runs the KS test on every continuous feature:</p>

<pre><code>from scipy.stats import ks_2samp

def detect_drift_continuous(train_col, prod_col, alpha=0.001):
    statistic, p_value = ks_2samp(train_col.dropna(), prod_col.dropna())
    return {
        "feature": train_col.name,
        "test": "ks_2samp",
        "statistic": statistic,
        "p_value": p_value,
        "drift_detected": p_value < alpha,
    }</code></pre>

<p>We default to p &lt; <strong>0.001</strong> instead of the usual 0.05. With large production datasets, even trivial distributional differences reach significance at 0.05. The stricter threshold filters for drift that actually affects model performance.</p>

<h2>Chi-Square for Categorical Drift</h2>

<p>KS assumes continuous data. For categorical features (country, product category, user segment), we use Chi-Square Goodness-of-Fit. It compares observed frequencies against expected frequencies from the training distribution:</p>

<pre><code>chi2 = sum((O_i - E_i)^2 / E_i)</code></pre>

<p>Where <code>O_i</code> is the observed count of category i in production and <code>E_i</code> is the expected count from training proportions. A significant result means the category distribution has shifted.</p>

<p>Implementation detail: the test breaks if any <code>E_i</code> is zero (a category in production that never appeared in training). HashPrep handles this with a "novel category" alert that fires before the Chi-Square test, flagging previously unseen values as high-priority drift indicators.</p>

<h2>Decoupling Detection from Training</h2>

<p>A common mistake is embedding drift detection in the training pipeline. This means you can only check for drift when you retrain, which might be monthly. Drift can happen in hours.</p>

<p>HashPrep's drift detection runs as a <strong>standalone monitoring service</strong> on a configurable schedule, independent of model training:</p>

<ol>
  <li><strong>Reference snapshot:</strong> Statistical summary of training data (CDFs, category proportions, moments) stored alongside the model</li>
  <li><strong>Incoming window:</strong> Most recent N observations from production</li>
  <li><strong>Comparison:</strong> KS/Chi-Square tests between reference and incoming window</li>
  <li><strong>Alert:</strong> Structured output with per-feature drift scores when any feature exceeds threshold</li>
</ol>

<p>Detection can run hourly while retraining runs monthly. It also enables A/B testing different thresholds without touching the training pipeline.</p>

<h2>Setting Thresholds in Practice</h2>

<p>Choosing p-value thresholds is a tradeoff between sensitivity and alert fatigue:</p>

<ul>
  <li><strong>p &lt; 0.001:</strong> Catches severe drift that will meaningfully degrade performance. Low false positive rate. Good for triggering automated retraining.</li>
  <li><strong>p &lt; 0.01:</strong> Catches moderate drift that may or may not affect accuracy. Good for dashboard warnings reviewed by humans.</li>
  <li><strong>p &lt; 0.05:</strong> Too sensitive for production. At sample sizes above 10K, nearly every feature triggers this threshold.</li>
</ul>

<p>HashPrep uses 0.001 for critical alerts and logs everything at 0.01 for observability. Drift detection in production is an engineering signal, not an academic hypothesis test. Calibrate it to the cost of false positives vs. false negatives in your system.</p>
`;
