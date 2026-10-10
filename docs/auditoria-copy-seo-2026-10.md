# Auditoría de copy, SEO local y GEO — multigraff.com

Fecha: 10/10/2026 · Alcance: las 8 páginas del repo (home, 6 servicios, contacto), con sus metadatos, JSON-LD, robots.txt y sitemap.

---

## Resumen ejecutivo

La estructura, el diseño y la arquitectura de la información están bien, tal como le dijeron. Hay tres problemas:

1. **Un error técnico grave.** Las 7 páginas internas tienen el `canonical` apuntando a `https://www.multigraff.com/propuesta-moderna/...`, una URL de borrador que no existe. Con eso le está diciendo a Google que **no indexe las páginas reales**. Es la razón más probable de que las páginas de servicio no posicionen. Hay que arreglarlo antes de tocar cualquier texto.
2. **El sitio no ataca las búsquedas que usted quiere ganar.** "Fotocopias" no aparece en ninguna página (salvo dos veces de pasada en resmas). "Impresiones" sale 4 veces en todo el sitio. Los `<title>` dicen "Mendoza" y no "Maipú". Google no puede poner a Multigraff primero en "fotocopias Maipú" si el sitio nunca dice que hace fotocopias.
3. **Copy con marcas de IA.** Muchos adjetivos sin datos ("alta calidad", "excelencia", "tecnología de punta", "impecable"), ideas repetidas con otras palabras dentro de un mismo párrafo, cierres en tríada ("calidad, rapidez y diseño") y párrafos que definen lo obvio ("¿Qué son las etiquetas autoadhesivas?"). En números: "imagen profesional / profesionalismo" aparece 7 veces, "toda la provincia" 9, "a medida" 11, "tu empresa necesita" 5, "colores vibrantes" 4.

**Una aclaración honesta sobre el objetivo de "top 3":** para "imprenta Maipú" o "fotocopias Maipú", los tres primeros resultados en Google casi siempre son el **mapa (Local Pack)**, y el mapa se gana sobre todo con el **Perfil de Empresa de Google** (categorías, reseñas, fotos, cercanía), no con la web. Con 17 reseñas y un promedio de 4,1, Multigraff queda en desventaja frente a cualquier competidor que tenga 60 reseñas con 4,7. La web ayuda (relevancia y confianza), pero el plan tiene que incluir el Perfil de Empresa. Lo detallo en la sección 5.

---

## 1. 🔴 Crítico: arreglar primero

| # | Hallazgo | Dónde | Fix |
|---|---|---|---|
| 1 | `canonical` apunta a `https://www.multigraff.com/propuesta-moderna/<slug>/` (dominio con www + carpeta de borrador) | Las 7 páginas internas | Cambiar a `https://multigraff.com/<slug>/` |
| 2 | El `BreadcrumbList` usa la misma URL de borrador | `resmas-papel/index.html` | Mismas URL corregidas |
| 3 | `og:image` y la `image` del JSON-LD apuntan a `/assets/images/og-multigraff.jpg`, que **no existe** | `index.html` | Crear la imagen de 1200×630 o apuntar a un WebP real (p. ej. `entrada.webp` o `Cartel.webp`) |
| 4 | Texto interno publicado: *"Estamos armando el grupo de cartelería y vinilos. Mientras tanto…"* | Gran formato | Sacarlo y poner un CTA directo (WhatsApp general) |
| 5 | Inconsistencia de marca: el `<title>`, `og:title`, `twitter:title` y `alternateName` de la home dicen "Litografía Multigraf" (una f), el resto del sitio dice "Multigraff" (~200 veces) y el email es "litografiamultigraf@" | Todo el sitio | Elegir **un** nombre canónico, igual al del Perfil de Empresa de Google. Dejar el otro solo como `alternateName` en el JSON-LD |

---

## 2. SEO local: Maipú, imprenta, fotocopias, impresiones

### 2.1 Mapa de keywords (qué página gana cada búsqueda)

