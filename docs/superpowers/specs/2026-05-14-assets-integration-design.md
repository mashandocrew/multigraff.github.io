# Diseño: Integración de Assets (Imágenes y Video) — Multigraff 2.0
**Fecha:** 2026-05-14  
**Estado:** Aprobado por el usuario

---

## Alcance

Integración de 77 imágenes JPG y 1 video MP4 en las 7 páginas del sitio. Eliminación de la sección "Antes/Después". Implementación de sistema de animaciones físicas (parallax, Ken Burns, scroll entrance).

---

## Páginas afectadas

| Página | Cambios |
|---|---|
| `index.html` | Hero real, service cards con foto, features con fotos, quitar antes/después, nueva sección video |
| `etiquetas-autoadhesivas/index.html` | Hero parallax + galería 7 fotos |
| `papeleria-comercial/index.html` | Hero parallax + galería ~20 fotos (carpetas, sobres, resmas, pap-comer) |
| `folletos-y-volantes/index.html` | Hero parallax + galería 6 fotos |
| `sellos-de-goma/index.html` | Hero parallax + galería 10 fotos sellos |
| `impresion-gran-formato/index.html` | Hero parallax + galería maquinaria + interiores |
| `contacto/index.html` | Cards visuales con entrada.jpg + nosotros.jpg |

---

## Mapeo de assets

### index.html
- Hero bg: `assets/images/Paleta_Hero.jpg`
- Service card etiquetas: `assets/images/etiqueta-auto.jpg`
- Service card papelería: `assets/images/pap-comer_.jpg`
- Service card folletos: `assets/images/folleteria_.jpg`
- Service card sellos: `assets/images/Sello y almohadilla.jpg`
- Service card gran formato: `assets/images/Cartel.jpg`
- Features visual: `assets/images/Maquina prin_1.jpg`, `nosotros.jpg`
- Video section: `assets/videos/VID_20260508_174819.mp4` (o el que permanezca)

### Subpáginas (galerías)
- **etiquetas/**: `etiqueta-auto.jpg` → `etiqueta-auto7.jpg`
- **papelería/**: `pap-comer_.jpg`, `pap-comer_2.jpg`–`pap-comer_6.jpg`, `pap-comer_ver.jpg`, `sobres.jpg`–`sobre_05.jpg`, `Carpeta_.jpg`–`Carpeta_15.jpg`, `resma ver.jpg`–`resma ver 03.jpg`
- **folletos/**: `folleteria_.jpg`, `folleteria_1.jpg`–`folleteria_5.jpg`, `libros-folleteria.jpg`
- **sellos/**: `Sello y almohadilla.jpg`, `sello y almohadilla 2.jpg`, `sello-auto-1.jpg`–`sello-auto-9.jpg`
- **gran formato/**: `Cartel.jpg`, `Maquina prin_1.jpg`–`Maquina prin_4.jpg`, `interior_.jpg`–`int2 ver.jpg`
- **contacto/**: `entrada.jpg`, `nosotros.jpg`, `nosotros1.jpg`

---

## Sistema de animaciones

### 1. Parallax de scroll (Hero)
- JS vanilla: listener `scroll` → `translateY(scrollY * 0.3)` en `img` del hero
- Mobile (<768px): desactivado, imagen fija con `object-position: center`

### 2. Ken Burns (galerías)
- CSS `@keyframes kenBurns` con `scale(1) → scale(1.06)` + leve translate, 20s infinite
- Aplicado a cada `<img>` dentro de `.gallery-item`
- Mobile: reducido a `scale(1) → scale(1.03)`, misma duración

### 3. Scroll entrance (anime.js existente)
- Los `.gallery-item` tienen clase `.sr`
- Stagger 80ms, `translateY 30px→0`, `opacity 0→1`, `easeOutExpo`
- Imágenes verticales: además `rotate: 2deg → 0` para diferenciarse

### 4. Hover galería (desktop)
- `mouseenter`: anime.js `scale: 1.04`, `duration: 350`, `easeOutExpo`
- `mouseleave`: anime.js `scale: 1`
- Overlay de categoría visible en tap (mobile)

### 5. Video section
- HTML5 `<video autoplay muted loop playsinline>`
- Full-bleed con overlay oscuro + texto "Así trabajamos"
- `max-width: 900px` centrado, `border-radius: var(--radius)`

---

## Layout de galería

```
Desktop (>900px):  grid-template-columns: repeat(3, 1fr)
Tablet (600-900px): repeat(2, 1fr)
Mobile (<600px):   1fr (full width)
```

- Imágenes: `width: 100%`, `height: auto` (sin corte, aspect-ratio libre)
- `gap: 1rem` en todas las resoluciones
- `border-radius: var(--radius)` + `overflow: hidden` por item
- Vertical e horizontal conviven naturalmente en el grid

---

## Componente CSS reutilizable

Un bloque `gallery-section` idéntico en todas las subpáginas, con:
- `.gallery-grid` (el CSS Grid)
- `.gallery-item` (wrapper con overflow:hidden + Ken Burns)
- `.gallery-item--vertical` (sin cambios de layout, el grid lo absorbe)

El JS de animaciones se extrae a un `<script>` compartido inline en cada página (no hay build system, todo inline).

---

## Restricciones técnicas

- Sin bundler / sin npm — todo CDN o inline
- Anime.js ya instalado en `index.html`; se agrega a las subpáginas también
- Imágenes con espacios en los nombres → rutas entre comillas en HTML/CSS
- `prefers-reduced-motion`: Ken Burns y parallax se desactivan; scroll entrance se mantiene (opción menos intrusiva)
