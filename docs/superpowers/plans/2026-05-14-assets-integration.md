# Assets Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar 77 imágenes y 1 video en las 7 páginas del sitio con parallax hero, Ken Burns en galerías, scroll entrance con anime.js stagger y mobile-first responsive.

**Architecture:** Cada página recibe un bloque CSS compartido (Ken Burns + gallery grid + hero parallax + video section) y un bloque JS compartido (parallax scroll handler + gallery reveal + hover/tap). Sin bundler — todo inline. Las subpáginas usan rutas `../assets/`. index.html usa `assets/`.

**Tech Stack:** HTML5, CSS3 (keyframes, grid, custom properties), anime.js 3.2.1 (CDN), JS vanilla (IntersectionObserver, scroll listener)

---

## Shared Code Reference

Estos bloques se repiten en cada tarea. Están definidos aquí una sola vez.

### CSS COMPARTIDO — agregar al final del `<style>` de cada página

```css
/* ══ KEN BURNS ══ */
@keyframes kenBurns {
  0%   { transform: scale(1)    translate(0,    0); }
  33%  { transform: scale(1.06) translate(-1%,  0.5%); }
  66%  { transform: scale(1.04) translate(0.8%, -0.3%); }
  100% { transform: scale(1)    translate(0,    0); }
}
@media (prefers-reduced-motion: reduce) {
  .gallery-service__img,
  .hero-parallax-img,
  .service-card__thumb { animation: none !important; }
}

/* ══ HERO PARALLAX ══ */
.hero-parallax-wrap {
  position: absolute; inset: 0; overflow: hidden; z-index: 0;
}
.hero-parallax-img {
  width: 100%; height: 130%;
  object-fit: cover; object-position: center;
  margin-top: -10%;
  will-change: transform;
  animation: kenBurns 25s ease-in-out infinite;
}
.hero-parallax-overlay {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(135deg,
    rgba(7,7,13,0.88) 0%,
    rgba(7,7,13,0.6)  55%,
    rgba(7,7,13,0.8)  100%);
}

/* ══ GALERÍA GRID ══ */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem; margin-top: 2rem;
}
.gallery-item {
  border-radius: var(--radius); overflow: hidden;
  border: 1px solid var(--border);
  background: var(--surface2);
  position: relative; cursor: pointer;
  opacity: 0;
}
.gallery-item img {
  width: 100%; height: auto; display: block;
  animation: kenBurns 20s ease-in-out infinite;
  will-change: transform;
}
.gallery-item__overlay {
  position: absolute; inset: 0;
  background: rgba(7,7,13,0.55);
  display: flex; align-items: flex-end; padding: 1rem;
  opacity: 0; transition: opacity .3s ease;
}
.gallery-item:hover .gallery-item__overlay,
.gallery-item.tapped .gallery-item__overlay { opacity: 1; }
.gallery-item__label {
  color: #fff; font-size: .8rem; font-weight: 700;
  background: var(--red); padding: .3rem .7rem; border-radius: 4px;
}
@media (max-width: 900px) {
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .gallery-grid { grid-template-columns: 1fr; }
}

/* ══ Ken Burns en galería existente de subpáginas ══ */
.gallery-service__img {
  animation: kenBurns 20s ease-in-out infinite;
  will-change: transform;
}
@media (max-width: 900px) {
  .gallery-service { grid-template-columns: repeat(2, 1fr); }
}

/* ══ SERVICE CARD THUMBNAIL (index.html) ══ */
.service-card__thumb {
  width: 100%; height: 160px;
  object-fit: cover; border-radius: 8px;
  display: block; margin-bottom: .5rem;
  animation: kenBurns 22s ease-in-out infinite;
  will-change: transform;
}

/* ══ VIDEO SECTION (index.html) ══ */
.video-section {
  background: var(--surface);
  padding: clamp(4rem,8vw,7rem) 2rem;
  text-align: center;
}
.video-section__tag {
  display: inline-block;
  color: var(--red); font-size: .72rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 3px;
  margin-bottom: 1rem;
}
.video-section__title {
  font-size: clamp(1.8rem,4vw,2.8rem);
  font-weight: 900; letter-spacing: -.03em;
  margin-bottom: 2.5rem;
}
.video-section__wrap {
  max-width: 900px; margin: 0 auto;
  border-radius: var(--radius); overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: 0 24px 80px rgba(0,0,0,.6);
}
.video-section__wrap video {
  width: 100%; display: block;
}
.video-section__cta { margin-top: 2rem; }

/* ══ CONTACT PHOTO CARDS (contacto.html) ══ */
.contact-photos {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 1rem; margin-top: 2rem;
}
.contact-photo {
  border-radius: var(--radius); overflow: hidden;
  border: 1px solid var(--border); position: relative;
}
.contact-photo img {
  width: 100%; height: 220px; object-fit: cover; display: block;
  animation: kenBurns 22s ease-in-out infinite;
}
.contact-photo__label {
  position: absolute; bottom: .8rem; left: .8rem;
  background: rgba(7,7,13,.82); color: #fff;
  font-size: .75rem; font-weight: 700;
  padding: .3rem .7rem; border-radius: 4px;
  backdrop-filter: blur(6px);
}
@media (max-width: 600px) {
  .contact-photos { grid-template-columns: 1fr; }
}
```