| Búsqueda objetivo | Página que debería ganar | Situación actual |
|---|---|---|
| imprenta Maipú / imprenta en Maipú Mendoza | Home | El title dice "Imprenta en Mendoza". Maipú solo aparece en el H1 dentro de una frase larga |
| fotocopias Maipú / fotocopiadora Maipú | **No existe página** | 0 menciones |
| impresiones Maipú / imprimir en Maipú / impresión color B&N | **No existe página** | Casi 0 menciones |
| etiquetas autoadhesivas Mendoza / Maipú | /etiquetas-autoadhesivas/ | Bien enfocada, pero el canonical está roto |
| sellos de goma Maipú | /sellos-de-goma/ | Dice "entrega rápida **en la ciudad de Mendoza**" (el local está en Maipú) |
| resmas A4 Maipú | /resmas-papel/ | Bien |
| gigantografías / ploteo Maipú | /impresion-gran-formato/ | Bien enfocada, con el canonical roto |

### 2.2 Acciones

1. **[CONFIRMAR] ¿Multigraff hace fotocopias e impresiones sueltas al público (B&N, color, anillado, escaneo)?** Si es así, es la oportunidad de mayor volumen local. Conviene crear `/fotocopias-e-impresiones-maipu/` con servicios, precios orientativos o "consultá", horario, dirección y FAQ ("¿Imprimen desde el celular o un pendrive?", "¿Hacen anillados?", "¿Puedo mandar el archivo por WhatsApp y retirarlo?"). Si no lo hace, no hay que forzarlo: posicionar por un servicio que no se ofrece genera rebote y reseñas malas.
2. **Titles con Maipú primero** (menos de 60 caracteres):
   - Home: `Imprenta en Maipú, Mendoza | Multigraff Litografía`
   - Servicios: `Etiquetas Autoadhesivas en Maipú, Mendoza | Multigraff` (mismo patrón para el resto)
3. **H1 de la home con la keyword, sin el relleno.** Actual: *"Imprimí tu marca en Maipú, Mendoza con la calidad que tu empresa merece"*. Propuesta: *"Imprenta en Maipú, Mendoza, desde 1997"*. El tono emocional puede ir en el subtítulo.
4. **Un párrafo de entidad en la home** (lo que las IA citan literalmente; ver GEO).
5. **Mencionar barrios y departamentos vecinos con naturalidad, solo donde sea cierto.** Por ejemplo: "Estamos sobre Circunvalación J. A. Maza 786, a X cuadras de [referencia conocida] [CONFIRMAR]. Atendemos clientes de Maipú, Luján, Godoy Cruz y Guaymallén." Hoy no hay ninguna referencia geográfica fuera de "Maipú" y "toda la provincia".
6. **og:url y JSON-LD por página.** Solo la home tiene `og:url` y `LocalBusiness`. Agregar en cada servicio un `Service` con `provider` → `#localbusiness` y `areaServed: Maipú, Mendoza`, más un `BreadcrumbList`.
7. **Sitemap:** agregar `<lastmod>` (hoy no tiene).

---

## 3. GEO: cómo lo leen ChatGPT, Gemini, Claude y Perplexity

**Lo que ya está bien:** contenido en HTML estático (no depende de JS), FAQPage válido y coincidente con el texto visible, robots.txt que permite GPTBot, ClaudeBot, PerplexityBot y Google-Extended.

**Lo que falta:**

1. **Agregar `OAI-SearchBot`** (el buscador de ChatGPT, distinto de GPTBot) a robots.txt. Como hay `User-agent: * Allow: /`, técnicamente ya entra, pero declararlo explícitamente no cuesta nada.
2. **Frases de entidad, autocontenidas y con datos.** Las IA extraen oraciones que se entienden solas. Hoy casi todas dependen del contexto ("soluciones gráficas personalizadas con tecnología de punta para que tu marca destaque" no dice nada que se pueda citar). Propuesta para la home, debajo del hero o en "Nosotros":
   > Multigraff Litografía es una imprenta de Maipú, Mendoza, abierta en 1997. Está en Circunvalación Juan Agustín Maza 786 y atiende de lunes a viernes de 9:00 a 17:30. Imprime en offset y digital: etiquetas autoadhesivas sin cantidad mínima, papelería comercial, talonarios, folletos, sellos de goma y gran formato. También vende resmas A4 Eclipse y Boreal.
