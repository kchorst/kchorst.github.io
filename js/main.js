/* ============================================================
   KCHORST.COM — Main JS
   ============================================================ */

// NAV: dock on scroll
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// TYPEWRITER
const phrases = [
  'attorneys',
  'therapists',
  'accountants',
  'local businesses',
  'anyone who needs IT done right',
];
const target = document.getElementById('typewriter');
let pi = 0, ci = 0, deleting = false;

function typeStep() {
  const phrase = phrases[pi];
  if (!deleting) {
    target.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) {
      deleting = true;
      setTimeout(typeStep, 1800);
      return;
    }
    setTimeout(typeStep, 55);
  } else {
    target.textContent = phrase.slice(0, --ci);
    if (ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
      setTimeout(typeStep, 300);
      return;
    }
    setTimeout(typeStep, 30);
  }
}
if (target) setTimeout(typeStep, 900);

// FORMS — stub handler (wire to Formspree / Netlify / GAS later)
function handleForm(formId, successId) {
  const form = document.getElementById(formId);
  const success = document.getElementById(successId);
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.classList.add('hidden');
    success.classList.remove('hidden');
  });
}
handleForm('identity-form', 'form-success');
handleForm('contact-form', 'contact-success');

// Mini signup forms
document.querySelectorAll('.mini-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn = form.querySelector('button');
    btn.textContent = '✓ Subscribed';
    btn.disabled = true;
    input.disabled = true;
  });
});