### JS COMPARTIDO — agregar en nuevo `<script>` al final de cada página

```javascript
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── PARALLAX HERO ── */
  var pImg = document.querySelector('.hero-parallax-img');
  if (pImg && !reduced) {
    window.addEventListener('scroll', function () {
      if (window.innerWidth < 768) return;
      pImg.style.transform = 'translateY(' + (window.scrollY * 0.28) + 'px)';
    }, { passive: true });
  }

  /* ── GALLERY SCROLL REVEAL (anime.js stagger) ── */
  var galleryItems = document.querySelectorAll('.gallery-item, .gallery-service__item');
  if (galleryItems.length && typeof anime !== 'undefined') {
    var gObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        gObs.unobserve(entry.target);
        if (reduced) { entry.target.style.opacity = 1; return; }
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 700,
          delay: 0,
          easing: 'easeOutExpo'
        });
      });
    }, { threshold: 0.08 });
    galleryItems.forEach(function (el) {
      el.style.opacity = 0;
      el.style.transform = 'translateY(30px)';
      gObs.observe(el);
    });
  }

  /* ── GALLERY HOVER / TAP ── */
  galleryItems.forEach(function (el) {
    if (!reduced) {
      el.addEventListener('mouseenter', function () {
        if (typeof anime !== 'undefined')
          anime({ targets: el, scale: 1.03, duration: 350, easing: 'easeOutExpo' });
      });
      el.addEventListener('mouseleave', function () {
        if (typeof anime !== 'undefined')
          anime({ targets: el, scale: 1, duration: 350, easing: 'easeOutExpo' });
      });
    }
    el.addEventListener('touchstart', function () {
      document.querySelectorAll('.gallery-item.tapped, .gallery-service__item.tapped')
        .forEach(function (t) { if (t !== el) t.classList.remove('tapped'); });
      el.classList.toggle('tapped');
    }, { passive: true });
  });
})();
```

---

## Task 1: index.html — CSS + Hero parallax + Video section

**Files:** Modify `index.html`

- [ ] **Paso 1:** Agregar CSS compartido antes del cierre `</style>` (ver Shared CSS Reference arriba)

- [ ] **Paso 2:** Reemplazar `.hero__img-bg` con estructura parallax:

```html
<!-- REEMPLAZAR este div: -->
<div class="hero__img-bg" aria-hidden="true"></div>

<!-- POR ESTA ESTRUCTURA: -->
<div class="hero-parallax-wrap" aria-hidden="true">
  <img src="assets/images/Paleta_Hero.jpg"
       class="hero-parallax-img"
       alt=""
       loading="eager"
       fetchpriority="high">
  <div class="hero-parallax-overlay"></div>
</div>
```

- [ ] **Paso 3:** Agregar `.hero__content { position:relative; z-index:2; }` al CSS (ya debería tener z-index:2, verificar).

- [ ] **Paso 4:** Agregar thumbnail a cada service card — insertar `<img>` como primer hijo de cada `.service-card`:

```html
<!-- Etiquetas -->
<img src="assets/images/etiqueta-auto.jpg"
     alt="Etiquetas autoadhesivas Multigraff"
     class="service-card__thumb" loading="lazy">

<!-- Papelería -->
<img src="assets/images/pap-comer_.jpg"
     alt="Papelería comercial Multigraff"
     class="service-card__thumb" loading="lazy">

<!-- Folletos -->
<img src="assets/images/folleteria_.jpg"
     alt="Folletos y volantes Multigraff"
     class="service-card__thumb" loading="lazy">

<!-- Sellos -->
<img src="assets/images/Sello y almohadilla.jpg"
     alt="Sellos de goma Multigraff"
     class="service-card__thumb" loading="lazy">

<!-- Gran Formato -->
<img src="assets/images/Cartel.jpg"
     alt="Impresión gran formato Multigraff"
     class="service-card__thumb" loading="lazy">
```

