export default `
<h2>Randomness as a Computational Tool</h2>

<p>Monte Carlo methods use random sampling to solve deterministic problems that are hard to approach analytically. The classic demonstration: estimating pi using random points and a geometric test.</p>

<p>Inscribe a unit circle inside a 2x2 square. Generate random points uniformly in the square. The ratio of points inside the circle to total points approximates pi/4, because circle area (pi * r squared = pi) divided by square area (2 squared = 4) equals pi/4.</p>

<svg viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;margin:32px auto;display:block;">
  <style>
    .mt { font-family: var(--font-mono); font-size: 12px; fill: var(--text-primary); }
    .ml { font-family: var(--font-body); font-size: 13px; fill: var(--text-secondary); }
  </style>
  <text x="300" y="18" class="ml" text-anchor="middle" font-weight="600">Monte Carlo Pi Estimation</text>
  <g transform="translate(40, 30)">
    <rect x="0" y="0" width="220" height="220" fill="none" stroke="var(--border-default)" stroke-width="2"/>
    <circle cx="110" cy="110" r="110" fill="none" stroke="var(--accent)" stroke-width="2"/>
    <circle cx="45" cy="80" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="130" cy="45" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="90" cy="150" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="160" cy="120" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="70" cy="60" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="110" cy="180" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="50" cy="130" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="170" cy="80" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="80" cy="110" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="140" cy="170" r="4" fill="var(--accent)" opacity="0.8"/>
    <circle cx="15" cy="15" r="4" fill="var(--text-muted)" opacity="0.8"/>
    <circle cx="200" cy="20" r="4" fill="var(--text-muted)" opacity="0.8"/>
    <circle cx="10" cy="200" r="4" fill="var(--text-muted)" opacity="0.8"/>
    <circle cx="205" cy="195" r="4" fill="var(--text-muted)" opacity="0.8"/>
    <circle cx="195" cy="12" r="4" fill="var(--text-muted)" opacity="0.8"/>
  </g>
  <g transform="translate(300, 50)">
    <text x="0" y="0" class="ml" font-weight="500">Algorithm:</text>
    <text x="0" y="24" class="mt">for i in 1..N:</text>
    <text x="0" y="44" class="mt">  x = random(-1, 1)</text>
    <text x="0" y="64" class="mt">  y = random(-1, 1)</text>
    <text x="0" y="84" class="mt">  if x*x + y*y &lt;= 1:</text>
    <text x="0" y="104" class="mt">    inside++</text>
    <text x="0" y="134" class="mt">pi = 4 * inside / N</text>
    <text x="0" y="170" class="ml" fill="var(--accent)">&#x25CF; inside circle</text>
    <text x="0" y="190" class="ml" fill="var(--text-muted)">&#x25CF; outside circle</text>
  </g>
</svg>

<pre><code>double estimate_pi(size_t n_samples, std::mt19937&amp; rng) {
    std::uniform_real_distribution&lt;double&gt; dist(-1.0, 1.0);
    size_t inside = 0;

    for (size_t i = 0; i &lt; n_samples; ++i) {
        double x = dist(rng);
        double y = dist(rng);
        if (x * x + y * y &lt;= 1.0) {
            ++inside;
        }
    }

    return 4.0 * static_cast&lt;double&gt;(inside) / static_cast&lt;double&gt;(n_samples);
}</code></pre>

<h2>Why rand() Is Not Enough</h2>

<p>The C standard <code>rand()</code> is a linear congruential generator with known problems: short period (often 2 to the 31), correlated consecutive values, poor higher-dimensional distribution. For Monte Carlo, these directly produce systematic bias.</p>

<p>The Mersenne Twister (<code>std::mt19937</code>) has a period of 2 to the 19937 minus 1, passes all standard randomness tests (Diehard, TestU01), and produces 623-dimensionally equidistributed values. Measurable difference:</p>

<pre><code>PRNG             N=10,000,000    Error vs pi
rand()           3.14182         0.00023 (biased low)
std::mt19937     3.14158         0.00001
PCG-64           3.14160         0.00001</code></pre>

<p>For Pi, the rand() bias is small. For Monte Carlo in higher dimensions (option pricing, particle physics), poor PRNG quality gives systematically wrong results that look plausible. That is the worst kind of error.</p>

<h2>Convergence: The 1/sqrt(N) Problem</h2>

<p>Monte Carlo converges at <strong>1/sqrt(N)</strong>:</p>

<ul>
  <li>1,000 samples: about 2 digits of accuracy</li>
  <li>1,000,000 samples: about 3 digits</li>
  <li>1,000,000,000 samples: about 4-5 digits</li>
</ul>

<p>Each additional digit of accuracy costs <strong>100x more samples</strong>. For pi estimation, this convergence rate is impractical (we know pi to trillions of digits analytically). But for problems without analytical solutions, high-dimensional integrals, complex system simulations, Monte Carlo's guaranteed 1/sqrt(N) convergence regardless of dimensionality makes it the only practical method.</p>

<svg viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;margin:32px auto;display:block;">
  <style>
    .et { font-family: var(--font-mono); font-size: 11px; fill: var(--text-primary); }
    .el { font-family: var(--font-body); font-size: 13px; fill: var(--text-secondary); }
  </style>
  <text x="300" y="16" class="el" text-anchor="middle" font-weight="600">Convergence: Estimate vs. True Pi</text>
  <g transform="translate(60, 30)">
    <line x1="0" y1="160" x2="480" y2="160" stroke="var(--border-default)" stroke-width="1.5"/>
    <line x1="0" y1="0" x2="0" y2="160" stroke="var(--border-default)" stroke-width="1.5"/>
    <line x1="0" y1="80" x2="480" y2="80" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.6"/>
    <text x="485" y="83" class="et" fill="var(--accent)">pi</text>
    <text x="-10" y="165" class="et" text-anchor="end">2.8</text>
    <text x="-10" y="83" class="et" text-anchor="end">pi</text>
    <text x="-10" y="5" class="et" text-anchor="end">3.5</text>
    <text x="40" y="180" class="et" text-anchor="middle">10^2</text>
    <text x="160" y="180" class="et" text-anchor="middle">10^4</text>
    <text x="320" y="180" class="et" text-anchor="middle">10^6</text>
    <text x="460" y="180" class="et" text-anchor="middle">10^8</text>
    <path d="M20,30 L40,130 L60,50 L80,95 L120,65 L160,88 L200,75 L240,82 L280,78 L320,80 L360,79.5 L400,80.2 L440,79.9 L470,80" stroke="var(--accent)" stroke-width="2" fill="none"/>
    <text x="240" y="200" class="el" text-anchor="middle">Samples (N), log scale</text>
  </g>
</svg>

<h2>Gnuplot Visualization</h2>

<p>MCPI generates convergence plots via Gnuplot, driven from C++. The program outputs data at logarithmic intervals during simulation:</p>

<pre><code>void plot_convergence(const std::vector&lt;std::pair&lt;size_t, double&gt;&gt;&amp; data) {
    FILE* gp = popen("gnuplot -persistent", "w");

    fprintf(gp, "set terminal svg size 800,400\\n");
    fprintf(gp, "set output 'convergence.svg'\\n");
    fprintf(gp, "set xlabel 'Samples (N)'\\n");
    fprintf(gp, "set ylabel 'Estimated Pi'\\n");
    fprintf(gp, "set logscale x\\n");
    fprintf(gp, "set yrange [3.0:3.3]\\n");
    fprintf(gp, "set arrow from 1,3.14159 to 1e9,3.14159 nohead dt 2\\n");
    fprintf(gp, "plot '-' with lines title 'MC Estimate'\\n");

    for (const auto&amp; [n, pi_est] : data) {
        fprintf(gp, "%zu %f\\n", n, pi_est);
    }
    fprintf(gp, "e\\n");
    pclose(gp);
}</code></pre>

<p>Gnuplot via <code>popen</code> is deliberately low-tech. It avoids C++ plotting library dependencies (matplotlib-cpp, ROOT) that would bloat the project. SVG output is portable and embeds directly in reports.</p>

<h2>Beyond Pi</h2>

<p>Pi estimation is a teaching exercise. Monte Carlo becomes essential when:</p>

<ul>
  <li><strong>Dimensionality is high:</strong> Numerical integration in 10+ dimensions is intractable with grid methods (curse of dimensionality). Monte Carlo's 1/sqrt(N) rate is independent of dimension count.</li>
  <li><strong>The domain is irregular:</strong> Volume of a complex shape is trivial with Monte Carlo (count inside vs. total) but hard analytically.</li>
  <li><strong>The system is stochastic:</strong> Particle interactions, financial markets, epidemiological spread all require sampling from probability distributions.</li>
</ul>

<p>The same code structure (generate random inputs, evaluate condition, accumulate statistics) scales to any domain needing sampling-based estimation. PRNG quality, convergence rates, and visualization transfer directly.</p>
`;
