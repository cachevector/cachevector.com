<script>
  import { blogs } from "../data/blogs.js";

  let { slug } = $props();

  let post = $derived(blogs.find(b => b.slug === slug));

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
</script>

<svelte:head>
  <title>{post ? post.title : "Post Not Found"} - CacheVector</title>
  {#if post}
    <meta name="description" content={post.excerpt} />
  {/if}
</svelte:head>

{#if post}
  <article class="article">
    <a href="/blog" class="back">&larr; Back to Blog</a>
    <header class="article-meta">
      <div class="meta-row">
        <span class="category">{post.category}</span>
        <span class="date">{formatDate(post.date)}</span>
      </div>
      <h1>{post.title}</h1>
    </header>
    <div class="article-content">
      {@html post.content}
    </div>
    <footer class="article-footer">
      <a href="/blog">&larr; Back to all posts</a>
    </footer>
  </article>
{:else}
  <div class="not-found">
    <h1>Post not found</h1>
    <p>The blog post you're looking for doesn't exist.</p>
    <a href="/blog">Back to Blog</a>
  </div>
{/if}

<style>
  .article {
    max-width: 720px;
    margin: 0 auto;
    padding: 48px 0 64px;
  }

  .back {
    display: inline-block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-muted);
    text-decoration: none;
    margin-bottom: 32px;
    transition: color 0.15s ease;
  }

  .back:hover {
    color: var(--accent);
  }

  .article-meta {
    margin-bottom: 48px;
    padding-bottom: 32px;
    border-bottom: var(--border-width) solid var(--border-default);
  }

  .meta-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .category {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--accent);
  }

  .date {
    font-size: 0.8125rem;
    color: var(--text-muted);
  }

  .article-meta h1 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    line-height: 1.2;
    letter-spacing: -0.03em;
  }

  .article-content :global(h2) {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 48px;
    margin-bottom: 16px;
    letter-spacing: -0.02em;
  }

  .article-content :global(h3) {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 32px;
    margin-bottom: 12px;
  }

  .article-content :global(p) {
    margin-bottom: 16px;
    line-height: 1.7;
    color: var(--text-secondary);
    font-size: 1rem;
  }

  .article-content :global(pre) {
    background-color: var(--bg-surface);
    border: var(--border-width) solid var(--border-default);
    padding: 20px;
    overflow-x: auto;
    margin: 24px 0;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  .article-content :global(code) {
    font-family: var(--font-mono);
    font-size: 0.875em;
  }

  .article-content :global(p code) {
    background-color: var(--bg-surface);
    padding: 2px 6px;
    border: 1px solid var(--border-default);
    font-size: 0.8125em;
  }

  .article-content :global(ul),
  .article-content :global(ol) {
    margin: 16px 0;
    padding-left: 24px;
    color: var(--text-secondary);
  }

  .article-content :global(ul) {
    list-style: disc;
  }

  .article-content :global(ol) {
    list-style: decimal;
  }

  .article-content :global(li) {
    margin-bottom: 8px;
    line-height: 1.6;
    font-size: 1rem;
  }

  .article-content :global(strong) {
    color: var(--text-primary);
    font-weight: 600;
  }

  .article-content :global(em) {
    font-style: italic;
  }

  .article-content :global(blockquote) {
    border-left: 3px solid var(--accent);
    padding-left: 20px;
    margin: 24px 0;
    color: var(--text-muted);
    font-style: italic;
  }

  .article-footer {
    margin-top: 64px;
    padding-top: 32px;
    border-top: var(--border-width) solid var(--border-default);
  }

  .article-footer a {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--accent);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .article-footer a:hover {
    color: var(--accent-hover);
  }

  .not-found {
    padding: 96px 0;
    text-align: center;
  }

  .not-found h1 {
    margin-bottom: 12px;
  }

  .not-found p {
    color: var(--text-secondary);
    margin-bottom: 24px;
  }

  .not-found a {
    font-weight: 500;
    color: var(--accent);
  }

  @media (min-width: 641px) {
    .article {
      padding: 64px 0 96px;
    }
  }
</style>
