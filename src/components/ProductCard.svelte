<script>
  let { name, description, status, features = [] } = $props();
</script>

<article class="card">
  <div class="header">
    <h3 class="name">{name}</h3>
    <span class="status">{status}</span>
  </div>
  <p class="description">{description}</p>
  {#if features.length > 0}
    <ul class="features">
      {#each features as feature}
        <li>{feature}</li>
      {/each}
    </ul>
  {/if}
</article>

<style>
  .card {
    background-color: var(--bg-primary);
    border: var(--border-width) solid var(--border-default);
    padding: 28px;
    transition: border-color 0.15s ease;
  }

  .card:hover {
    border-color: var(--border-hover);
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
    border: var(--border-width) solid var(--border-default);
    color: var(--text-muted);
    white-space: nowrap;
    line-height: 1.4;
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
    color: var(--text-muted);
    padding: 4px 10px;
    background-color: var(--bg-surface);
    border: 1px solid var(--border-default);
    font-weight: 500;
  }
</style>
