<script>
  import BlogCard from "../components/BlogCard.svelte";
  import { blogs } from "../data/blogs.js";
</script>

<svelte:head>
  <title>Blog - CacheVector</title>
  <meta name="description" content="Engineering notes, deep technical breakdowns, and lessons learned from building machine learning tools and systems." />
</svelte:head>

<section class="blog-page">
  <h1>Blog</h1>
  <p class="intro">
    Engineering notes from our work on machine learning libraries, system design, and performance optimization.
    Deep dives, trade-offs, and lessons learned.
  </p>
  <div class="blog-grid">
    {#each blogs as post}
      <BlogCard {...post} />
    {/each}
  </div>
</section>

<style>
  .blog-page {
    padding: 64px 0;
  }

  h1 {
    margin-bottom: 12px;
  }

  .intro {
    color: var(--text-secondary);
    max-width: 600px;
    margin-bottom: 48px;
    font-size: 1rem;
  }

  .blog-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (min-width: 641px) {
    .blog-page {
      padding: 80px 0;
    }

    .blog-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
