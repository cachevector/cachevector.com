// Add interactive animations and hamburger menu toggle
document.addEventListener("DOMContentLoaded", function () {
  // Intercept nav clicks
  const navLinks = document.querySelectorAll("a.nav-item");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinksContainer = document.getElementById("nav-links");

  // Mobile menu toggle
  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener("click", () => {
      // Toggle visibility with a single class
      navLinksContainer.classList.toggle("hidden");
      // Ensure flex and vertical stacking are applied when visible
      if (!navLinksContainer.classList.contains("hidden")) {
        navLinksContainer.classList.add(
          "flex",
          "flex-col",
          "space-y-4",
          "absolute",
          "left-0",
          "bg-[#f9f5d7]",
          "dark:bg-[#1d2021]",
          "w-full",
          "p-4",
        );
        // Remove 'top-full' as it's now handled by HTML class 'top-16'
      } else {
        // Remove styling classes when hidden to reset state
        navLinksContainer.classList.remove(
          "flex",
          "flex-col",
          "space-y-4",
          "absolute",
          "left-0",
          "bg-[#f9f5d7]",
          "dark:bg-[#1d2021]",
          "w-full",
          "p-4",
        );
      }
    });
  } else {
    console.error("Menu toggle or nav links container not found in DOM");
  }

  function setActiveNav(target) {
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === target) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const target = link.getAttribute("href");

      let defaultContent = document.querySelector("#content").innerHTML;
      let contentHTML;
      if (target === "/") {
        // contentHTML = defaultContent;
        const res = await fetch("pages/home.html");
        contentHTML = await res.text();
        window.history.pushState({ page: "home" }, "Home", "/");
      } else if (target === "/Mission") {
        const res = await fetch("pages/mission.html");
        contentHTML = await res.text();
        window.history.pushState({ page: "mission" }, "Mission", "/mission");
      } else if (target === "/Projects") {
        const res = await fetch("pages/projects.html");
        contentHTML = await res.text();
        window.history.pushState({ page: "projects" }, "Projects", "/projects");
      } else if (target === "/Blogs") {
        const res = await fetch("pages/blogs.html");
        contentHTML = await res.text();
        window.history.pushState({ page: "blogs" }, "Blogs", "/blogs");
      }

      if (contentHTML) {
        document.querySelector("#content").innerHTML = contentHTML;
      }

      setActiveNav(target); // Highlight correct nav link

      // Close mobile menu after link click
      if (
        navLinksContainer &&
        !navLinksContainer.classList.contains("hidden")
      ) {
        navLinksContainer.classList.add("hidden");
        navLinksContainer.classList.remove(
          "flex",
          "flex-col",
          "space-y-4",
          "absolute",
          "left-0",
          "bg-[#f9f5d7]",
          "dark:bg-[#1d2021]",
          "w-full",
          "p-4",
        );
      }
    });
  });
});

// ------------------------------------------------------------------------------
