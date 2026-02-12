<script>
  import ThemeToggle from "./ThemeToggle.svelte";

  let { currentPath } = $props();
  let mobileOpen = $state(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
  ];

  function closeMobile() {
    mobileOpen = false;
  }
</script>

<nav>
  <div class="nav-inner">
    <a href="/" class="logo-link" aria-label="CacheVector Home">
      <img src="/assets/logos/Cache_Vector.svg" alt="CacheVector" class="logo" />
      <span class="logo-text">CacheVector</span>
    </a>

    <div class="nav-right">
      <div class="nav-links">
        {#each links as link}
          <a
            href={link.href}
            class="nav-link"
            class:active={currentPath === link.href || (link.href === "/blog" && currentPath.startsWith("/blog"))}
          >
            {link.label}
          </a>
        {/each}
      </div>

      <ThemeToggle />

      <button
        class="hamburger"
        onclick={() => mobileOpen = !mobileOpen}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
      >
        {#if mobileOpen}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        {:else}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        {/if}
      </button>
    </div>
  </div>

  {#if mobileOpen}
    <div class="mobile-menu">
      {#each links as link}
        <a
          href={link.href}
          class="mobile-link"
          class:active={currentPath === link.href || (link.href === "/blog" && currentPath.startsWith("/blog"))}
          onclick={closeMobile}
        >
          {link.label}
        </a>
      {/each}
    </div>
  {/if}
</nav>

<style>
  nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: var(--bg-primary);
    border-bottom: var(--border-width) solid var(--border-default);
  }

  .nav-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  .logo-link {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: var(--text-primary);
  }

  .logo {
    width: 32px;
    height: 32px;
  }

  .logo-text {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 1.125rem;
    letter-spacing: -0.02em;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nav-links {
    display: none;
    align-items: center;
    gap: 32px;
    margin-right: 16px;
  }

  .nav-link {
    position: relative;
    color: var(--text-secondary);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9375rem;
    padding: 4px 0;
    transition: color 0.15s ease;
  }

  .nav-link::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--accent);
    transition: width 0.15s ease;
  }

  .nav-link:hover,
  .nav-link.active {
    color: var(--text-primary);
  }

  .nav-link.active::after,
  .nav-link:hover::after {
    width: 100%;
  }

  .hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: var(--text-primary);
    padding: 8px;
    min-width: 44px;
    min-height: 44px;
  }

  .mobile-menu {
    display: flex;
    flex-direction: column;
    padding: 8px 16px 16px;
    border-bottom: var(--border-width) solid var(--border-default);
    background-color: var(--bg-primary);
  }

  .mobile-link {
    display: block;
    padding: 12px 0;
    color: var(--text-secondary);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9375rem;
    border-bottom: var(--border-width) solid var(--border-default);
    transition: color 0.15s ease;
  }

  .mobile-link:last-child {
    border-bottom: none;
  }

  .mobile-link.active {
    color: var(--accent);
  }

  @media (min-width: 641px) {
    .nav-inner {
      padding: 0 24px;
    }

    .nav-links {
      display: flex;
    }

    .hamburger {
      display: none;
    }

    .mobile-menu {
      display: none;
    }
  }
</style>
