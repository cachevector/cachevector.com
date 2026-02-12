<script>
  import ProductCard from "../components/ProductCard.svelte";

  const projects = [
    {
      name: "HashPrep",
      description: "Intelligent dataset debugging and preparation platform that catches critical data quality issues before they derail your ML pipeline.",
      status: "Beta",
      features: ["Smart Detection", "Auto-Fix Suggestions", "Comprehensive Profiling", "Pipeline Integration"],
      links: {
        website: "https://hashprep.com",
        pypi: "https://pypi.org/project/hashprep/",
        github: "https://github.com/cachevector/hashprep",
      },
    },
    {
      name: "FuzzyBunny",
      description: "High-performance string matching engine with C++ SIMD optimization and Pybind11 bindings for Python runtimes.",
      status: "Live",
      features: ["Levenshtein Optimization", "Token-Based Similarity", "Hybrid Scoring", "Unicode Support"],
      links: {
        pypi: "https://pypi.org/project/fuzzybunny/",
        github: "https://github.com/cachevector/fuzzybunny",
      },
    },
    {
      name: "Noise2Normal",
      description: "Statistical image restoration using Central Limit Theorem convergence for noise-free reconstruction without neural networks.",
      status: "Research",
      features: ["CLT-Based Denoising", "OpenCV Integration"],
      links: {
        github: "https://github.com/cachevector/noise2normal",
      },
    },
    {
      name: "Comprexx",
      description: "Modern compression engineering exploring entropy coding, dictionary methods, and asymmetric numeral systems.",
      status: "Research",
      features: ["Huffman Coding", "LZ77", "ANS Analysis"],
      links: {
        github: "https://github.com/cachevector/comprexx",
      },
    },
    {
      name: "TokenWise",
      description: "Efficient binary data serialization with length-prefixed protocols designed for high-throughput systems.",
      status: "Research",
      features: ["TOON Format", "Zero-Copy Reads"],
      links: {
        github: "https://github.com/cachevector/tokenwise",
      },
    },
    {
      name: "MCPI",
      description: "Monte Carlo probabilistic computing experiments exploring random sampling methods and convergence analysis.",
      status: "Research",
      features: ["Mersenne Twister PRNG", "Convergence Visualization"],
      links: {
        github: "https://github.com/cachevector/mcpi",
      },
    },
  ];
</script>

<svelte:head>
  <title>Projects - CacheVector</title>
  <meta name="description" content="Open-source projects from CacheVector: ML tools, compression libraries, string matching engines, and research experiments." />
</svelte:head>

<section class="page">
  <h1 class="page-title">Projects</h1>
  <p class="page-intro">
    Systems, tools, and research-driven software. All open-source, built for performance and reliability.
  </p>
  <div class="project-grid">
    {#each projects as project}
      <ProductCard {...project} />
    {/each}
  </div>
</section>

<style>
  .page {
    padding: 64px 0;
  }

  .page-title {
    margin-bottom: 12px;
  }

  .page-intro {
    color: var(--text-secondary);
    margin-bottom: 40px;
    max-width: 600px;
    font-size: 1rem;
  }

  .project-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (min-width: 641px) {
    .page {
      padding: 80px 0;
    }

    .project-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1025px) {
    .project-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
