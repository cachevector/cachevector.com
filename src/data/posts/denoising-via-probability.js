export default `
<h2>Statistical Denoising</h2>

<p>Every digital image from a sensor contains noise: random pixel intensity variations from photon counting, thermal fluctuations, and readout errors. Given a noisy observation, can we recover the true signal?</p>

<p>Deep learning approaches (DnCNN, Noise2Noise) train networks to map noisy images to clean ones. They work well but need training data, significant compute, and can hallucinate detail that was never in the original scene.</p>

<p>Noise2Normal uses pure statistical averaging based on the Central Limit Theorem. No training, no learned parameters, no hallucination risk.</p>

<h2>The Math</h2>

<p>Model a noisy image as true signal plus zero-mean Gaussian noise:</p>

<pre><code>I_observed = I_true + N(0, sigma squared)</code></pre>

<p>The expected value of the observation equals the true signal:</p>

<pre><code>E[I_observed] = E[I_true] + E[N(0, sigma squared)] = I_true + 0 = I_true</code></pre>

<p>By the CLT, the average of N independent noisy observations of the same scene converges to the true signal. Standard error decreases as <strong>1/sqrt(N)</strong>:</p>

<pre><code>sigma_mean = sigma_noise / sqrt(N)</code></pre>

<svg viewBox="0 0 600 220" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;margin:32px auto;display:block;">
  <style>
    .nt { font-family: var(--font-mono); font-size: 12px; fill: var(--text-primary); }
    .nl { font-family: var(--font-body); font-size: 13px; fill: var(--text-secondary); }
  </style>
  <text x="300" y="18" class="nl" text-anchor="middle" font-weight="600">Noise Reduction vs. Sample Count (1/sqrt(N) convergence)</text>
  <g transform="translate(60, 35)">
    <line x1="0" y1="160" x2="480" y2="160" stroke="var(--border-default)" stroke-width="1.5"/>
    <line x1="0" y1="160" x2="0" y2="0" stroke="var(--border-default)" stroke-width="1.5"/>
    <text x="240" y="185" class="nl" text-anchor="middle">Number of samples (N)</text>
    <text x="-15" y="85" class="nl" text-anchor="middle" transform="rotate(-90, -15, 85)">Noise</text>
    <text x="30" y="175" class="nt">1</text>
    <text x="120" y="175" class="nt">4</text>
    <text x="240" y="175" class="nt">16</text>
    <text x="360" y="175" class="nt">64</text>
    <text x="450" y="175" class="nt">256</text>
    <path d="M30,15 Q60,60 120,80 Q180,110 240,125 Q330,140 450,150" stroke="var(--accent)" stroke-width="2.5" fill="none"/>
    <line x1="0" y1="150" x2="480" y2="150" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="4,4"/>
    <text x="485" y="153" class="nt" fill="var(--text-muted)">0</text>
    <circle cx="30" cy="15" r="5" fill="var(--accent)"/>
    <circle cx="120" cy="80" r="5" fill="var(--accent)"/>
    <circle cx="240" cy="125" r="5" fill="var(--accent)"/>
    <circle cx="360" cy="140" r="5" fill="var(--accent)"/>
    <circle cx="450" cy="148" r="5" fill="var(--accent)"/>
    <text x="55" y="12" class="nt" fill="var(--accent)">N=1: sigma</text>
    <text x="140" y="75" class="nt" fill="var(--accent)">N=4: sigma/2</text>
    <text x="255" y="120" class="nt" fill="var(--accent)">N=16: sigma/4</text>
  </g>
</svg>

<p>4 samples halve the noise. 16 samples cut it to a quarter. 100 samples bring noise to 10% of original. The relationship is exact for independent Gaussian noise and approximately correct for other zero-mean distributions.</p>

<h2>C++ Implementation with OpenCV</h2>

<p>The algorithm is simple: accumulate pixel values across N frames and divide by N. The challenge is handling accumulation without overflow and maximizing throughput for large images.</p>

<pre><code>void denoise_clt(const std::vector&lt;cv::Mat&gt;&amp; frames, cv::Mat&amp; output) {
    CV_Assert(!frames.empty());

    int rows = frames[0].rows;
    int cols = frames[0].cols;
    int channels = frames[0].channels();

    cv::Mat accumulator = cv::Mat::zeros(rows, cols, CV_64FC(channels));

    for (const auto&amp; frame : frames) {
        cv::Mat converted;
        frame.convertTo(converted, CV_64F);
        accumulator += converted;
    }

    accumulator /= static_cast&lt;double&gt;(frames.size());
    accumulator.convertTo(output, frames[0].type());
}</code></pre>

<p>Implementation details:</p>

<ul>
  <li><strong>CV_64F accumulator:</strong> 64-bit float prevents overflow. An 8-bit image across 1000 frames could reach 255,000, well beyond 32-bit integer range at 4,194.</li>
  <li><strong>In-place addition:</strong> OpenCV's <code>+=</code> on <code>cv::Mat</code> does element-wise addition without temporary matrices.</li>
  <li><strong>Type preservation:</strong> Final <code>convertTo</code> matches the output to the input format (typically CV_8UC3 for color).</li>
</ul>

<h2>Parallelization with OpenMP</h2>

<p>An 800x600 RGB image has 1,440,000 values per frame. Accumulating 100 frames means 144 million additions. Sequential execution takes about 200ms. Parallelization helps for real-time or batch workloads.</p>

<pre><code>#pragma omp parallel for collapse(2)
for (int r = 0; r &lt; rows; ++r) {
    for (int c = 0; c &lt; cols * channels; ++c) {
        double sum = 0.0;
        for (size_t f = 0; f &lt; frames.size(); ++f) {
            sum += frames[f].ptr&lt;uint8_t&gt;(r)[c];
        }
        output.ptr&lt;uint8_t&gt;(r)[c] =
            static_cast&lt;uint8_t&gt;(sum / frames.size());
    }
}</code></pre>

<p><code>collapse(2)</code> merges the row and column loops into a single parallel iteration space, improving load balancing when dimensions don't divide evenly by thread count. On 8 cores, this gives about 5.5x speedup (the inner frame loop limits perfect scaling).</p>

<h2>The N vs. Compute Tradeoff</h2>

<p>1/sqrt(N) convergence means diminishing returns. Going from 1 to 4 samples halves noise. Going from 100 to 400 also halves the remaining noise, but requires 4x more data and compute for a much smaller absolute improvement.</p>

<p>In scientific imaging (microscopy, astronomy), extra frames cost real resources: exposure time, radiation dose, telescope scheduling. The optimal N depends on the raw SNR and the required output SNR.</p>

<p>Noise2Normal includes a utility for computing required N:</p>

<pre><code>N_required = (sigma_input / sigma_target) squared</code></pre>

<p>Input noise sigma = 20, target sigma = 2: need N = 100 frames. Target sigma = 1: need N = 400. Four times more data for 2x improvement.</p>

<h2>When to Use Statistical Averaging</h2>

<p>Deep learning denoisers win when:</p>

<ul>
  <li>Only one noisy observation is available (N = 1)</li>
  <li>The noise model is complex (spatially varying, signal-dependent)</li>
  <li>Perceptual quality matters more than mathematical accuracy</li>
</ul>

<p>Statistical averaging wins when:</p>

<ul>
  <li>Multiple observations of the same scene are available</li>
  <li>Data integrity is paramount: no hallucinated details, no learned artifacts</li>
  <li>The noise is approximately zero-mean and independent across frames</li>
  <li>Reproducibility is required: same inputs always produce the same output</li>
</ul>

<p>In scientific imaging, the second set of criteria dominates. A microscopy lab publishing a paper cannot use a denoiser that might hallucinate cellular structures. A satellite pipeline needs deterministic results. For these applications, CLT-based averaging is the correct tool.</p>
`;
