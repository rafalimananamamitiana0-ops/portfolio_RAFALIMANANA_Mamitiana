/* ======================================================
   RESPONSIVE-SCALE.JS
   Mampikely (scale) ilay endrika "desktop" mba hitovy
   tanteraka amin'ny efijery telephone/tablette, tsy
   miova ny disposition (colonnes, taille, alignement).
   Mihatra rehefa latsaky ny 992px ny largeur écran.
   ====================================================== */

(function () {
  var BREAKPOINT = 992;   // mifanaraka amin'ny @media (max-width: 991px) ao amin'ny style.css
  var DESIGN_WIDTH = 1200; // largeur "reference" an'ilay design desktop (container Bootstrap XL)

  var wrapper = document.getElementById('app-scale');
  if (!wrapper) return;

  function applyScale() {
    var w = window.innerWidth;

    if (w < BREAKPOINT) {
      var scale = w / DESIGN_WIDTH;

      wrapper.style.width = DESIGN_WIDTH + 'px';
      wrapper.style.transform = 'scale(' + scale + ')';
      wrapper.style.transformOrigin = 'top left';

      // Mamerina ny hauteur an'ny body mba tsy hisy espace blanc eo ambany
      document.body.style.height = (wrapper.getBoundingClientRect().height) + 'px';
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';
    } else {
      // Amin'ny ordinateur, tsy misy scale, endrika tsotra
      wrapper.style.width = '';
      wrapper.style.transform = '';
      document.body.style.height = '';
    }
  }

  window.addEventListener('load', applyScale);
  window.addEventListener('resize', applyScale);
  window.addEventListener('orientationchange', function () {
    setTimeout(applyScale, 200);
  });

  // Fanovana rehefa misy contenu miova hauteur (aos animations, images sasany mety miova)
  window.addEventListener('DOMContentLoaded', applyScale);
})();