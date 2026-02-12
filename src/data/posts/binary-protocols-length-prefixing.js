export default `
<h2>The Cost of Human Readability</h2>

<p>JSON is everywhere. Human-readable, self-describing, supported by every language. Also remarkably inefficient for machine-to-machine communication. The string <code>{"temperature": 23.5}</code> uses 22 bytes to encode a value that occupies 8 bytes in memory.</p>

<p>Byte overhead is not the main performance cost. Parsing is. A JSON parser scans every byte, handles escape sequences, tracks nesting, validates UTF-8, and builds an in-memory representation. For a 1MB payload, even the fastest parsers (simdjson) spend about 1ms on parsing alone. At millions of messages per second, parsing dominates.</p>

<h2>Delimiters vs. Length Prefixes</h2>

<p>Text formats like JSON and CSV use delimiters to separate fields: commas, colons, braces, newlines. Two problems follow from this:</p>

<svg viewBox="0 0 600 220" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;margin:32px auto;display:block;">
  <style>
    .bt { font-family: var(--font-mono); font-size: 11px; fill: var(--text-primary); }
    .bl { font-family: var(--font-body); font-size: 13px; fill: var(--text-secondary); }
    .bbox { fill: var(--bg-surface); stroke: var(--border-default); stroke-width: 1.5; }
  </style>
  <text x="300" y="16" class="bl" text-anchor="middle" font-weight="600">Delimiter vs Length-Prefix: Field Access</text>
  <g transform="translate(20, 35)">
    <text x="260" y="10" class="bl" text-anchor="middle">Delimited (must scan all bytes to find field N)</text>
    <rect x="0" y="20" width="60" height="30" class="bbox"/>
    <text x="30" y="40" class="bt" text-anchor="middle">field1</text>
    <rect x="60" y="20" width="10" height="30" fill="var(--accent)" fill-opacity="0.4" stroke="var(--accent)" stroke-width="1.5"/>
    <text x="65" y="40" class="bt" text-anchor="middle" fill="var(--accent)">,</text>
    <rect x="70" y="20" width="80" height="30" class="bbox"/>
    <text x="110" y="40" class="bt" text-anchor="middle">field2</text>
    <rect x="150" y="20" width="10" height="30" fill="var(--accent)" fill-opacity="0.4" stroke="var(--accent)" stroke-width="1.5"/>
    <text x="155" y="40" class="bt" text-anchor="middle" fill="var(--accent)">,</text>
    <rect x="160" y="20" width="100" height="30" class="bbox"/>
    <text x="210" y="40" class="bt" text-anchor="middle">field3 (long)</text>
    <rect x="260" y="20" width="10" height="30" fill="var(--accent)" fill-opacity="0.4" stroke="var(--accent)" stroke-width="1.5"/>
    <text x="265" y="40" class="bt" text-anchor="middle" fill="var(--accent)">,</text>
    <rect x="270" y="20" width="60" height="30" class="bbox" stroke="var(--accent)" stroke-width="2"/>
    <text x="300" y="40" class="bt" text-anchor="middle" fill="var(--accent)">field4</text>
    <path d="M0 62 L330 62" stroke="var(--accent)" stroke-width="2" stroke-dasharray="3,3"/>
    <text x="165" y="78" class="bt" text-anchor="middle" fill="var(--accent)">must scan 330 bytes to reach field4</text>
  </g>
  <g transform="translate(20, 130)">
    <text x="260" y="10" class="bl" text-anchor="middle">Length-Prefixed (jump directly to field N)</text>
    <rect x="0" y="20" width="20" height="30" fill="var(--accent)" fill-opacity="0.25" stroke="var(--accent)" stroke-width="1.5"/>
    <text x="10" y="40" class="bt" text-anchor="middle" fill="var(--accent)">6</text>
    <rect x="20" y="20" width="60" height="30" class="bbox"/>
    <text x="50" y="40" class="bt" text-anchor="middle">field1</text>
    <rect x="80" y="20" width="20" height="30" fill="var(--accent)" fill-opacity="0.25" stroke="var(--accent)" stroke-width="1.5"/>
    <text x="90" y="40" class="bt" text-anchor="middle" fill="var(--accent)">8</text>
    <rect x="100" y="20" width="80" height="30" class="bbox"/>
    <text x="140" y="40" class="bt" text-anchor="middle">field2</text>
    <rect x="180" y="20" width="20" height="30" fill="var(--accent)" fill-opacity="0.25" stroke="var(--accent)" stroke-width="1.5"/>
    <text x="190" y="40" class="bt" text-anchor="middle" fill="var(--accent)">10</text>
    <rect x="200" y="20" width="100" height="30" class="bbox"/>
    <text x="250" y="40" class="bt" text-anchor="middle">field3</text>
    <rect x="300" y="20" width="20" height="30" fill="var(--accent)" fill-opacity="0.25" stroke="var(--accent)" stroke-width="1.5"/>
    <text x="310" y="40" class="bt" text-anchor="middle" fill="var(--accent)">6</text>
    <rect x="320" y="20" width="60" height="30" class="bbox" stroke="var(--accent)" stroke-width="2"/>
    <text x="350" y="40" class="bt" text-anchor="middle" fill="var(--accent)">field4</text>
    <path d="M0 62 L300 62" stroke="var(--accent)" stroke-width="2"/>
    <text x="150" y="78" class="bt" text-anchor="middle" fill="var(--accent)">sum lengths: jump to byte 300 in O(1)</text>
  </g>
</svg>

<ol>
  <li><strong>Escaping overhead:</strong> If a field value contains the delimiter (comma in CSV, quote in JSON), it must be escaped. This adds bytes and parsing complexity. Nested escaping is a common source of parser bugs.</li>
  <li><strong>Sequential scanning:</strong> Reading field N requires scanning fields 1 through N-1, because boundaries are only found by locating delimiters. Random field access is O(N).</li>
</ol>

<p>Length-prefixed formats solve both. Each field is preceded by its byte length. The parser never scans field contents for special characters and can skip to any field by summing preceding lengths.</p>

<h2>The TOON Format</h2>

<p>TokenWise implements TOON (Token-Oriented Object Notation), a binary serialization format designed for maximum throughput:</p>

<pre><code>[field_count: uint16]
[field_1_length: uint32] [field_1_data: bytes]
[field_2_length: uint32] [field_2_data: bytes]
...
[field_N_length: uint32] [field_N_data: bytes]</code></pre>

<p>Each message starts with a 2-byte field count, then N (length, data) pairs. Length prefix is 4 bytes (uint32), supporting fields up to 4GB. A compact variant uses 2-byte (uint16) lengths, capping at 64KB.</p>

<h3>O(1) Field Skipping</h3>

<p>To access field K without reading 0 through K-1, sum the first K lengths:</p>

<pre><code>offset := 2  // skip field_count
for i := 0; i < k; i++ {
    fieldLen := binary.BigEndian.Uint32(buf[offset:])
    offset += 4 + int(fieldLen)  // skip length + data
}
// buf[offset:] now points to field K's length prefix</code></pre>

<p>Still O(K) in field count, but each iteration is one 4-byte read and an integer add. No scanning, no character comparison, no escape handling. Messages typically have 5-20 fields, so this is effectively constant time.</p>

<h2>Go Benchmarks</h2>

<p>Benchmarked against <code>encoding/json</code> on a typical API response with 8 fields: 3 strings, 2 integers, 2 floats, 1 boolean.</p>

<pre><code>Benchmark                    ops/sec     bytes/op    allocs/op
BenchmarkJSON_Marshal        850,000     384         5
BenchmarkJSON_Unmarshal      420,000     672         12
BenchmarkTOON_Encode       5,200,000      96         1
BenchmarkTOON_Decode       8,100,000      64         1</code></pre>

<p>TOON encoding is <strong>6x faster</strong> with 4x fewer bytes. Decoding is <strong>19x faster</strong> with 10x fewer allocations. The allocation difference matters in Go, where GC pressure directly impacts tail latency.</p>

<h2>Memory Safety</h2>

<p>The main security risk: buffer overflow from malicious length values. A corrupted message could specify a 4GB field length, causing the reader to allocate massive memory or read past buffer boundaries.</p>

<p>TokenWise enforces:</p>

<ul>
  <li><strong>Maximum message size:</strong> Configurable cap (default 16MB). Messages exceeding it are rejected before any field parsing.</li>
  <li><strong>Length validation:</strong> Each field length checked against remaining buffer. If <code>offset + length > buffer_size</code>, reject.</li>
  <li><strong>Field count limit:</strong> Max 1024 fields per message. Prevents allocation attacks via high field counts.</li>
</ul>

<h2>Protocol Evolution</h2>

<p>Binary format backward compatibility is a persistent challenge. Add a field to JSON, old consumers ignore it. Add a field to a positional binary format, all existing parsers break.</p>

<p>TOON handles this with the field count at message start. Consumers read fields they understand by position and skip unknown trailing fields by reading and discarding their length-prefixed data. Forward-compatible extensibility without schema negotiation.</p>

<h2>When to Use Binary Serialization</h2>

<p>TOON is appropriate for:</p>

<ul>
  <li><strong>Internal microservice communication:</strong> Both sides controlled by the same team. Human readability adds nothing to machine traffic.</li>
  <li><strong>High-throughput pipelines:</strong> Log ingestion, metrics, event streaming, where parsing shows up in CPU profiles.</li>
  <li><strong>Latency-sensitive paths:</strong> Trading systems, real-time bidding, game servers, where parsing microseconds matter.</li>
</ul>

<p>JSON is still better for public APIs (human debugging), config files (human editing), and any context where humans inspect the data more than machines parse it. TokenWise provides a better tool for cases where JSON's readability is unused overhead.</p>
`;
