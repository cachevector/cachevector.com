// Add some interactive animations
document.addEventListener('DOMContentLoaded', function() {

    // Intercept nav clicks
    const navLinks = document.querySelectorAll('a.nav-item');

    function setActiveNav(target) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === target) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');

            if (target === '#Home') {
                window.location.href = "index.html"; 
            }
            else if (target === '#Mission') {
                const res = await fetch('pages/mission.html');
                const html = await res.text();
                document.querySelector('#content').innerHTML = html;
                window.history.pushState({ page: 'mission' }, "Mission", "#Mission");
            }
            else if (target === '#Projects') {
                const res = await fetch('pages/projects.html');
                const html = await res.text();
                document.querySelector('#content').innerHTML = html;
                window.history.pushState({ page: 'projects' }, "Projects", "#Projects");
            }
            else if (target === '#Blogs') {
                const res = await fetch('pages/blogs.html');
                const html = await res.text();
                document.querySelector('#content').innerHTML = html;
                window.history.pushState({ page: 'blogs' }, "Blogs", "#Blogs");
            }

            setActiveNav(target); // highlight correct nav link
        });
    });

});