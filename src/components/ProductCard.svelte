<script>
  let { name, description, status, features = [], links = {} } = $props();
</script>

<article class="card">
  <div class="card-accent"></div>
  <div class="card-body">
    <div class="header">
      <h3 class="name">{name}</h3>
      <span class="status" class:status-live={status === "Live"} class:status-beta={status === "Beta"}>{status}</span>
    </div>
    <p class="description">{description}</p>
    {#if features.length > 0}
      <ul class="features">
        {#each features as feature}
          <li>{feature}</li>
        {/each}
      </ul>
    {/if}
    {#if Object.keys(links).length > 0}
      <div class="card-links">
        {#if links.website}
          <a href={links.website} target="_blank" rel="noopener noreferrer" class="card-link">{links.website.replace("https://", "")}</a>
        {/if}
        {#if links.pypi}
          <a href={links.pypi} target="_blank" rel="noopener noreferrer" class="card-link">PyPI</a>
        {/if}
        {#if links.github}
          <a href={links.github} target="_blank" rel="noopener noreferrer" class="card-link">GitHub</a>
        {/if}
      </div>
    {/if}
  </div>
</article>

<style>
  .card {
    background-color: var(--bg-primary);
    border: var(--border-width) solid var(--border-default);
    transition: border-color 0.15s ease;
    display: flex;
    overflow: hidden;
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
    padding: 28px;
    flex: 1;
    min-width: 0;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .name {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .status {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 3px 8px;
    border: var(--border-width) solid var(--tag-border);
    color: var(--tag-text);
    white-space: nowrap;
    line-height: 1.4;
  }

  .status-live {
    border-color: var(--accent);
    color: var(--accent);
  }

  .status-beta {
    border-color: var(--accent);
    color: var(--accent);
  }

  .description {
    font-size: 0.9375rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 16px;
  }

  .features {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .features li {
    font-size: 0.8125rem;
    color: var(--tag-text);
    padding: 4px 10px;
    background-color: var(--bg-surface);
    border: 1px solid var(--tag-border);
    font-weight: 500;
  }

  .card-links {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border-default);
  }

  .card-link {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--accent);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .card-link:hover {
    color: var(--accent-hover);
  }
</style>
