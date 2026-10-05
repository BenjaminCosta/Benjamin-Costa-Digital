# Business discovery: siguiente iteración

Decisión posterior del usuario: **OpenAI + contexto propio**. Implementación actual: website opcional, hasta tres páginas públicas independientes o descripción del dueño; tres oportunidades y WhatsApp. Se quitó Instagram del formulario. Sin web ni descripción suficiente, se solicita una frase antes de generar. La clave Google autorizada está guardada únicamente en el entorno local de servidor, pero no se usa: Places sigue deshabilitada y no hay búsqueda por nombre en esta versión. El plan Google de abajo queda como referencia futura, no como función operativa ni bloqueo de la versión elegida.

Estado: implementación parcial, no integración Google operativa. Revisión: 5 de octubre de 2026. Facturación vinculada a `benjamin-costa-digital`; Places inhabilitada preventivamente hasta rotar la credencial que mostró el asistente. La lectura web de hasta tres páginas ya está implementada. Ver [estado de configuración](./google-cloud-setup.md).
Rama existente: `feat/business-ideas-tool`. Sin cambios de diseño ni proveedor de IA.

## Experiencia propuesta

1. Mantener los cinco objetivos y sus respuestas preparadas, sin consultas externas.
2. Mostrar un único campo: **Find your business**, placeholder **Business name or website**, CTA **Find opportunities →**. Quitar Instagram del recorrido.
3. Resolver el negocio al enviar, nunca por cada tecla. Si hay varios candidatos razonables, pedir una selección breve con nombre y ubicación; no elegir silenciosamente el primero.
4. Obtener contexto público permitido. Leer homepage y hasta dos páginas relevantes del mismo sitio: servicios, booking/contact o about.
5. Generar exactamente tres oportunidades dentro del catálogo aprobado. Distinguir evidencia de hipótesis; no ofrecer puntuaciones SEO ni afirmar procesos internos que no podemos observar.
6. Abrir WhatsApp con negocio, objetivo, enlace y resumen de ideas. Mantener contacto directo cuando la búsqueda o la generación fallen.

Solo si falta contexto, pedir: **Tell me in one sentence what your business does.** Para `not-sure`, elegir tres áreas distintas del catálogo completo.

## Decisión previa: Google y generación de IA

Places API (New) es adecuada para buscar negocios públicos; Business Profile API no es el servicio de descubrimiento de perfiles ajenos. Sin embargo, no debemos asumir que un payload de Places se puede enviar a OpenAI y transformar en recomendaciones: hay restricciones contractuales sobre contenido derivado, almacenamiento y uso con IA.

Google ofrece **Maps Grounding Lite**, con permiso específico para grounding de LLMs y requisitos de atribución. Antes de integrarlo hay que verificar el acuerdo aplicable y que el proveedor/modelo no almacene, cachee ni utilice el contenido de Google para mejorar modelos. En OpenAI, `store: false` no elimina por sí solo la retención de logs de abuso; no equivale a Zero Data Retention.

Dos rutas a evaluar, sin aprobar ninguna automáticamente:

- Places para búsqueda/selección y visualización atribuida; IA basada únicamente en contenido independiente de la web y descripción del usuario. Confirmar también el uso permitido de enlaces y datos de descubrimiento.
- Grounding Lite para incorporar contexto Google a la generación, solo tras verificar compatibilidad de retención, caché, términos y presentación de fuentes. No cambiar el proveedor ni el modelo sin acordarlo.

El usuario autorizó quitar facturación de dos proyectos específicos y continuar. Esa desvinculación liberó la vinculación de “Mi cuenta de facturación” al proyecto nuevo. El asistente de Maps generó una clave automáticamente, se restringió a Places y no se guardó en la aplicación. Places permanece inhabilitada por seguridad; no se hicieron consultas. Se requiere rotación manual y decisión de proveedor. No modificar más proyectos existentes ni cambiar la IA sin autorización.

Una tercera vía para decidir con el usuario es **Gemini con Grounding with Google Maps**, la integración nativa de Google para respuestas con fuentes Maps. No equivale a mandar Places a OpenAI ni a Maps Grounding Lite. Revisar sus términos, retención, atribución, disponibilidad y coste antes de implementar; no se ha aprobado ni habilitado.

La vía nativa tampoco es un reemplazo transparente: sus términos requieren mostrar la respuesta generada con los enlaces Maps asociados, sin modificarla ni intercalar otro contenido. Google conserva prompts, contexto y respuestas del grounding durante 30 días. Por eso hay que verificar si el contrato de tres tarjetas puede conservarse y excluir datos/ideas derivados de Maps del mensaje a WhatsApp hasta confirmar el uso permitido. No asumir que basta con cambiar el nombre del modelo.

