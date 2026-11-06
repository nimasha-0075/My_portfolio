var root=document.documentElement,tb=document.getElementById('theme');
function setTheme(t){root.setAttribute('data-theme',t);tb.innerHTML=t==='dark'?'&#9728;':'&#9790;';try{localStorage.setItem('theme',t)}catch(e){}}
var saved=null;try{saved=localStorage.getItem('theme')}catch(e){}
setTheme(saved||(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'));
tb.onclick=function(){setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark')};

var nav=document.getElementById('nav'),mb=document.getElementById('menu');
mb.onclick=function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)};
nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');mb.setAttribute('aria-expanded',false)}});

var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
document.querySelectorAll('.rv').forEach(function(el,i){el.style.transitionDelay=(i%4)*70+'ms';io.observe(el)});

var bar=document.getElementById('bar'),links=document.querySelectorAll('nav a');
window.addEventListener('scroll',function(){
var h=document.documentElement;bar.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
var cur='';document.querySelectorAll('main section[id]').forEach(function(s){if(s.getBoundingClientRect().top<120)cur=s.id});
links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+cur)});
},{passive:true});

var roles=['Aspiring full-stack developer','Aspiring game developer','Cybersecurity learner'],ri=0,ci=0,del=false,t=document.getElementById('typed');
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){t.textContent=roles[0]}else{
(function tick(){var w=roles[ri];ci+=del?-1:1;t.textContent=w.slice(0,ci);var d=del?35:70;
if(!del&&ci===w.length){del=true;d=1600}else if(del&&ci===0){del=false;ri=(ri+1)%roles.length;d=350}
setTimeout(tick,d)})()}

var cp=document.getElementById('cp');
if (cp) {
    cp.onclick=function(){
        var cmdEl = document.getElementById('cmd');
        if (cmdEl) {
            var tx = cmdEl.textContent;
            function done(){cp.textContent='Copied';setTimeout(function(){cp.textContent='Copy'},1600)}
            if(navigator.clipboard){navigator.clipboard.writeText(tx).then(done,function(){})}
        }
    };
}

// CONTACT FORM
function setupContactForm() {
    var cf = document.getElementById('cf');
    var fs = document.getElementById('fs');
    var sb = document.getElementById('send');

    if (!cf || !fs || !sb) {
        console.error('Contact form elements not found!');
        return;
    }

    cf.addEventListener('submit', function(e) {
        e.preventDefault();

        fs.textContent = '';
        fs.className = '';

        if (!cf.checkValidity()) {
            cf.reportValidity();
            return;
        }

        var d = new FormData(cf);

        if (d.get('_honey')) return;

        sb.disabled = true;
        sb.textContent = 'Sending...';

        fetch('https://formsubmit.co/ajax/nimashagalagoda99@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: d.get('name'),
                email: d.get('email'),
                message: d.get('message'),
                _subject: 'New message from your portfolio'
            })
        })
        .then(function(response) {
            return response.json().then(function(data) {
                if (!response.ok || data.success !== 'true') {
                    throw new Error(data.message || 'Message sending failed');
                }
                return data;
            });
        })
        .then(function() {
            fs.textContent = 'Thanks! Your message has been sent.';
            fs.className = 'success';
            cf.reset();
        })
        .catch(function(error) {
            console.error('Contact form error:', error);

            fs.textContent =
                'Could not send your message. Please try again or email me directly.';
            fs.className = 'err';
        })
        .finally(function() {
            sb.disabled = false;
            sb.textContent = 'Send message';
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupContactForm);
} else {
    setupContactForm();
}
