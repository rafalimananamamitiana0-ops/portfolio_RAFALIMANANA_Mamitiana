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

// === Formulaire contact AJAX ===
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('formAlert');
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Envoi en cours...';

    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form) });
      const data = await res.json();
      if (data.success) {
        alertBox.innerHTML = '<div class="alert alert-success">✅ ' + data.message + '</div>';
        form.reset();
      } else {
        alertBox.innerHTML = '<div class="alert alert-danger">❌ ' + data.message + '</div>';
      }
    } catch {
      alertBox.innerHTML = '<div class="alert alert-danger">❌ Erreur réseau. Vérifiez votre serveur PHP.</div>';
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
      setTimeout(() => alertBox.innerHTML = '', 6000);
    }
  });
}