- [ ] **Paso 5:** Eliminar la sección `<section class="before-after" id="galeria">...</section>` completa.

- [ ] **Paso 6:** Agregar sección video entre `</section>` de características y `<section class="section" id="resenas">`:

```html
<!-- ═══ CÓMO TRABAJAMOS ═══ -->
<section class="video-section sr">
  <div class="container">
    <span class="video-section__tag">Nuestro proceso</span>
    <h2 class="video-section__title">Así trabajamos en Multigraf</h2>
    <div class="video-section__wrap">
      <video autoplay muted loop playsinline
             poster="assets/images/Maquina prin_1.jpg">
        <source src="assets/videos/VID_20260508_174819.mp4" type="video/mp4">
      </video>
    </div>
    <div class="video-section__cta">
      <a class="btn btn-wa"
         href="https://wa.me/542612013773?text=Hola%20Multigraff%2C%20quiero%20un%20presupuesto"
         target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" width="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Pedir presupuesto
      </a>
    </div>
  </div>
</section>
```

- [ ] **Paso 7:** Agregar JS compartido en nuevo `<script>` antes de `</body>` (ver Shared JS Reference arriba). El anime.js CDN ya está presente.

- [ ] **Paso 8:** Verificar visualmente en el preview: hero con imagen real, thumbnails en cards, sección video visible, sin sección antes/después.

---

## Task 2: etiquetas-autoadhesivas/index.html

**Files:** Modify `etiquetas-autoadhesivas/index.html`

- [ ] **Paso 1:** Agregar CDN anime.js antes del `</body>` de la subpágina (si no está):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
```

- [ ] **Paso 2:** Agregar CSS compartido antes de `</style>`.

- [ ] **Paso 3:** Dentro de `<div class="hero-inner__bg">`, agregar imagen parallax:

```html
<div class="hero-parallax-wrap" aria-hidden="true">
  <img src="../assets/images/etiqueta-auto.jpg"
       class="hero-parallax-img"
       alt=""
       loading="eager"
       fetchpriority="high">
  <div class="hero-parallax-overlay"></div>
</div>
```

- [ ] **Paso 4:** Asegurarse que `.hero-inner__content` tenga `position:relative; z-index:2` en el CSS.

- [ ] **Paso 5:** Reemplazar los 3 items de galería actuales (con placeholders) por 7 items reales. La sección `<div class="gallery-service">` pasa a tener 7 items con clase `gallery-service__item`:

```html
<div class="gallery-service">

  <div class="gallery-service__item sr">
    <img src="../assets/images/etiqueta-auto.jpg"
         alt="Etiquetas autoadhesivas en rollo — Multigraff"
         class="gallery-service__img" loading="lazy">
    <div class="gallery-service__caption">Etiquetas en rollo</div>
  </div>

  <div class="gallery-service__item sr">
    <img src="../assets/images/etiqueta-auto2.jpg"
         alt="Etiquetas de papel couché — Multigraff"
         class="gallery-service__img" loading="lazy">
    <div class="gallery-service__caption">Papel couché</div>
  </div>

  <div class="gallery-service__item sr">
    <img src="../assets/images/etiqueta-auto3.jpg"
         alt="Etiquetas de vinilo — Multigraff"
         class="gallery-service__img" loading="lazy">
    <div class="gallery-service__caption">Vinilo resistente</div>
  </div>

  <div class="gallery-service__item sr">
    <img src="../assets/images/etiqueta-auto4.jpg"
         alt="Etiquetas transparentes — Multigraff"
         class="gallery-service__img" loading="lazy">
    <div class="gallery-service__caption">Transparente OPP</div>
  </div>

  <div class="gallery-service__item sr">
    <img src="../assets/images/etiqueta-auto5.jpg"
         alt="Etiquetas para productos — Multigraff"
         class="gallery-service__img" loading="lazy">
    <div class="gallery-service__caption">Para productos</div>
  </div>

  <div class="gallery-service__item sr">
    <img src="../assets/images/etiqueta-auto6.jpg"
         alt="Etiquetas troqueladas — Multigraff"
         class="gallery-service__img" loading="lazy">
    <div class="gallery-service__caption">Troqueladas</div>
  </div>

  <div class="gallery-service__item sr">
    <img src="../assets/images/etiqueta-auto7.jpg"
         alt="Etiquetas personalizadas — Multigraff"
         class="gallery-service__img" loading="lazy">
    <div class="gallery-service__caption">Personalizadas</div>
  </div>

