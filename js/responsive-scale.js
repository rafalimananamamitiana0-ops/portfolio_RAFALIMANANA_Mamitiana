/* ======================================================
   RESPONSIVE-SCALE.JS
   Mampikely (scale) ilay endrika "desktop" mba hitovy
   tanteraka amin'ny efijery telephone/tablette, tsy
   miova ny disposition (colonnes, taille, alignement).
   Mihatra rehefa latsaky ny 992px ny largeur écran.

   Rafitra: #scale-outer (manapaka ny banga) > #app-scale
   (io no scalé tokoa amin'ny transform:scale).
   ====================================================== */

(function () {
  var BREAKPOINT = 992;    // mifanaraka amin'ny @media (max-width: 991px) ao amin'ny style.css
  var DESIGN_WIDTH = 1200; // largeur "reference" an'ilay design desktop (container Bootstrap XL)

  var outer = document.getElementById('scale-outer');
  var wrapper = document.getElementById('app-scale');
  if (!outer || !wrapper) return;

  function applyScale() {
    var w = window.innerWidth;

    if (w < BREAKPOINT) {
      var scale = w / DESIGN_WIDTH;

      wrapper.style.width = DESIGN_WIDTH + 'px';
      wrapper.style.transform = 'scale(' + scale + ')';
      wrapper.style.transformOrigin = 'top left';

      // offsetHeight dia mamerina ny hauteur "layout" tsy
      // voakasiky ny transform (satria transform dia "paint"
      // fotsiny, tsy manova ny box layout). Io no atao "hauteur
      // naturelle" an'ilay contenu amin'ny 1200px largeur.
      var naturalHeight = wrapper.offsetHeight;

      // #scale-outer dia hametrahana hauteur mifanaraka amin'ny
      // hauteur "efa scalé" ihany (naturalHeight * scale), ka
      // ny overflow:hidden ao aminy no manapaka ilay banga
      // tsy ilaina eo ambany.
      outer.style.height = Math.ceil(naturalHeight * scale) + 'px';
      outer.style.overflow = 'hidden';

      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';
    } else {
      // Amin'ny ordinateur, tsy misy scale, endrika tsotra
      wrapper.style.width = '';
      wrapper.style.transform = '';
      outer.style.height = '';
      outer.style.overflow = '';
    }
  }

  // Alaina indray mandeha aloha (avant chargement complet), avy eo
  // averina isaky ny misy zavatra vaovao mety miantraika amin'ny
  // hauteur (sary, police, animation AOS).
  applyScale();
  window.addEventListener('load', applyScale);
  window.addEventListener('resize', applyScale);
  window.addEventListener('orientationchange', function () {
    setTimeout(applyScale, 200);
  });

  // Averina indroa/intelo mandritra ny segondra voalohany mba
  // hisitraka ny sary/font/AOS izay mety mbola tsy vita mihitsy
  // tamin'ny alina "load" voalohany.
  setTimeout(applyScale, 300);
  setTimeout(applyScale, 1000);
  setTimeout(applyScale, 2000);
})();