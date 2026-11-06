
// ==========================================
// THEME SWITCHING
// ==========================================

var root = document.documentElement;
var tb = document.getElementById('theme');

function setTheme(t) {
    root.setAttribute('data-theme', t);

    if (tb) {
        tb.innerHTML = t === 'dark' ? '&#9728;' : '&#9790;';
    }

    try {
        localStorage.setItem('theme', t);
    } catch (e) {
        console.warn('Unable to save theme preference.');
    }
}

// Load the saved theme or use the system preference
var saved = null;

try {
    saved = localStorage.getItem('theme');
} catch (e) {
    console.warn('Unable to access saved theme.');
}

setTheme(
    saved ||
    (window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark')
);

// Toggle between dark and light themes
if (tb) {
    tb.onclick = function () {
        var currentTheme = root.getAttribute('data-theme');

        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    };
}


// ==========================================
// MOBILE NAVIGATION
// ==========================================

var nav = document.getElementById('nav');
var mb = document.getElementById('menu');

// Open and close the mobile navigation menu
if (mb && nav) {

    mb.onclick = function () {
        var isOpen = nav.classList.toggle('open');

        mb.setAttribute('aria-expanded', isOpen);
    };

    // Close the menu when a navigation link is clicked
    nav.addEventListener('click', function (e) {

        if (e.target.tagName === 'A') {
            nav.classList.remove('open');

            mb.setAttribute('aria-expanded', 'false');
        }

    });

}


// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================

// Reveal elements when they enter the viewport
if ('IntersectionObserver' in window) {

    var io = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                entry.target.classList.add('in');

                io.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.15
    });

    document.querySelectorAll('.rv').forEach(function (el, i) {

        el.style.transitionDelay = (i % 4) * 70 + 'ms';

        io.observe(el);

    });

} else {

    // Show all elements if IntersectionObserver is unavailable
    document.querySelectorAll('.rv').forEach(function (el) {
        el.classList.add('in');
    });

}


// ==========================================
// SCROLL PROGRESS BAR AND ACTIVE NAVIGATION
// ==========================================

var bar = document.getElementById('bar');
var links = document.querySelectorAll('nav a');

window.addEventListener('scroll', function () {

    var h = document.documentElement;

    // Calculate the scroll progress percentage
    var maxScroll = h.scrollHeight - h.clientHeight;

    var progress = maxScroll > 0
        ? (h.scrollTop / maxScroll) * 100
        : 0;

    if (bar) {
        bar.style.width = progress + '%';
    }

    // Detect the currently active section
    var cur = '';

    document.querySelectorAll('main section[id]').forEach(function (s) {

        if (s.getBoundingClientRect().top < 120) {
            cur = s.id;
        }

    });

    // Update the active navigation link
    links.forEach(function (a) {

        a.classList.toggle(
            'on',
            a.getAttribute('href') === '#' + cur
        );

    });

}, {
    passive: true
});


// ==========================================
// TYPING ANIMATION
// ==========================================

var roles = [
    'Aspiring full-stack developer',
    'Aspiring game developer',
    'Cybersecurity learner'
];

var ri = 0;
var ci = 0;
var del = false;

var t = document.getElementById('typed');

// Check whether the user prefers reduced motion
if (t) {

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

        // Display the first role without animation
        t.textContent = roles[0];

    } else {

        // Create the typing and deleting animation
        (function tick() {

            var w = roles[ri];

            ci += del ? -1 : 1;

            t.textContent = w.slice(0, ci);

            var d = del ? 35 : 70;

            // Pause when the complete text is displayed
            if (!del && ci === w.length) {

                del = true;

                d = 1600;

            }

            // Move to the next role after deleting the current one
            else if (del && ci === 0) {

                del = false;

                ri = (ri + 1) % roles.length;

                d = 350;

            }

            setTimeout(tick, d);

        })();

    }

}


// ==========================================
// CONTACT FORM
// ==========================================

// The contact form uses standard HTML form submission.
// FormSubmit handles the message submission directly.
// No JavaScript fetch() or AJAX request is required.
// ==========================================
