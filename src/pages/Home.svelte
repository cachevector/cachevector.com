<script>
  import Hero from "../components/Hero.svelte";
  import ProductCard from "../components/ProductCard.svelte";
  import BlogCard from "../components/BlogCard.svelte";
  import { blogs } from "../data/blogs.js";

  const products = [
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
  ];

  const mission = [
    {
      title: "Work That Lasts",
      text: "We focus on the parts most people skip. Math, algorithms, and libraries that aren't glamorous, but make everything else possible.",
    },
    {
      title: "Open by Default",
      text: "Everything we do is open-source. We value clarity over polish, and we share our work so others can build on it.",
    },
    {
      title: "Math, Models, Tools",
      text: "We work on core mathematics, train and test ML and DL models, and create libraries that improve performance. The goal is always to make complex ideas usable in practice.",
    },
    {
      title: "Quiet Progress",
      text: "We don't chase hype or buzzwords. We publish, package, and share work that people can depend on. Quiet progress matters more than loud promises.",
    },
  ];

  const latestBlogs = blogs.slice(0, 3);
</script>

<svelte:head>
  <title>CacheVector</title>
  <meta name="description" content="Advancing machine learning libraries, mathematical research, and developer tools through open-source engineering." />
</svelte:head>

<Hero />

<section class="section">
  <h2 class="section-title">What We're Building</h2>
  <p class="section-intro">
    Systems, tools, and research-driven software. Built for performance, designed for reliability.
  </p>
  <div class="product-grid">
    {#each products as product}
      <ProductCard {...product} />
    {/each}
  </div>
  <div class="view-all-projects">
    <a href="/projects">View all projects &rarr;</a>
  </div>
</section>

<section class="section">
  <h2 class="section-title">Our Mission</h2>
  <p class="section-intro">
    At CacheVector, we're building the invisible parts that matter.
  </p>
  <div class="mission-grid">
    {#each mission as item}
      <article class="mission-card">
        <h3>{item.title}</h3>
        <p>{item.text}</p>
      </article>
    {/each}
  </div>
  <p class="mission-closing">
    Our projects are open, simple, and built to be useful. If something helps you, star it.
    If you can improve it, fork it. The work is meant to be shared.
  </p>
</section>

<section class="section last-section">
  <h2 class="section-title">Engineering Notes</h2>
  <p class="section-intro">
    Deep technical breakdowns, system design insights, and lessons learned from production engineering.
  </p>
  <div class="blog-grid">
    {#each latestBlogs as post}
      <BlogCard {...post} />
    {/each}
  </div>
  <div class="view-all">
    <a href="/blog">View all posts &rarr;</a>
  </div>
</section>

<style>
  .section {
    padding: 64px 0;
    border-bottom: var(--border-width) solid var(--border-default);
  }

  .last-section {
    border-bottom: none;
  }

  .section-title {
    margin-bottom: 12px;
  }

  .section-intro {
    color: var(--text-secondary);
    margin-bottom: 40px;
    max-width: 600px;
    font-size: 1rem;
  }

  .product-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .mission-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .mission-card {
    background-color: var(--bg-primary);
    border: var(--border-width) solid var(--border-default);
    padding: 24px;
    transition: border-color 0.15s ease;
  }

  .mission-card:hover {
    border-color: var(--border-hover);
  }

  .mission-card h3 {
    font-family: var(--font-heading);
    font-weight: 600;
    margin-bottom: 8px;
  }

  .mission-card p {
    font-size: 0.9375rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .mission-closing {
    margin-top: 32px;
    font-size: 0.9375rem;
    color: var(--text-muted);
    font-style: italic;
  }

  .blog-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .view-all {
    margin-top: 32px;
    text-align: center;
  }

  .view-all a {
    font-weight: 500;
    font-size: 0.9375rem;
    color: var(--accent);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .view-all a:hover {
    color: var(--accent-hover);
  }

  .view-all-projects {
    margin-top: 24px;
    text-align: center;
  }

  .view-all-projects a {
    font-weight: 500;
    font-size: 0.9375rem;
    color: var(--accent);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .view-all-projects a:hover {
    color: var(--accent-hover);
  }

  @media (min-width: 641px) {
    .section {
      padding: 80px 0;
    }

    .product-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .mission-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .blog-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1025px) {
    .blog-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
