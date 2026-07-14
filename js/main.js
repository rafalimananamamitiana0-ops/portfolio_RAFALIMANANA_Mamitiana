// === Init AOS ===
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ duration: 800, once: true, offset: 80 });

  // Année dynamique
  document.getElementById('year').textContent = new Date().getFullYear();
});

// === Navbar scroll ===
const navbar = document.querySelector('.custom-navbar');
const backTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  if (window.scrollY > 400) backTop.classList.add('show');
  else backTop.classList.remove('show');
});

// === Fermer menu mobile au clic ===
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const menu = document.getElementById('navMenu');
    if (menu.classList.contains('show')) {
      new bootstrap.Collapse(menu).hide();
    }
  });
});

// === Effet machine à écrire ===
const typeEl = document.querySelector('.typewriter');
if (typeEl) {
  const phrases = [
    "Développeur Full-Stack",
    "Administrateur Système , Réseaux",
    " et passionné aux Système Embarqués",

  ];
  let pIdx = 0, cIdx = 0, deleting = false;
  function type() {
    const current = phrases[pIdx];
    if (!deleting) {
      typeEl.textContent = current.substring(0, cIdx++);
      if (cIdx > current.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      typeEl.textContent = current.substring(0, cIdx--);
      if (cIdx < 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 50 : 110);
  }
  type();
}

// === Formulaire contact AJAX (avec retry automatique) ===
const form = document.getElementById('contactForm');
if (form) {

  // Envoie le formulaire, et réessaie automatiquement si le serveur
  // répond 502/503/504 (cas fréquent avec Render free tier qui redémarre)
  async function submitWithRetry(url, formData, alertBox, retriesLeft = 3, delayMs = 4000) {
    let res;
    try {
      res = await fetch(url, { method: 'POST', body: formData });
    } catch (networkErr) {
      // Vraie coupure réseau (pas de réponse du tout)
      if (retriesLeft > 0) {
        alertBox.innerHTML = '<div class="alert alert-info">⏳ Connexion au serveur... nouvelle tentative dans quelques secondes.</div>';
        await new Promise(r => setTimeout(r, delayMs));
        return submitWithRetry(url, formData, alertBox, retriesLeft - 1, delayMs);
      }
      throw new Error('network');
    }

    if ([502, 503, 504].includes(res.status)) {
      if (retriesLeft > 0) {
        alertBox.innerHTML = '<div class="alert alert-info">⏳ Le serveur se réveille, nouvelle tentative dans quelques secondes...</div>';
        await new Promise(r => setTimeout(r, delayMs));
        return submitWithRetry(url, formData, alertBox, retriesLeft - 1, delayMs);
      }
      throw new Error('server-down');
    }

    if (!res.ok) {
      throw new Error('http-' + res.status);
    }

    return res.json();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('formAlert');
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Envoi en cours...';

    try {
      const data = await submitWithRetry(form.action, new FormData(form), alertBox);
      if (data.success) {
        alertBox.innerHTML = '<div class="alert alert-success">✅ ' + data.message + '</div>';
        form.reset();
      } else {
        alertBox.innerHTML = '<div class="alert alert-danger">❌ ' + data.message + '</div>';
      }
    } catch (err) {
      if (err.message === 'server-down') {
        alertBox.innerHTML = '<div class="alert alert-danger">❌ Le serveur met du temps à répondre. Merci de réessayer dans une minute.</div>';
      } else {
        alertBox.innerHTML = '<div class="alert alert-danger">❌ Erreur réseau. Vérifiez votre connexion.</div>';
      }
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
      setTimeout(() => alertBox.innerHTML = '', 8000);
    }
  });
}