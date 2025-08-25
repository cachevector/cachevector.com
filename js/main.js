// // --- Seline Analytics ---
// function initSeline() {
//   if (typeof seline !== "undefined") {
//     seline.init({
//       token: "091747081ed47e6",
//       autoPageView: true
//     });
//     console.log("Seline initialized");
//   } else {
//     setTimeout(initSeline, 100);
//   }
// }
// document.addEventListener("DOMContentLoaded", initSeline);

// function scrollToMission() {
//     document.getElementById('mission').scrollIntoView({ 
//         behavior: 'smooth' 
//     });
// }

// Add some interactive animations
document.addEventListener('DOMContentLoaded', function() {


    // Intercept nav clicks
    // document.querySelectorAll('a.nav-item').forEach(link => {
    //     link.addEventListener('click', async (e) => {
    //         e.preventDefault();

    //         const target = link.getAttribute('href');

    //         if (target === '#Home') {
    //             // Reload homepage hero (you could refactor into home.html too)
    //             window.location.href = "index.html"; 
    //         }
    //         else if (target === '#Mission') {
    //             const res = await fetch('pages/mission.html');
    //             const html = await res.text();
    //             document.querySelector('#content').innerHTML = html;
    //             window.history.pushState({ page: 'mission' }, "Mission", "#mission");
    //         }
    //         else if (target === '#Projects') {
    //             const res = await fetch('pages/projects.html');
    //             const html = await res.text();
    //             document.querySelector('#content').innerHTML = html;
    //             window.history.pushState({ page: 'projects' }, "Projects", "#project");
    //         }
    //         else if (target === '#Blogs') {
    //             const res = await fetch('pages/blogs.html');
    //             const html = await res.text();
    //             document.querySelector('#content').innerHTML = html;
    //             window.history.pushState({ page: 'blogs' }, "Blogs", "#blog");
    //         } 
    //     });
    // });

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
                seline.page();
            }
            else if (target === '#Projects') {
                const res = await fetch('pages/projects.html');
                const html = await res.text();
                document.querySelector('#content').innerHTML = html;
                window.history.pushState({ page: 'projects' }, "Projects", "#Projects");
                seline.page();
            }
            else if (target === '#Blogs') {
                const res = await fetch('pages/blogs.html');
                const html = await res.text();
                document.querySelector('#content').innerHTML = html;
                window.history.pushState({ page: 'blogs' }, "Blogs", "#Blogs");
                seline.page();
            }

            setActiveNav(target); // highlight correct nav link
        });
    });

});

// Add ripple animation
// const style = document.createElement('style');
// style.textContent = `
//     @keyframes ripple {
//         to {
//             transform: scale(2);
//             opacity: 0;
//         }
//     }
// `;
// document.head.appendChild(style);