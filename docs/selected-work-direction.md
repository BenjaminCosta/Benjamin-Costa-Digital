# Selected work — dirección y materiales

Revisión: 6 de octubre de 2026. Rama: `codex/selected-work-direction`.

La sección aprobada ya está implementada localmente en esta rama; el sitio publicado no se modificó. La herramienta de business ideas, dependencias, fuentes globales y configuración de producción permanecen sin cambios. Las notas de exploración siguientes se conservan como historial.

## Implementación aprobada — un solo proyecto visible

- Desktop y mobile: **exactamente un proyecto visible**, sin vista parcial de Kirra ni del siguiente trabajo. Flechas circulares, swipe horizontal, teclado (flechas/Home/End) e isotipos sincronizados con ficha y contador real de siete.
- Salida breve, intercambio y entrada con opacidad/desplazamiento. Nunca se superponen dos proyectos; no hay autoplay. La preferencia de movimiento reducido desactiva la transición. El proyecto actual permanece mientras carga el solicitado; errores mantienen la ficha actual.
- Contenido, logos y siete fichas renderizados en servidor; controlador cliente pequeño. Imágenes con dimensiones/reserva de espacio, `next/image` y carga diferida, adelantada solo ante intención de navegar. Sin librería nueva de slider o animación.
- Mockups WebP de 112–158 KB cada uno y fondo de 39 KB. Imágenes generadas con la herramienta integrada, no con las claves de la web; pantallas ilustrativas, no composiciones pixel-perfect. Capturas auténticas enlazadas por separado y PNG maestros preservados. Prompts: `assets/selected-work/concepts/carousel-prompts.md`.
- Wordmarks originales donde son utilizables; StockIA y A1 mantienen isotipo y nombre legible. Isotipos copiados sin alterar. No se reparó ninguna marca con IA.
- “Visit website” solo para Mr Moustache. Los otros seis usan “View preview” con su captura auténtica hasta confirmar la URL exacta. Custom Operations Platform se conserva en `pendingWorkProjects`; no se confundió con StockIA.
- Datos: `src/data/selected-work.ts`. Componentes: `selected-work-section.tsx`, `work-project.tsx`, `work-showcase.tsx`. Estilos aislados: `selected-work.css`. Navegación testeable: `src/lib/work-navigation.ts`.

### Verificación de la implementación

- Lint, TypeScript, 45 tests y build de producción pasan. La homepage sigue siendo estática; el endpoint de business ideas no se modificó.
- Navegador: los siete proyectos, flechas desktop/mobile, selección por isotipos, swipe horizontal, Home/End y navegación circular comprobados. En cada cambio hay una sola ficha visible; las otras son `hidden` e `inert`.
- Revisados 320, 390, 768 y 1024 px, además del viewport desktop habitual. Sin desborde horizontal. Movimiento reducido probado mediante emulación temporal y restablecido después.
- Se corrigió la capa de las flechas mobile tras detectar que la ficha interceptaba sus clics. Capturas finales: `assets/selected-work/concepts/carousel-mobile-final.png` y `carousel-desktop-final.png`.
- Los cinco wordmarks se sirven en WebP sin pérdida; sus PNG originales no se alteraron. Los isotipos originales se procesan por `next/image` a tamaño de uso. No se añadieron dependencias.
- La consola de desarrollo de Chrome mostró únicamente una diferencia de atributo `cz-shortcut-listen` inyectado por una extensión en `<body>`, ajena al código de la sección; no se ocultó la advertencia con `suppressHydrationWarning`.
- Versión de producción local comprobada en `http://127.0.0.1:3001/#work`: flechas mobile/desktop operativas, imágenes y logos cargados; cero errores o advertencias de consola registrados para este origen.
- Sin llamadas pagas de IA ni cambios de secretos, configuración de Vercel, git remoto o sitio publicado durante esta implementación.

## Material disponible

El ZIP contiene **28 capturas de 7 proyectos**: homepage y segunda sección, ambas en desktop y mobile. Se conservaron sin modificaciones en `assets/selected-work/source-captures/{desktop,mobile}/`. Los números y nombres de archivo originales se mantienen.

Los logotipos están realmente en `public/images/logos/`, no en `public/logos/`. Hay seis marcas y dos variantes de Kirra Dive. No hay un archivo separado de StockIA.

La sección anterior tenía tres fichas sin imágenes ni enlaces y un contador previsto de ocho. Custom Operations Platform no tiene material en este ZIP: se conserva pendiente y hay que confirmar si se incluirá además de los siete.

## Dirección propuesta

**Las webs son el contenido; el vidrio es el marco.**

