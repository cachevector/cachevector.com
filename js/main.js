// Add interactive animations and hamburger menu toggle
document.addEventListener("DOMContentLoaded", function () {
  // Intercept nav clicks
  const navLinks = document.querySelectorAll("a.navbar-button");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinksContainer = document.getElementById("nav-links");

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
        console.log(target);
        contentHTML = await res.text();
        window.history.pushState({ page: "blogs" }, "Blogs", "/blogs");
      }

      if (contentHTML) {
        document.querySelector("#content").innerHTML = contentHTML;
      }

      setActiveNav(target); // Highlight correct nav link

    });
  });
});

// ------------------------------------------------------------------------------