3. **Datos concretos en vez de adjetivos.** Las IA (y Google) premian lo verificable: marcas y modelos de máquinas [CONFIRMAR], plazos reales ("sellos en 24–48 h hábiles" es un gran ejemplo, ya está en el sitio), tiradas mínimas, gramajes y medidas. Cada "alta calidad" debería reemplazarse por un dato o eliminarse.
4. **FAQ por página de servicio** (hoy solo hay FAQ en la home). 3 o 4 preguntas reales por servicio, sacadas de lo que preguntan los clientes por WhatsApp.
5. **Fecha visible.** "Precios y stock actualizados: octubre 2026" en resmas; `dateModified` en el JSON-LD.
6. **Consistencia NAP** (nombre, dirección, teléfono) idéntica en la web, el Perfil de Empresa, Facebook, Instagram y los directorios. Las IA cruzan esas fuentes. Agregar en `sameAs` las redes reales [CONFIRMAR URLs]. Hoy solo figura un link corto de Maps.

---

## 4. Auditoría de copy IA, página por página

### Patrones detectados en todo el sitio

| Patrón | Ejemplos reales | Qué hacer |
|---|---|---|
| Adjetivos vacíos | "alta calidad" (8), "excelencia" (3), "tecnología de punta / última generación", "impecable", "de gran impacto" | Reemplazar por un dato o borrar |
| Misma idea dicha dos veces | "Entregas rápidas sin comprometer ni un detalle de la calidad"; "Plazos Competitivos" + "Precios Competitivos" seguidos | Una sola vez, con dato |
| Tríadas de cierre | "Calidad, rapidez y diseño a medida en cada sello"; "Sin compromiso, rápido y por WhatsApp" | Cortar en el primer elemento útil |
| "No solo X, sino Y" | "para que tu etiqueta no solo informe, sino que destaque en la góndola" | Afirmación directa |
| Definiciones obvias | "Las etiquetas autoadhesivas son elementos impresos con un adhesivo incorporado…" | Borrar; nadie que busca etiquetas necesita la definición |
| Grandilocuencia | "es la primera impresión que tu empresa deja… comunica quién sos y cuánto te importa…" | Bajar a lo concreto |
| Promesas inconsistentes | "presupuesto **en minutos**" (folletos) vs "**respuesta en el día**" (contacto) vs "respondemos rápido" (papelería) | Una sola promesa, la real [CONFIRMAR] |
| Errores técnicos que delatan texto genérico | Papelería: "Relieve seco (stamping)". El stamping es laminado metálico con calor y el relieve seco es gofrado: son dos procesos distintos | Corregir; un cliente del rubro lo nota enseguida |

### Home

| Actual | Propuesta |
|---|---|
| H1: "Imprimí tu marca en Maipú, Mendoza con la calidad que tu empresa merece" | "Imprenta en Maipú, Mendoza, desde 1997" |
| "Más de 28 años imprimiendo para empresas en Argentina. Etiquetas, papelería corporativa, folletos y gran formato, siempre en tiempo y forma." | "Offset y digital para empresas, comercios y particulares. Etiquetas sin mínimo, papelería, folletos, sellos y gran formato." |
| "Soluciones gráficas personalizadas con tecnología de punta para que tu marca destaque" | Borrar el subtítulo, o: "Elegí el servicio y pedí presupuesto por WhatsApp." |
| Sección "Más de 28 años de excelencia gráfica" + "Desde 1997 convirtiendo ideas en impresiones de excelencia" + "Experiencia Comprobada: Desde 1997…" | **Tres veces el mismo dato en una sola sección.** Dejar el título "Desde 1997 en Maipú" y usar los 5 bullets para cosas distintas y verificables |
| 5 bullets ("Equipamiento Moderno", "Atención Personalizada", "Plazos Competitivos", "Precios Competitivos"…) | Ejemplo: "Offset y digital en el mismo taller" · "Etiquetas sin cantidad mínima" · "Sellos en 24–48 h" · "Presupuesto por WhatsApp" · "Retiro en el local o envío" [CONFIRMAR cada uno] |
| "Trabajos reales para clientes reales" | "Trabajos hechos en nuestro taller" |
| "La opinión real de quienes confían en nosotros para sus proyectos" | Borrar; las reseñas ya lo dicen |
| Card Papelería: "…para proyectar una imagen profesional impecable" | "Tarjetas, sobres, membretes, carpetas y talonarios." |
| Card Sellos: "Entrega rápida, máxima precisión en cada detalle." | "Automáticos, de madera y flash. Listos en 24–48 h hábiles." |