- Fondo neutro cálido, aire, luz natural y una sola superficie de acrílico por composición. Mantener el sistema tipográfico del sitio; la referencia no obliga a cambiar fuentes globales.
- Laptop y teléfono con capturas reales, sin rediseñar las interfaces ni repetir el teléfono exterior que en la referencia contiene toda la sección.
- Perspectiva leve; pantallas grandes y sin reflejos encima de titulares o botones. El efecto glass debe estar en bordes, soporte y sombras, no en un filtro sobre las webs.
- Nombres, rubro, servicios, descripción, contador y CTA en HTML, **nunca horneados dentro de la imagen**.
- Misma escala aproximada y luz entre proyectos. Cambiar el carácter mediante la web real: negro/turquesa, océano, arquitectura, producto, catálogo, mobiliario y rojo editorial.
- Una imagen protagonista por proyecto. Segunda captura como detalle opcional, no una segunda imagen pesada obligatoria en cada slide.

### Layout inicial de exploración — reemplazado por la implementación aprobada

La idea inicial de dejar asomar el siguiente fue descartada por Benjamin. La versión implementada mantiene título y ficha a la izquierda y mockup grande a la derecha en desktop; en mobile: título → visual → ficha → enlace y controles. Siempre un solo proyecto. Contador basado en los siete trabajos disponibles.

La lámina `assets/selected-work/preview.html` muestra una composición de revisión con los siete, no el layout final del carrusel. En la revisión v2, las dos primeras fichas usan imágenes generadas claramente identificadas como conceptos; las otras cinco mantienen los PNG originales en marcos CSS. Todas enlazan las capturas originales. Los mockups de Mr Moustache y Kirra Dive son **conceptos de iluminación/materiales**, no capturas documentales ni assets aprobados para producción.

### Verificación de esta exploración

- 28 archivos copiados: hashes coinciden con los originales extraídos del ZIP.
- 30 referencias locales de la lámina resueltas; cero scripts o dependencias nuevas.
- Revisión en navegador desktop y mobile de 390 px; sin overflow horizontal ni errores de consola detectados. Navegación entre las siete fichas comprobada.
- Lint y typecheck del repositorio comprobados por separado. No se modificaron archivos de la app ni se ejecutó un despliegue.

## Inventario y borradores de copy

Los textos siguientes son propuestas editoriales. Las etiquetas de servicios, salvo lo ya documentado en `src/data/site-content.ts`, necesitan confirmación de Benjamin: ver una función en una web no demuestra quién la implementó ni si está funcionando. No trasladar estadísticas de marketing del cliente al portfolio como resultados propios.

