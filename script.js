
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

// ==========================================
// WEB3FORMS CONTACT FORM SUBMISSION
// ==========================================

var contactForm = document.querySelector('.cform');

var sendButton = document.getElementById('send');

var popup = document.getElementById('messagePopup');

var popupIcon = document.getElementById('popupIcon');

var popupTitle = document.getElementById('popupTitle');

var popupMessage = document.getElementById('popupMessage');

var popupClose = document.getElementById('popupClose');


// Show the confirmation popup
function showPopup(success, message) {

    if (success) {
        popupIcon.textContent = '✓';
        popupIcon.className = 'popup-icon';

        popupTitle.textContent = 'Message Sent!';
        popupMessage.textContent =
            'Thank you! Your message has been sent successfully.';
    } else {
        popupIcon.textContent = '✕';
        popupIcon.className = 'popup-icon error';

        popupTitle.textContent = 'Message Not Sent!';
        popupMessage.textContent = message ||
            'Something went wrong. Please try again.';
    }

    popup.classList.add('show');
    popup.setAttribute('aria-hidden', 'false');

    document.body.classList.add('popup-open');

    popupClose.focus();
}


// Close the popup
function closePopup() {

    popup.classList.remove('show');
    popup.setAttribute('aria-hidden', 'true');

    document.body.classList.remove('popup-open');
}

if (popupClose && popup) {

    popupClose.addEventListener('click', closePopup);

    // Close popup when clicking outside the box
    popup.addEventListener('click', function (e) {

        if (e.target === popup) {
            closePopup();
        }

    });

    // Close popup using the Escape key
    document.addEventListener('keydown', function (e) {

        if (e.key === 'Escape' && popup.classList.contains('show')) {
            closePopup();
        }

    });

}


// Handle contact form submission
if (contactForm && sendButton && popup) {

    contactForm.addEventListener('submit', async function (e) {

        e.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        sendButton.disabled = true;
        sendButton.textContent = 'Sending...';

        try {

            var formData = new FormData(contactForm);

            var response = await fetch(
                'https://api.web3forms.com/submit',
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            var result = await response.json();

            if (!response.ok ||
                !(result.success === true || result.success === 'true')) {

                throw new Error(
                    result.message || 'Message submission failed.'
                );

            }

            // Clear the form after successful submission
            contactForm.reset();

            // Show success confirmation
            showPopup(true);

        } catch (error) {

            console.error('Contact form error:', error);

            // Show error confirmation
            showPopup(
                false,
                error.message || 'Please try again later.'
            );

        } finally {

            sendButton.disabled = false;
            sendButton.textContent = 'Send message';

        }

    });

}

/* ==========================================
   CUSTOM CURSOR - DUAL THEME
   DARK: PINK + PURPLE
   LIGHT: NAVY BLUE + PURPLE
========================================== */

(() => {

    // Check desktop pointer
    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (!finePointer) return;

    // Prevent duplicate cursor elements
    if (document.querySelector(".custom-cursor-dot")) return;

    // Create cursor elements
    const dot = document.createElement("span");
    const ring = document.createElement("span");

    dot.className = "custom-cursor-dot";
    ring.className = "custom-cursor-ring";

    dot.setAttribute("aria-hidden", "true");
    ring.setAttribute("aria-hidden", "true");

    document.body.append(dot, ring);
    document.body.classList.add("has-custom-cursor");

    // Cursor positions
    let mouseX = -100;
    let mouseY = -100;

    let ringX = -100;
    let ringY = -100;

    let cursorVisible = false;
    let animationFrame = null;

    // ======================================
    // DETECT CURRENT THEME
    // ======================================

    function getBackgroundBrightness(color) {

        const match = color.match(/\d+/g);

        if (!match || match.length < 3) return 0;

        const r = Number(match[0]);
        const g = Number(match[1]);
        const b = Number(match[2]);

        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    function updateCursorTheme() {

        const bodyBackground =
            getComputedStyle(document.body).backgroundColor;

        const htmlBackground =
            getComputedStyle(document.documentElement).backgroundColor;

        const bodyBrightness =
            getBackgroundBrightness(bodyBackground);

        const htmlBrightness =
            getBackgroundBrightness(htmlBackground);

        // Prefer the body's background when it is not transparent
        const background = bodyBackground !== "rgba(0, 0, 0, 0)"
            ? bodyBrightness
            : htmlBrightness;

        const isLightTheme = background > 150;

        document.documentElement.dataset.cursorTheme =
            isLightTheme ? "light" : "dark";
    }

    // Initial theme detection
    updateCursorTheme();

    // Detect theme button clicks
    const themeButton = document.getElementById("theme");

    if (themeButton) {
        themeButton.addEventListener("click", () => {
            requestAnimationFrame(() => {
                requestAnimationFrame(updateCursorTheme);
            });
        });
    }

    // Detect theme class or style changes
    const themeObserver = new MutationObserver(() => {
        updateCursorTheme();
    });

    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "style"]
    });

    themeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ["class", "style"]
    });

    // ======================================
    // CURSOR MOVEMENT
    // ======================================

    function animateRing() {

        // Smooth ring movement
        ringX += (mouseX - ringX) * 0.20;
        ringY += (mouseY - ringY) * 0.20;

        ring.style.transform =
            `translate3d(${ringX}px, ${ringY}px, 0)`;

        animationFrame = requestAnimationFrame(animateRing);
    }

    // Mouse movement
    window.addEventListener("pointermove", (event) => {

        if (event.pointerType === "touch") return;

        mouseX = event.clientX;
        mouseY = event.clientY;

        // Dot follows immediately
        dot.style.transform =
            `translate3d(${mouseX}px, ${mouseY}px, 0)`;

        // Show cursor
        if (!cursorVisible) {
            cursorVisible = true;

            dot.style.opacity = "1";
            ring.style.opacity = "1";
        }

    }, { passive: true });

    // Start animation
    animateRing();

    // ======================================
    // HOVER EFFECT
    // ======================================

    const interactiveElements = [
        "a",
        "button",
        "input",
        "textarea",
        "select",
        "summary",
        "[role='button']"
    ].join(",");

    document.addEventListener("pointerover", (event) => {

        if (
            event.target instanceof Element &&
            event.target.closest(interactiveElements)
        ) {
            ring.classList.add("is-hovering");
        }

    });

    document.addEventListener("pointerout", (event) => {

        if (
            event.target instanceof Element &&
            event.target.closest(interactiveElements) &&
            (
                !event.relatedTarget ||
                !event.relatedTarget.closest?.(interactiveElements)
            )
        ) {
            ring.classList.remove("is-hovering");
        }

    });

    // ======================================
    // CLICK EFFECT
    // ======================================

    document.addEventListener("pointerdown", () => {
        ring.classList.add("is-pressed");
    });

    window.addEventListener("pointerup", () => {
        ring.classList.remove("is-pressed");
    });

    // ======================================
    // HIDE AND SHOW CURSOR
    // ======================================

    function hideCursor() {

        cursorVisible = false;

        dot.style.opacity = "0";
        ring.style.opacity = "0";

        ring.classList.remove(
            "is-hovering",
            "is-pressed"
        );
    }

    document.addEventListener("mouseleave", hideCursor);
    window.addEventListener("blur", hideCursor);

    // Stop animation when page is hidden
    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            hideCursor();
        }

    });

})();
fetch('https://nimasha-portfolio.goatcounter.com/counter/TOTAL.json')
.then(function(r){if(!r.ok)throw 0;return r.json()})
.then(function(d){if(d.count&&d.count!=='0'){document.getElementById('views').textContent=' | '+d.count+' visits'}})
.catch(function(){});