## Implementación por etapas

### 1. Contrato de descubrimiento

Cambiar el request de `link` obligatorio a entrada nombre/dominio, objetivo y descripción opcional. Separar estados tipados: necesita selección, necesita contexto, resultado y error. Mantener los identificadores y datos externos en servidor; validar cualquier selección recibida y no confiar en una web aportada por el cliente como resultado de Google.

### 2. Resolución del negocio

Crear un adaptador servidor para la fuente elegida, solo después de la decisión anterior. Nombre → candidatos → confirmación cuando corresponda → contexto permitido. Dominio → web → identidad y ubicación observadas → búsqueda opcional. Si no hay coincidencia fiable, continuar con la web sin atribuirle datos de otro negocio. Gold Coast será un sesgo de búsqueda explícito, no una restricción mundial.

### 3. Contexto web acotado

Extender el lector seguro existente: máximo tres páginas y un presupuesto combinado de texto/tiempo. Seleccionar enlaces determinísticamente; no ejecutar JavaScript, saltar bloqueos ni navegar arbitrariamente. Conservar validación DNS/IP y redirecciones en cada descarga. Una página secundaria fallida no debe invalidar una homepage útil.

Implementado: página inicial y hasta dos enlaces de servicios/booking/contact/about del mismo origen, 12 segundos para la lectura combinada y 6000 caracteres en total. Las secundarias se leen en paralelo y sus redirecciones no pueden salir del origen. Se muestran los enlaces realmente usados en el resultado; ninguna fuente Google se incluye. Cinco pruebas adicionales cubren selección, presupuestos, errores secundarios, redirecciones y cancelación.

### 4. Generación y fuentes

Mantener una única generación, salida validada y tres áreas distintas. Añadir procedencia por observación y fuentes presentadas según sus condiciones. Los textos externos son evidencia no confiable, nunca instrucciones. No afirmar que faltan reservas o automatizaciones porque no sean visibles. No trasladar datos de Google al prompt, logs, caché o WhatsApp sin verificar el uso permitido.

### 5. Costos, accesibilidad y verificación

Consultas solo al enviar/seleccionar, campos explícitos sin wildcard, sin reviews completas ni fotos de entrada, sin detalles de todos los candidatos ni reintentos automáticos. Configurar cuotas antes de publicar: una alerta de presupuesto no constituye un límite duro de gasto. Mantener límites compartidos de solicitudes y claves solo de servidor.

Probar nombres ambiguos, dominio sin protocolo, negocio sin web, sitio inaccesible, Google caído/sin configurar, resultado antiguo tras cambiar input, teclado/móvil y transferencia a WhatsApp. Ejecutar tests, lint, typecheck y build, y verificar el recorrido en navegador. Los fixtures no deben aparecer como análisis reales.

Verificación parcial realizada: lint, tipos, 36 tests y build de producción correctos. La prueba API incluye contexto de varias páginas y una única generación con proveedor simulado, no una consulta real. En navegador, la homepage y las cinco respuestas instantáneas cargan sin errores de consola; WhatsApp apunta a `61409871882`. Fuera de Vercel, la generación de producción permanece deshabilitada por los controles existentes. No se verificó ni implementó el recorrido Google → IA, ni se cambió aún el input a búsqueda por nombre.

## Fuentes oficiales

- [Places: Place Details](https://developers.google.com/maps/documentation/places/web-service/place-details)
- [Places: Text Search](https://developers.google.com/maps/documentation/places/web-service/text-search)
- [Google Maps: términos](https://cloud.google.com/maps-platform/terms), especialmente 3.2.3
- [Términos específicos](https://cloud.google.com/maps-platform/terms/maps-service-terms), sección 10
- [Maps Grounding Lite: compatibilidad y atribución](https://developers.google.com/maps/ai/grounding-lite)
- [Gemini: Grounding with Google Maps](https://ai.google.dev/gemini-api/docs/maps-grounding)
- [Gemini: términos de Grounding with Google Maps](https://ai.google.dev/gemini-api/terms)
- [Places: políticas](https://developers.google.com/maps/documentation/places/web-service/policies)
- [Precios Google Maps](https://developers.google.com/maps/billing-and-pricing/pricing)
- [OpenAI: controles de datos](https://developers.openai.com/api/docs/guides/your-data)
