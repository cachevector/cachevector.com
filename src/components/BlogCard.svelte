<script>
  let { slug, title, date, category, excerpt } = $props();

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
</script>

<a href="/blog/{slug}" class="card">
  <div class="card-accent"></div>
  <div class="card-body">
    <div class="meta">
      <span class="category">{category}</span>
      <span class="date">{formatDate(date)}</span>
    </div>
    <h3 class="title">{title}</h3>
    <p class="excerpt">{excerpt}</p>
    <span class="read-more">Read more &rarr;</span>
  </div>
</a>

<style>
  .card {
    display: flex;
    overflow: hidden;
    background-color: var(--bg-primary);
    border: var(--border-width) solid var(--border-default);
    transition: border-color 0.15s ease;
    text-decoration: none;
    color: inherit;
  }

  .card:hover {
    border-color: var(--border-hover);
  }

  .card-accent {
    width: 4px;
    flex-shrink: 0;
    background-color: var(--text-primary);
  }

  .card-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 24px;
    flex: 1;
    min-width: 0;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.8125rem;
  }

  .category {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--accent);
    font-size: 0.75rem;
  }

  .date {
    color: var(--text-muted);
  }

  .title {
    font-family: var(--font-heading);
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.35;
    letter-spacing: -0.01em;
  }

  .excerpt {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .read-more {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--accent);
    margin-top: auto;
    padding-top: 4px;
  }
</style>
