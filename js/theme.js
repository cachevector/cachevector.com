// const themeToggle = document.getElementById('theme-toggle');
// const body = document.body;

// // On page load, respect saved theme
// if (localStorage.getItem('theme') === 'dark') {
//     body.classList.add('dark');
// }

// themeToggle.addEventListener('click', () => {
//     body.classList.toggle('dark');
//     if (body.classList.contains('dark')) {
//         localStorage.setItem('theme', 'dark');
//     } else {
//         localStorage.setItem('theme', 'light');
//     }
//     console.log("Theme Toggle Clicked!", body.classList)
// });

// document.addEventListener("DOMContentLoaded", () => {
//     console.log("DOM fully loaded"); 

//     const themeToggle = document.getElementById('theme-toggle');
//     console.log("themeToggle:", themeToggle);

//     const body = document.body;

//     if (localStorage.getItem('theme') === 'dark') {
//         console.log("Applying dark theme from localStorage");
//         body.classList.add('dark');
//     }

//     themeToggle.addEventListener('click', () => {
//         console.log("Theme Toggle Clicked!");
//         body.classList.toggle('dark');
//         if (body.classList.contains('dark')) {
//             console.log("Theme is now dark");
//             localStorage.setItem('theme', 'dark');
//         } else {
//             console.log("Theme is now light");
//             localStorage.setItem('theme', 'light');
//         }
//     });
// });



document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement; // <html>

    if (localStorage.getItem('theme') === 'dark') {
        html.classList.add('dark');
    }

    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        if (html.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
});