### Etiquetas autoadhesivas (la de más relleno)

- Borrar todo el párrafo "¿Qué son las etiquetas autoadhesivas?" y empezar por el segundo, recortado.
- "sin cantidad mínima" aparece 4 veces (subtítulo, intro, "¿Por qué elegir?" dos veces, CTA). Con una arriba y una en el CTA alcanza.
- El subtítulo del H1, "en papel autoadhesivo, en plano y vinilo", no se entiende. Propuesta: "En rollo o en plancha, en papel, vinilo o transparente. Sin cantidad mínima."
- "Cada etiqueta pasa por un control de calidad riguroso para garantizar adherencia, resistencia y fidelidad cromática": frase de relleno. Borrar o reemplazar por algo concreto.
- **[CONFIRMAR]** barniz UV, laminado, stamping, datos variables y rollo para aplicación automática. Si algo no se hace, sacarlo. Las IA y los clientes lo toman como promesa.

### Papelería comercial

- Párrafo "Tu imagen corporativa empieza por la papelería…": 75 palabras sin un solo dato. Propuesta: "Imprimimos la papelería de todos los días: tarjetas, sobres con logo, hojas membretadas, carpetas, talonarios (facturas, remitos, recibos) y formularios numerados."
- "Coherencia visual de marca" no es un acabado, pero está en la lista de acabados. Moverlo o borrarlo.
- Corregir "Relieve seco (stamping)".
- Falta la keyword "talonarios / facturas / remitos Maipú", que tiene búsquedas locales reales. Hoy aparece poco.

### Folletos y volantes

- "somos especialistas… garantizamos resultados impecables en cada tirada: colores vibrantes, textos nítidos y una presentación visual que transmite profesionalismo" → "Imprimimos volantes, dípticos y trípticos en offset y digital, desde 100 unidades."
- "Envío a toda la provincia" está metido en la lista de papeles. Sacarlo de ahí.
- Lo mejor de la página es el párrafo de tamaños y tiradas (datos concretos). Ese es el tono a imitar en todo el sitio.

### Sellos de goma

- Subtítulo: "Calidad, rapidez y diseño a medida en cada sello" → "Automáticos, de madera y flash. Listos en 24 a 48 horas hábiles."
- "entrega rápida en la ciudad de Mendoza" → "retiro en Maipú" [CONFIRMAR si hay envío].
- "Tintas en múltiples colores" está dentro de "Usos y aplicaciones", y no es un uso. Moverlo.
- "24–48 h" aparece 4 veces. Dejarla en el subtítulo, el cuerpo y el CTA, y que sea idéntica en los tres.

### Gran formato

- Sacar el texto interno "Estamos armando el grupo…".
- La sección "Máximo impacto visual con gran formato" repite lo que ya dicen las dos líneas de arriba: "la solución ideal", "mayor alcance e impacto visual posible", "equipamiento de última generación", "colores vibrantes que no pierden definición a cualquier escala". Recortar a 1 o 2 líneas.
- "Roll-ups" y "Displays / estructuras retráctiles" son el mismo producto en dos cards. Unificarlos.
- **[CONFIRMAR]** "tintas ecosolventes y látex", "backlight", "microperforado", "ojales, bolsillos, blackout". Si es cierto, es un excelente contenido técnico. Si no, es riesgo.

### Resmas

La página mejor escrita: concreta, útil, sin adjetivos. Solo:
- Agregar "fotocopias" con sentido ("ideal para fotocopias e impresión diaria" ya está bien) y, si corresponde, un link a la futura página de fotocopias.
- Fecha de actualización de stock.

### Contacto

- "Más de 28 años imprimiendo calidad" (repetido en H1-sub y en meta). Cambiar por algo útil: "Te respondemos por WhatsApp en horario de atención."
- "Sin formularios en papel." no tiene sentido. Borrar.
- H1 "Hablemos de tu proyecto": está bien, pero sin keyword. Opción: "Contacto: imprenta en Maipú".

