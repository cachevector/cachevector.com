function scrollToMission() {
    document.getElementById('mission').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Add some interactive animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate elements on scroll
    // const observerOptions = {
    //     threshold: 0.1,
    //     rootMargin: '0px 0px -50px 0px'
    // };

    // const observer = new IntersectionObserver((entries) => {
    //     entries.forEach(entry => {
    //         if (entry.isIntersecting) {
    //             entry.target.classList.add('fade-in');
    //         }
    //     });
    // }, observerOptions);

    // Observe mission section paragraphs
    // const missionParagraphs = document.querySelectorAll('#mission p');
    // missionParagraphs.forEach((p, index) => {
    //     p.style.animationDelay = `${index * 0.2}s`;
    //     observer.observe(p);
    // });

    // Add hover effect to navigation items
    // const navItems = document.querySelectorAll('.nav-item');
    /*
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-2px)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });
    */

    // Add click ripple effect to buttons
    // const buttons = document.querySelectorAll('button, .github-btn');
    // buttons.forEach(button => {
    //     button.addEventListener('click', function(e) {
    //         const ripple = document.createElement('span');
    //         const rect = this.getBoundingClientRect();
    //         const size = Math.max(rect.width, rect.height);
    //         const x = e.clientX - rect.left - size / 2;
    //         const y = e.clientY - rect.top - size / 2;
            
    //         ripple.style.cssText = `
    //             position: absolute;
    //             width: ${size}px;
    //             height: ${size}px;
    //             left: ${x}px;
    //             top: ${y}px;
    //             background: rgba(16, 185, 129, 0.3);
    //             border-radius: 50%;
    //             transform: scale(0);
    //             animation: ripple 0.6s ease-out;
    //             pointer-events: none;
    //         `;
            
    //         this.style.position = 'relative';
    //         this.style.overflow = 'hidden';
    //         this.appendChild(ripple);
            
    //         setTimeout(() => {
    //             ripple.remove();
    //         }, 600);
    //     });
    // });

    // Intercept nav clicks
    document.querySelectorAll('a.nav-item').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();

            const target = link.getAttribute('href');

            if (target === '#Home') {
                // Reload homepage hero (you could refactor into home.html too)
                window.location.href = "index.html"; 
            }
            else if (target === '#Mission') {
                const res = await fetch('pages/mission.html');
                const html = await res.text();
                document.querySelector('#content').innerHTML = html;
                window.history.pushState({ page: 'mission' }, "Mission", "#mission");
            }
            else if (target === '#Projects') {
                const res = await fetch('pages/projects.html');
                const html = await res.text();
                document.querySelector('#content').innerHTML = html;
                window.history.pushState({ page: 'projects' }, "Projects", "#project");
            }
            else if (target === '#Blogs') {
                const res = await fetch('pages/blogs.html');
                const html = await res.text();
                document.querySelector('#content').innerHTML = html;
                window.history.pushState({ page: 'blogs' }, "Blogs", "#blog");
            } 
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