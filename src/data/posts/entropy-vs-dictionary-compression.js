export default `
<h2>Two Approaches to Finding Redundancy</h2>

<p>Every compression algorithm bets that the input contains redundancy that can be encoded more efficiently. The two dominant strategies find and exploit redundancy in different ways.</p>

<p><strong>Entropy coders</strong> (Huffman, Arithmetic, ANS) assign shorter codes to more frequent symbols. Optimal for memoryless sources where each symbol's probability is independent of neighbors. <strong>Dictionary coders</strong> (LZ77, LZ78, LZW) find repeated sequences and replace them with back-references. They exploit sequential redundancy, the tendency for byte patterns to recur.</p>

<p>Modern compressors like Zstandard and DEFLATE combine both: a dictionary coder finds repetitions, then an entropy coder compactly encodes the references. Understanding each piece matters for understanding the whole.</p>

<svg viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;margin:32px auto;display:block;">
  <style>
    .ct { font-family: var(--font-mono); font-size: 11px; fill: var(--text-primary); }
    .cl { font-family: var(--font-body); font-size: 13px; fill: var(--text-secondary); }
    .cbox { fill: var(--bg-surface); stroke: var(--border-default); stroke-width: 1.5; }
  </style>
  <text x="300" y="16" class="cl" text-anchor="middle" font-weight="600">Modern Compression Pipeline</text>
  <rect x="20" y="35" width="130" height="50" class="cbox"/>
  <text x="85" y="55" class="ct" text-anchor="middle">Raw Input</text>
  <text x="85" y="72" class="ct" text-anchor="middle" fill="var(--text-muted)">"ABCABCABC..."</text>
  <path d="M150 60 L180 60" stroke="var(--text-muted)" stroke-width="1.5" marker-end="url(#ah5)"/>
  <rect x="180" y="35" width="130" height="50" class="cbox" stroke="var(--accent)" stroke-width="2"/>
  <text x="245" y="55" class="ct" text-anchor="middle" fill="var(--accent)">LZ77 Dictionary</text>
  <text x="245" y="72" class="ct" text-anchor="middle" fill="var(--text-muted)">Find repeats</text>
  <path d="M310 60 L340 60" stroke="var(--text-muted)" stroke-width="1.5" marker-end="url(#ah5)"/>
  <rect x="340" y="35" width="130" height="50" class="cbox" stroke="var(--accent)" stroke-width="2"/>
  <text x="405" y="55" class="ct" text-anchor="middle" fill="var(--accent)">Entropy Coder</text>
  <text x="405" y="72" class="ct" text-anchor="middle" fill="var(--text-muted)">Huffman / ANS</text>
  <path d="M470 60 L500 60" stroke="var(--text-muted)" stroke-width="1.5" marker-end="url(#ah5)"/>
  <rect x="500" y="35" width="80" height="50" class="cbox"/>
  <text x="540" y="55" class="ct" text-anchor="middle">Output</text>
  <text x="540" y="72" class="ct" text-anchor="middle" fill="var(--text-muted)">Compressed</text>
  <defs>
    <marker id="ah5" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <path d="M0,0 L10,3.5 L0,7" fill="var(--text-muted)"/>
    </marker>
  </defs>
  <rect x="20" y="110" width="560" height="70" fill="var(--accent)" fill-opacity="0.15" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="300" y="132" class="cl" text-anchor="middle">DEFLATE = LZ77 + Huffman (used in gzip, PNG, ZIP)</text>
  <text x="300" y="152" class="cl" text-anchor="middle">Zstandard = LZ77 + ANS (faster, better ratios)</text>
  <text x="300" y="172" class="cl" text-anchor="middle" fill="var(--accent)">Combining both exploits sequential and frequency redundancy</text>
</svg>

<h2>Huffman Coding: Optimal Prefix-Free Codes</h2>

<p>Huffman assigns variable-length binary codes to symbols by frequency. More frequent symbols get shorter codes. The tree is built bottom-up:</p>

<ol>
  <li>Create a leaf node per symbol with its frequency</li>
  <li>Extract the two lowest-frequency nodes</li>
  <li>Create a parent with frequency equal to the sum of its children</li>
  <li>Repeat until one root remains</li>
</ol>

<p>The codes are <strong>prefix-free</strong>: no code is a prefix of another. This guarantees unambiguous decoding without delimiters.</p>

<pre><code>Symbol  Freq    Huffman Code
  'e'    120    0
  't'     90    10
  'a'     80    110
  'o'     75    1110
  'n'     70    1111</code></pre>

<p>Huffman achieves optimal compression for integer-length codes. Code length per symbol is ceil(-log2(p)) bits where p is the symbol probability. The gap between this ceiling and the true information content (-log2(p)) is wasted space. For skewed distributions, this gap adds up.</p>

<h2>LZ77: Sliding Window Dictionary</h2>

<p>LZ77 keeps a sliding window over recent input. When it finds a byte sequence matching a previous occurrence, it emits a <strong>back-reference</strong>: a (distance, length) pair.</p>

<pre><code>Input:  "ABCABCABCABC"
Output: A B C (3,3) (3,6)

Decoding:
"ABC" + copy 3 bytes from position -3 = "ABCABC"
"ABCABC" + copy 6 bytes from position -3 = "ABCABCABCABC"</code></pre>

<p>Window size controls the ratio/memory tradeoff. DEFLATE uses 32KB. Zstandard supports up to 128MB for long-range matches in large files.</p>

<h2>ANS: The Modern Breakthrough</h2>

<p>Asymmetric Numeral Systems, developed by Jarek Duda, reaches arithmetic-coding compression ratios at Huffman-level speed. The key: encoding information into a single natural number through state transitions.</p>

<p>Where Huffman rounds code lengths to integers, ANS uses <strong>fractional bits</strong>. A symbol with probability 0.3 gets about -log2(0.3) = 1.74 bits, not rounded to 2.</p>

<p>Practical impact: ANS achieves 1-3% better compression than Huffman on typical data at equal decode speed. This is why Zstandard (using FSE, Finite State Entropy) consistently beats DEFLATE in both speed and ratio.</p>

<h2>File-Type Behavior</h2>

<p>No single strategy is optimal for everything:</p>

<ul>
  <li><strong>Natural language:</strong> High word-level redundancy. LZ77 excels because phrases repeat. Entropy coding adds 10-15% on top.</li>
  <li><strong>Binary executables:</strong> Moderate byte-level patterns (opcodes repeat). Dictionary compression works well with large windows.</li>
  <li><strong>1-bit masks:</strong> RLE is optimal here, long runs of 0s and 1s compress to (value, count) pairs. LZ77 handles this poorly because match overhead exceeds savings for short runs.</li>
  <li><strong>Already-compressed data (JPEG, MP3):</strong> Near-maximum entropy. No compressor improves on it. Trying often increases size due to framing overhead.</li>
</ul>

<h2>Comprexx Benchmarks</h2>

<p>Comprexx implements Huffman, LZ77, and a simplified ANS as reference implementations. Benchmarked against production Zstandard on the Canterbury corpus:</p>

<pre><code>Algorithm        Ratio    Encode (MB/s)    Decode (MB/s)
Huffman-only     1.8:1    420              510
LZ77-only        2.4:1    85               310
LZ77 + Huffman   3.1:1    72               290
Zstandard -3     3.3:1    380              1200
Zstandard -19    3.8:1    12               1200</code></pre>

<p>Combining dictionary and entropy coding is essential for competitive ratios. Zstandard's engineering (tuned hash tables, optimized FSE, SIMD decoding) provides order-of-magnitude speed gains over textbook implementations.</p>

<h2>Neural Compression</h2>

<p>Neural codecs use learned latent representations to exceed traditional methods on specific data types. For images, COIN and COOL-CHIC approach VVC quality at lower bitrates. The cost: encoding can be 100-1000x slower than Zstandard.</p>

<p>For Comprexx, the research interest is lossy compression of high-redundancy binary data: sensor telemetry, log files, time-series where small precision losses are acceptable. This sits between traditional lossless compression and image/video codecs, and is underexplored in the neural compression literature.</p>
`;