| Proyecto / archivo base | Negocio y contexto comprobable | Copy propuesto en inglés | Enlace / estado |
| --- | --- | --- | --- |
| Mr Moustache / `01-mr-moustache` | Barbería; Surfers Paradise y Broadbeach, Gold Coast. El sitio enlaza reservas Square por local. Website / Bookings / Automations ya figura en el repositorio. | **Two shops, one digital experience.** A website connecting both locations with a clearer path to booking. | [moustachebarbersgc.com](https://moustachebarbersgc.com/) responde 200 y coincide con la captura. Se puede preparar “Visit website”. Las automatizaciones provienen del contexto del proyecto, no de una comprobación de sus sistemas internos. |
| Kirra Dive / `02-kirra-dive` | Centro de buceo en Tweed Heads. La captura es una landing de PADI Open Water, no toda la plataforma pública actual. Website / Booking platform ya está en el repositorio. | **From the first question to the first dive.** A focused course experience with a clearer path to booking. | [kirradive.com](https://kirradive.com/) identifica al negocio, pero el HTML actual usa otra versión. **Pedir la URL de esta landing** antes de vincular el mockup. |
| Santos & Becker / `03-santos-becker` | Firma de consultoría migratoria y movilidad global en México; **no es una clínica**. La captura incluye servicios, idiomas y un asistente. | **A clearer digital presence for a global practice.** An editorial website bringing services, expertise and enquiries together. | [santosbecker.com](https://www.santosbecker.com/) es el dominio de la firma; la respuesta directa actual no coincide claramente con la nueva captura. Confirmar despliegue exacto. Website / Multilingual UX son etiquetas propuestas; no atribuir un backend de IA por ver el widget. |
| Agendify / `04-agendify` | Producto de agenda y reservas. Capturas: landing de producto, reservas y recordatorios; el contenido indexado de `agendify.pro` coincide con el titular. | **Bookings, without the back-and-forth.** A product experience for scheduling and customer communication. | [agendify.pro](https://agendify.pro/) responde 200; confirmar versión actual y alcance entregado. No usar “+45%”, “500 negocios” o “ROI en 14 días” como resultados comprobados. Website / Booking product / Automation son etiquetas propuestas. |
| StockIA / `05-stockia` | La captura muestra un marketplace mayorista para comercios: categorías, pedidos, distribuidores y área San José, Entre Ríos. Hay datos marcados como demo. | **Wholesale ordering, in one place.** A commerce experience connecting product discovery, repeat orders and suppliers. | **URL pendiente.** `stock-ia.com` aparece en búsquedas, pero describe otro software y no acredita identidad con esta captura; `stockia-tienda.com` es otra tienda distinta. No enlazar ninguno por coincidencia de nombre. E-commerce / Custom platform son propuestas. |
| Decoratre / `06-decoratre` | Muebles artesanales; catálogo, taller, carrito y fotografía editorial en las capturas. | **Craftsmanship, translated into a digital storefront.** An editorial shopping experience built around the products and their story. | `decoratre.com` respondió **404** durante esta revisión. [Agendify Design](https://design.agendify.pro/) menciona un proyecto Decoratre en Shopify; no alcanza para acreditar dominio, ubicación ni checkout de esta versión. Pedir link de tienda/preview y confirmar alcance. |
| A1 Estudio / `07-a1-estudio` | Dirección gastronómica, desarrollo de conceptos y operaciones; Buenos Aires figura en la captura. No confundir con estudios de arquitectura o grabación homónimos. | **A bold digital presence for food direction.** An editorial website for a studio working across concept, kitchens and operations. | **URL pendiente.** No apareció una coincidencia fiable con esta identidad. Website / Editorial design son etiquetas propuestas. |

## Art direction por proyecto

| Proyecto | Visual principal | Detalle secundario útil |
| --- | --- | --- |
| Mr Moustache | Laptop + teléfono; claro cálido, negro y turquesa de las pantallas. | Las dos ubicaciones y el listado de servicios/reservas. |
| Kirra Dive | Mismo sistema de dispositivos; la fotografía submarina aporta color. No añadir peces o agua artificial fuera de la web. | Recorrido del curso, teoría → piscina → mar. |
| Santos & Becker | Laptop casi frontal; vidrio arquitectónico muy discreto. | “Quiénes somos” y fotografía de aeropuerto, no el widget como promesa central. |
| Agendify | Ventana de producto o laptop + mobile; acento verde ya presente. | Reservas/recordatorios. Para un caso de producto completo, pedir captura real de la app con datos demo aprobados. |
| StockIA | Desktop de marketplace + teléfono mostrando compra por categorías. | Flujo de pedido; evitar destacar cards sin fotos como si fueran catálogo terminado. |
| Decoratre | Pantalla grande y marco mínimo; dejar respirar fotografía y serif propia de la marca. | Taller, tejidos y productos. No generar otros muebles ni cambiar modelos. |
| A1 Estudio | Marco muy limpio; aprovechar negro, blanco y rojo de la web. | Segunda sección roja como contraste editorial. Sin props gastronómicos añadidos. |

## Calidad de logos y capturas

- Los PNG de wordmarks muestran contornos erosionados, perforaciones y residuos de extracción; A1 tiene una gran zona residual. El nombre “HQ” no garantiza calidad visual.
- Kirra `...hq.png` conserva un rectángulo azul y no equivale al logo completo con emblema de las capturas. `...real.png` también tiene contornos deteriorados.
- Mr Moustache: el wordmark separado no es el emblema circular de la web. Decoratre: el texto separado tampoco es el monograma completo de la captura.
- **No reparar o reinterpretar marcas con IA.** Pedir originales SVG/PNG bien exportados. La nueva solicitud del usuario incorpora los wordmarks disponibles en la lámina de revisión para evaluar personalización; eso no los convierte en exports aprobados para producción.
- StockIA: falta original de marca; segunda captura con productos demo y placeholders. Agendify: las cifras comerciales necesitan pruebas antes de convertirse en resultados de portfolio.
- Para exportar finales, recapturar sin cursor, scrollbar ni widgets flotantes si molestan. No borrar esas cosas alterando lo que el proyecto realmente hace.

## Producción y performance

1. Confirmar lista final, enlaces exactos, alcance de Benjamin y logos originales. Separar “Visit website” de “View case study”; no simular un case study inexistente.
2. Aprobar una composición principal y su variante mobile. Si IA altera tipografía/logo/UI, descartarla como asset final y usar capturas originales en marcos HTML/CSS o una composición de exportación con pantallas colocadas de forma exacta.
3. Preparar media final versionada: referencia 3:2 desktop, 4:5 mobile si el recorte no preserva ambos dispositivos. No cargar ambos formatos a la vez.
4. Exportar WebP/AVIF con legibilidad revisada. Objetivos de peso, **no mediciones actuales**: 150–250 KB mobile y 250–400 KB desktop; ajustar si texto y fotografías sufren.
5. Reutilizar `next/image` con dimensiones/aspect-ratio y `sizes` correctos. Lazy loading debajo del hero, sin preload indiscriminado del carrusel ni importaciones de los 28 PNG fuente.
6. Mantener datos/sección estáticos como Server Components y aislar en cliente solamente swipe/contador/flechas cuando corresponda. No agregar una librería de animación o slider para este efecto.
7. Glass con un borde fino, sombra y superficies estáticas; evitar grandes `backdrop-filter` animados, video, canvas, WebGL o parallax obligatorio.
8. Links reales, foco visible, botones de al menos 44 px, sin autoplay, teclado, reduced-motion, texto legible fuera de las imágenes. Verificar selección sincronizada al cambiar slide, resize y mobile.
9. Antes de publicar: lint, tipos, tests, build, verificación mobile/desktop, rutas de imágenes, enlaces, consola, estabilidad visual y medición de performance. No prometer un score sin medir.

## Fuentes y límites de la investigación

Capturas y logos aportados por el usuario; datos existentes del repositorio; consulta de páginas oficiales y respuestas HTTP el 6 de octubre de 2026. Las capturas son la referencia visual primaria cuando la web pública muestra otra versión.

- [Mr Moustache](https://moustachebarbersgc.com/): dos locales y enlaces Square.
- [Kirra Dive](https://kirradive.com/) y [ficha PADI](https://www.padi.com/dive-center/australia/kirra-dive-on-the-tweed/): identidad y ubicación del negocio, no prueba del despliegue de la landing nueva.
- [Santos & Becker](https://www.santosbecker.com/): firma migratoria mexicana. Resultados de búsqueda y respuesta directa no son plenamente consistentes; confirmar versión antes de enlazar.
- [Agendify](https://agendify.pro/): producto y copy indexado; métricas no verificadas independientemente.
- [Agendify Design](https://design.agendify.pro/): referencia pública del proyecto Decoratre, no confirmación del link de la tienda de las capturas.

No se investigaron sistemas privados ni se accedió a cuentas de clientes. No se inventaron resultados, tecnologías de backend, enlaces, reseñas ni equivalencias entre proyectos.

## Revisión v2 — logotipos, isotipos y mockups

Se incorporaron copias sin modificar de las dos carpetas indicadas por Benjamin:

- `/Users/benjacosta/Documents/Benjamin Costa Digital/public/images/logos`
- `/Users/benjacosta/Documents/Benjamin Costa Digital/public/images/isotipos`

Los wordmarks son idénticos a los ya presentes en el repositorio. Cinco títulos utilizan los PNG originales dentro de un SVG con viewBox ajustado al contenido, en monocromo para contraste sobre fondo claro. No se reemplaza su tipografía por una fuente similar ni se regeneran letras. StockIA no tiene wordmark separado; A1 tiene un export dañado: ambas fichas usan isotipo + nombre accesible en HTML. Kirra usa la variante `real`, no el export con rectángulo azul.

Los siete isotipos se prueban como selector horizontal con enlaces a fichas, scroll nativo y foco visible. No es todavía un carrusel de proyectos sincronizado: es una prueba de navegación visual, sin scripts, autoplay o dependencias nuevas. El blanco de Mr Moustache conserva contraste sobre una placa oscura; A1 conserva su fondo fotográfico original y Santos & Becker su fondo blanco. Para producción, pedir un isotipo limpio y plano de A1.

Mr Moustache y Kirra Dive tienen dos nuevos mockups v2: laptop en perspectiva, teléfono en primer plano, sombras de palmeras, luz cálida, superficie de piedra y vidrio grueso biselado. Las marcas de los títulos siguen siendo archivos originales separados. El generador puede cambiar detalles de pantallas —por ejemplo, espaciados y proporciones—, por lo que las imágenes no se aprueban como evidencia exacta ni media final. Se preservan v1, todos los screenshots originales y los prompts completos en `assets/selected-work/concepts/prompts-v2.md`.

En móvil, el visual aparece antes de la ficha. Esta revisión permanece en `codex/selected-work-direction`, sin cambios en la app, AI tool, producción, secretos o carpetas de origen.

Verificación v2: 42 referencias locales resueltas, 14 archivos de marca idénticos a las carpetas originales, cero scripts. Navegación de las siete fichas comprobada en móvil de 390 px; sin overflow de página ni errores/warnings de consola detectados. El overflow horizontal del selector es intencional y queda contenido en la tira. Capturas de revisión: `preview-brands-desktop.png`, `preview-brands-mobile.png` y `preview-isotipos-mobile.png`, dentro de `assets/selected-work/concepts/`. No se hizo un build de producción porque esta revisión solo cambia assets y la lámina estática fuera de la app.
