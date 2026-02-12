<script>
  import { onMount } from "svelte";
  import Navbar from "./components/Navbar.svelte";
  import Footer from "./components/Footer.svelte";

  let currentPath = $state(window.location.pathname);
  let PageComponent = $state(null);
  let pageProps = $state({});

  const routes = {
    "/": () => import("./pages/Home.svelte"),
    "/blog": () => import("./pages/Blog.svelte"),
  };

  async function navigate(path) {
    currentPath = path;

    if (path.startsWith("/blog/") && path.length > 6) {
      const mod = await import("./pages/BlogPost.svelte");
      PageComponent = mod.default;
      pageProps = { slug: path.replace("/blog/", "") };
      return;
    }

    const loader = routes[path];
    if (loader) {
      const mod = await loader();
      PageComponent = mod.default;
      pageProps = {};
    } else {
      const mod = await routes["/"]();
      PageComponent = mod.default;
      pageProps = {};
    }
  }

  function handleClick(e) {
    const anchor = e.target.closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("//") || href.startsWith("mailto:") || anchor.target === "_blank") return;
    e.preventDefault();
    if (href !== currentPath) {
      window.history.pushState({}, "", href);
      navigate(href);
      window.scrollTo(0, 0);
    }
  }

  onMount(() => {
    navigate(currentPath);
    window.addEventListener("popstate", () => {
      navigate(window.location.pathname);
    });
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onclick={handleClick}>
  <Navbar {currentPath} />
  <main>
    {#if PageComponent}
      <PageComponent {...pageProps} />
    {/if}
  </main>
  <Footer />
</div>

<style>
  main {
    flex: 1;
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

  @media (min-width: 641px) {
    main {
      padding: 0 24px;
    }
  }
</style>