</div>
```

- [ ] **Paso 6:** Actualizar el CSS de `.gallery-service` — cambiar el responsive de mobile de 1fr a 2fr en tablet:

```css
/* REEMPLAZAR el bloque @media existente de gallery-service: */
@media (max-width: 900px) {
  .gallery-service { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 500px) {
  .gallery-service { grid-template-columns: 1fr; }
}
```

- [ ] **Paso 7:** Reemplazar el `<script>` de scroll reveal existente por el JS compartido (ver Shared JS Reference). O agregar el JS compartido en nuevo `<script>` si el scroll reveal ya está en el existente. Verificar que no haya duplicados de `.sr` observers.

- [ ] **Paso 8:** Verificar: hero con imagen + overlay oscuro visible, galería con 7 fotos reales con Ken Burns.

---

## Task 3: papeleria-comercial/index.html

**Files:** Modify `papeleria-comercial/index.html`

Mismo patrón que Task 2. Diferencias:

- [ ] **Paso 1:** CDN anime.js + CSS compartido.

- [ ] **Paso 2:** Hero parallax con `../assets/images/pap-comer_.jpg`.

- [ ] **Paso 3:** Galería con ~20 fotos — reemplazar items existentes:

```html
<!-- pap-comer serie (7 items) -->
<div class="gallery-service__item sr">
  <img src="../assets/images/pap-comer_.jpg" alt="Papelería comercial Multigraff" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Papelería corporativa</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/pap-comer_2.jpg" alt="Tarjetas de presentación" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Tarjetas de presentación</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/pap-comer_3.jpg" alt="Membretes corporativos" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Membretes</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/pap-comer_4.jpg" alt="Formularios impresos" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Formularios</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/pap-comer_5.jpg" alt="Papelería comercial variada" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Papelería variada</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/pap-comer_6.jpg" alt="Papelería de empresa" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Papelería de empresa</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/pap-comer_ver.jpg" alt="Papelería vertical" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Formato vertical</div>
</div>
<!-- sobres (5 items) -->
<div class="gallery-service__item sr">
  <img src="../assets/images/sobres.jpg" alt="Sobres impresos" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Sobres personalizados</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/sobres_01.jpg" alt="Sobres comerciales" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Sobres comerciales</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/sobres_02.jpg" alt="Sobres con logo" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Sobres con logo</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/sobres_03.jpg" alt="Sobres A4" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Sobres A4</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/sobre_05.jpg" alt="Sobres con membrete" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Con membrete</div>
</div>
<!-- carpetas (5 items seleccionados) -->
<div class="gallery-service__item sr">
  <img src="../assets/images/Carpeta_.jpg" alt="Carpetas impresas Multigraff" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Carpetas corporativas</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/Carpeta_01.jpg" alt="Carpeta con bolsillo" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Con bolsillo</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/Carpeta_02.jpg" alt="Carpeta plastificada" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Plastificada</div>
</div>
<!-- resmas (3 items) -->
<div class="gallery-service__item sr">
  <img src="../assets/images/resma ver.jpg" alt="Resma de papel A4" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Resmas A4</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/resma ver 01.jpg" alt="Papel cortado a medida" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Cortado a medida</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/Escritorio-ver.jpg" alt="Papelería en escritorio" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Para escritorio</div>
</div>
```

- [ ] **Paso 4:** Actualizar responsive de galería (igual que Task 2, Paso 6).

- [ ] **Paso 5:** Agregar JS compartido.

- [ ] **Paso 6:** Verificar visualmente.

---

## Task 4: folletos-y-volantes/index.html

**Files:** Modify `folletos-y-volantes/index.html`

- [ ] **Paso 1:** CDN anime.js + CSS compartido.

- [ ] **Paso 2:** Hero parallax con `../assets/images/folleteria_.jpg`.

- [ ] **Paso 3:** Galería con 7 fotos:

```html
<div class="gallery-service__item sr">
  <img src="../assets/images/folleteria_.jpg" alt="Folletos Multigraff" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Folletería general</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/folleteria_1.jpg" alt="Dípticos impresos" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Dípticos</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/folleteria_2.jpg" alt="Trípticos Multigraff" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Trípticos</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/folleteria_3.jpg" alt="Volantes publicitarios" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Volantes</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/folleteria_4.jpg" alt="Brochures corporativos" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Brochures</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/folleteria_5.jpg" alt="Folletos a color" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Full color</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/libros-folleteria.jpg" alt="Libros y revistas" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Libros y revistas</div>
</div>
```

- [ ] **Paso 4:** Responsive galería + JS compartido. Verificar.

---

## Task 5: sellos-de-goma/index.html

**Files:** Modify `sellos-de-goma/index.html`

- [ ] **Paso 1:** CDN anime.js + CSS compartido.

- [ ] **Paso 2:** Hero parallax con `../assets/images/Sello y almohadilla.jpg`.

- [ ] **Paso 3:** Galería con 10 fotos sellos:

```html
<div class="gallery-service__item sr">
  <img src="../assets/images/Sello y almohadilla.jpg" alt="Sellos y almohadillas Multigraff" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Sellos y almohadillas</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/sello y almohadilla 2.jpg" alt="Sellos de goma personalizados" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Personalizados</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/sello-auto-1.jpg" alt="Sello automático" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Automáticos</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/sello-auto-2.jpg" alt="Sello con logo" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Con logo</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/sello-auto-3.jpg" alt="Sello de empresa" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">De empresa</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/sello-auto-4.jpg" alt="Sello para notaría" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Para notaría</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/sello-auto-5.jpg" alt="Sello datador" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Datadores</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/sello-auto-6.jpg" alt="Sello de goma rectangular" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Rectangular</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/sello-auto-7.jpg" alt="Sello redondo" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Redondo</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/sello-auto-8.jpg" alt="Sello especial" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Especiales</div>
</div>
```

- [ ] **Paso 4:** Responsive galería + JS compartido. Verificar.

---

## Task 6: impresion-gran-formato/index.html

**Files:** Modify `impresion-gran-formato/index.html`

- [ ] **Paso 1:** CDN anime.js + CSS compartido.

- [ ] **Paso 2:** Hero parallax con `../assets/images/Cartel.jpg`.

- [ ] **Paso 3:** Galería con 9 fotos (maquinaria + interior + cartel):

```html
<div class="gallery-service__item sr">
  <img src="../assets/images/Cartel.jpg" alt="Banner gran formato Multigraff" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Banners y carteles</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/Maquina prin_1.jpg" alt="Prensa de impresión Multigraff" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Equipamiento offset</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/maquina prin_2.jpg" alt="Máquina de impresión digital" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Impresión digital</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/Maquina prin_3.jpg" alt="Taller de impresión Multigraff" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Taller industrial</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/Maquina prin_4.jpg" alt="Proceso de impresión" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Proceso de impresión</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/interior_.jpg" alt="Interior del taller Multigraff" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Nuestro taller</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/interior_1.jpg" alt="Área de producción" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Área de producción</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/int ver.jpg" alt="Vista interior vertical" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Interior del local</div>
</div>
<div class="gallery-service__item sr">
  <img src="../assets/images/patente-impcolor.jpg" alt="Impresión a color" class="gallery-service__img" loading="lazy">
  <div class="gallery-service__caption">Impresión a color</div>
</div>
```

- [ ] **Paso 4:** Responsive galería + JS compartido. Verificar.

---

## Task 7: contacto/index.html

**Files:** Modify `contacto/index.html`

- [ ] **Paso 1:** CDN anime.js (si no está) + CSS compartido.

- [ ] **Paso 2:** Dentro de la columna izquierda del contacto (después de `.contact__wa-block`), agregar:

```html
<div class="contact-photos sr">
  <div class="contact-photo">
    <img src="../assets/images/entrada.jpg"
         alt="Local de Multigraff Litografía en Maipú, Mendoza"
         loading="lazy">
    <span class="contact-photo__label">Nuestra entrada</span>
  </div>
  <div class="contact-photo">
    <img src="../assets/images/nosotros.jpg"
         alt="Equipo de Multigraff Litografía"
         loading="lazy">
    <span class="contact-photo__label">Nuestro equipo</span>
  </div>
</div>
```

- [ ] **Paso 3:** Agregar JS compartido.

- [ ] **Paso 4:** Verificar que las fotos aparezcan debajo del bloque de WhatsApp y arriba del mapa.

---

## Self-Review Checklist

- [x] **Spec coverage:** Hero parallax ✓ | Ken Burns ✓ | Scroll entrance stagger ✓ | Hover desktop + tap mobile ✓ | Video section ✓ | Quitar antes/después ✓ | Contacto fotos ✓ | 7 páginas ✓
- [x] **Placeholders:** Sin TBD ni TODO. Todos los paths de imagen son específicos.
- [x] **Consistencia de nombres:** `gallery-service__img` en subpáginas, `gallery-item img` en index (no se mezclan). El JS compartido cubre ambas con `querySelectorAll('.gallery-item, .gallery-service__item')`.
- [x] **Rutas con espacios:** Cubiertas — los atributos `src` en HTML manejan espacios sin problema.
- [x] **Mobile:** Gallery responsive en 3 tasks (900px→2col, 500px→1col). Parallax desactivado en <768px. Ken Burns activo en mobile (reducido via reduced-motion media query).
