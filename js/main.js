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

      let contentHTML;
      if (target === "/") {
        const res = await fetch("pages/home.html");
        console.log(target);
        contentHTML = await res.text();
        window.history.pushState({ page: "home" }, "Home", "/");
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