### Bloques repetidos en todas las páginas

- "Imprenta offset y digital en Maipú, Mendoza. Trabajos para empresas desde 1997." (footer): está bien, es la frase de entidad.
- Las tarjetas de "Servicios relacionados" usan una descripción distinta en cada página para el mismo servicio (papelería se describe de 4 maneras distintas). Conviene una sola descripción corta y fija por servicio.

---

## 5. Fuera de la web (lo que más pesa para el top 3 en Maipú)

1. **Perfil de Empresa de Google**
   - Categoría principal: "Imprenta". Secundarias que apliquen [CONFIRMAR]: "Servicio de fotocopias", "Tienda de sellos de goma", "Proveedor de etiquetas", "Servicio de impresión digital".
   - Nombre idéntico al de la web.
   - Fotos nuevas de forma regular (el sitio ya tiene un excelente banco de fotos reales).
   - Productos y servicios cargados con link a cada página.
   - Publicaciones mensuales.
2. **Reseñas:** pasar de 17 a más de 50 con un pedido sistemático. Por ejemplo, un link directo a "dejar reseña" en el mensaje de WhatsApp al entregar el trabajo, o un QR en el mostrador. Responder todas las reseñas, también las viejas. Nunca comprar reseñas ni ofrecer descuentos a cambio (va contra las políticas de Google).
3. **Citas NAP:** cargar o corregir Multigraff en Apple Maps, Bing Places, Waze, Páginas Amarillas y la guía de la Municipalidad de Maipú [CONFIRMAR existencia], con el mismo nombre, dirección y teléfono.
4. **Menciones locales:** proveedores, clientes (bodegas, comercios de Maipú) o medios locales que enlacen al sitio. Para las IA, estas menciones externas pesan tanto como la propia web.

---

## 6. Plan priorizado

1. 🔴 Corregir los canonicals y el breadcrumb (15 min). Pedir reindexación en Search Console.
2. 🔴 og:image inexistente, texto interno en gran formato, unificar el nombre de marca.
3. 🟢 Titles y H1 con "Maipú". Párrafo de entidad en la home.
4. 🟢 Decidir el tema fotocopias e impresiones. Si aplica, crear la página y sumar la categoría en el Perfil de Empresa.
5. 🟢 Pasada de copy (sección 4). Usted la hace a mano y yo puedo preparar una propuesta completa de reemplazo por página si lo desea.
6. 🟡 JSON-LD `Service` + `BreadcrumbList` + FAQ en cada servicio. `lastmod` en el sitemap.
7. 🟡 Plan de reseñas y Perfil de Empresa (es lo que más mueve el Local Pack).

## 7. Verificación manual requerida

- ¿Se hacen fotocopias e impresiones sueltas al público?
- El nombre oficial exacto: ¿Multigraff o Multigraf?
- Plazo real de respuesta a presupuestos.
- Equipamiento real (offset, digital, gran formato: ecosolvente, látex) y acabados reales (barniz UV, laminado, stamping, relieve, troquel).
- Envíos: zonas y condiciones.
- Coordenadas exactas del local (el JSON-LD tiene −32.9440, −68.8605; verificar en Maps).
- URLs de las redes sociales para `sameAs`.
- Reseñas: cantidad y nota actuales en Google (el sitio dice 17 / 4,1; hay que mantenerlo sincronizado).
- Nota: usted mencionó "multigraph.com", pero el dominio configurado en el repo es **multigraff.com**.

## 8. Cómo medirlo

Línea de base hoy y re-medición a 4 y 8 semanas:
- Search Console: impresiones, clics y posición para "imprenta maipú", "fotocopias maipú", "impresiones maipú", "etiquetas autoadhesivas mendoza" y "sellos de goma maipú". Revisar también en Cobertura que las páginas de servicio pasen a "indexadas".
- Perfil de Empresa: llamadas, clics a "cómo llegar" y clics al sitio.
- GA4: clics a WhatsApp por página (el tracking ya está implementado).
- IA: preguntar a ChatGPT, Gemini, Perplexity y Claude "¿qué imprenta me recomendás en Maipú, Mendoza?" y "¿dónde hago fotocopias en Maipú?", y anotar si aparece Multigraff y con qué datos.
