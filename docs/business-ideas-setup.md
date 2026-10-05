# Business ideas: activación y operación

Implementación en la rama `feat/business-ideas-tool`. Solo la sección 02 cambia de comportamiento; no se define el diseño final de la landing.

## Qué funciona

- Cinco objetivos con respuestas instantáneas controladas por Benjamin, sin IA.
- Dominios sin protocolo y websites públicos. Sin website, se puede continuar solo con una descripción breve del negocio.
- Una página HTML pública y hasta dos páginas relevantes del mismo origen, sin ejecutar scripts, usar cookies ni iniciar sesión. Máximo 6000 caracteres de contexto y 12 segundos para la lectura combinada; secundarias en paralelo y redirects restringidos al mismo origen.
- Para páginas inaccesibles o negocios sin web: una frase del dueño; no se leen perfiles, ratings ni reviews de Google/Instagram.
- Una llamada de IA con exactamente tres oportunidades, tres áreas distintas y títulos distintos, dentro del catálogo aprobado.
- Evidencia comprobada mediante citas del texto leído o de la descripción, o posibilidades explícitas sin aparentar hallazgos.
- WhatsApp con objetivo, enlace, descripción y resumen; abre un mensaje preparado, nunca lo envía automáticamente.
- Carga, cancelación, errores recuperables, invalidación de resultados al cambiar inputs y foco accesible.

## Activación local

Decisión confirmada el 5 de octubre: **OpenAI + contexto propio**, sin Gemini ni contenido Places en la IA. El formulario pide website o descripción; no promete búsqueda por nombre. La clave Google aportada por el usuario se guardó solo como `GOOGLE_PLACES_API_KEY` en `.env.local`, con permisos 600 e ignorada por Git. Este recorrido no usa esa variable ni hace llamadas a Google. Places sigue inhabilitada. Ver [estado Google Cloud](./google-cloud-setup.md).

Copiar `.env.example` a `.env.local` y configurar:

```dotenv
WHATSAPP_NUMBER=61409871882
BUSINESS_IDEAS_ENABLED=true
OPENAI_API_KEY=clave_real_de_openai
BUSINESS_IDEAS_MODEL=gpt-6-luna
```

El número real de Benjamin (`+61 409 871 882`) ya es el valor por defecto, incluso sin archivo local. La variable permite reemplazarlo. Admite `+`, espacios y guiones; se normaliza para `wa.me`. No usar cero nacional inicial. La clave se coloca en el archivo local o en Vercel, no en el chat ni en Git. Ningún secreto lleva `NEXT_PUBLIC_`. `.env.local` está ignorado por Git: no añadirlo con `git add -f`.

La integración usa **OpenAI directamente**, mediante Responses API; requiere `OPENAI_API_KEY`, no una clave de AI Gateway ni IDs con el prefijo `openai/`. La suscripción de ChatGPT tampoco configura credenciales ni créditos para esta API. Usar una clave de proyecto con permisos mínimos necesarios y revisar facturación/límites en OpenAI antes de activar.

Ejecutar `npm run dev`. La disponibilidad se comprueba en el servidor. El número es público por definición; solo ese número y un booleano de disponibilidad cruzan al componente cliente, nunca la configuración completa.

En desarrollo local se permiten diez solicitudes por diez minutos para todo el proceso. Ese contador no se utiliza como protección de producción. Cambiar la configuración requiere reiniciar desarrollo y reconstruir la portada estática en producción.

## Protección de producción en Vercel

Mantener `BUSINESS_IDEAS_ENABLED=false` hasta completar la configuración y las pruebas en preview. Crear dos reglas de tipo `@vercel/firewall`, con estos Rate limit IDs:

| Variable / ID | Bucket | Límite inicial conservador |
| --- | --- | --- |
| `BUSINESS_IDEAS_IP_RULE=business-ideas-ip` | IP de la solicitud, determinada por Vercel | 5 solicitudes / 600 segundos |
| `BUSINESS_IDEAS_GLOBAL_RULE=business-ideas-global` | Clave compartida `business-ideas-budget` | 100 solicitudes / 3600 segundos |

Los números son una propuesta inicial, no reglas ya creadas. Revisar disponibilidad/coste según el plan y ajustar con tráfico real. No añadir condiciones que excluyan invocaciones del SDK. Revisar los cambios y publicar las reglas en Vercel. En preview configurar Protection Bypass for Automation y System Environment Variables conforme a la documentación oficial.

Las variables `VERCEL` y `VERCEL_URL` son las variables de sistema de Vercel; no simularlas para activar producción fuera de Vercel. La aplicación rechaza generación si falta configuración, si no existen las reglas o si falla el comprobador. No se apoya en contadores en memoria en producción. Los contadores del WAF son por región: el bucket compartido no constituye un límite económico absoluto entre regiones. Añadir límites de gasto/créditos en el proveedor y revisar consumo antes de abrir públicamente.

Primero probar las reglas en preview y revisar que no bloquean visitas legítimas. La API solo usa límites después de validar solicitudes pequeñas y antes de leer páginas o llamar a IA. Origin se comprueba para evitar posts desde otras webs, pero no sustituye los límites ni es autenticación: un cliente automatizado puede fabricar cabeceras.

La portada puede seguir mostrando el formulario aun si una regla deja de existir después del build; la API falla de forma segura y ofrece un error recuperable. `BUSINESS_IDEAS_ENABLED` es el interruptor de apagado del endpoint. Reconstruir para actualizar también el estado visible del formulario.

## Límites y seguridad

- Body entrante: 8 KiB; enlace: 2048 caracteres; descripción: 600.
- Solo HTTP/HTTPS y puertos estándar. Sin credenciales ni destinos IP literales.
- DNS con todas las direcciones verificadas; IP pública fijada en la conexión real para evitar DNS rebinding. Cada redirect se vuelve a validar.
- Hasta tres redirects; 8 segundos para la lectura; 512 KiB de HTML; 6000 caracteres de texto.
- No descomprimir contenido ni leer PDF/JSON/imágenes. No intentar eludir bloqueos, CAPTCHAs o login.
- El modelo recibe datos no confiables separados de instrucciones, sin herramientas de navegación o ejecución.
- Una generación, razonamiento desactivado (`reasoning: "none"`), cero reintentos automáticos, salida máxima de 1600 tokens; plazo total de 45 segundos; función Node de 60 segundos.
- Responses usa `store: false` y `serviceTier: "default"`; no se solicita Fast/Flex, ni historial/conversaciones. Desactivar el almacenamiento de Responses no equivale a Zero Data Retention: las políticas del proveedor siguen aplicándose.
- Respuestas `no-store`; texto escapado por React; sin HTML generado ejecutable.
- No base de datos, almacenamiento de leads, caché compartida de entradas ni logs de páginas, descripciones o claves.
- El texto enviado se procesa por proveedores externos; revisar sus políticas de privacidad/retención antes del lanzamiento. La UI informa del envío y pide evitar información sensible.

## Pruebas y evaluación

### Verificación de la opción elegida — 5 de octubre

- Lint, TypeScript, 38 pruebas y build correctos. Se mantiene la homepage estática.
- En navegador, un envío sin website ni descripción devolvió `needs-context` y abrió el campo de descripción, sin generar.
- Un segundo envío, con una barbería hipotética identificada explícitamente como prueba de desarrollo y sin website, utilizó OpenAI real y devolvió exactamente tres ideas válidas. La UI aclara que solo usó la descripción y enfoca el título del resultado. WhatsApp conserva negocio, objetivo, contexto e ideas y no añade un enlace inexistente. No se envió ningún mensaje.
- Escaneo de 85 archivos de fuente, documentación y chunks de navegador: ninguna de las dos credenciales configuradas apareció. `.env.local` sigue ignorado por Git y con permisos 600.
- Chrome registró una advertencia de hidratación por el atributo `cz-shortcut-listen` insertado por una extensión en el `body`. No se añadió `suppressHydrationWarning` ni se alteró el código de la aplicación para ocultarla. No hubo error de generación ni de renderizado del resultado.
- Google permanece fuera del recorrido. No se validó su nueva clave ni se habilitó Places. Tampoco se configura Vercel Firewall por ejecutar el flujo local.

### Modelo y eficiencia

El punto de partida es `gpt-6-luna`: la documentación lo sitúa en tareas acotadas de alto volumen y soporta salidas estructuradas y razonamiento desactivado. Documentación verificada el 4 de octubre de 2026. [Modelo oficial](https://developers.openai.com/api/docs/models/gpt-6-luna).

El precio estándar verificado es US$0,10 por millón de tokens de entrada y US$0,50 de salida, antes de infraestructura u otros cargos. Ejemplo orientativo: 3000 tokens de entrada + 800 de salida ≈ US$0,0007; no es una medición de esta aplicación ni un precio fijo por consulta. [Precios oficiales](https://developers.openai.com/api/docs/pricing).

La capa instantánea no usa IA; la personalizada envía texto, no HTML completo, imágenes ni todo el sitio. Solo incluye el catálogo correspondiente al objetivo (todo el catálogo para `not-sure`). Las instrucciones y el catálogo estable preceden los datos variables; no se promete un hit de caché ni se almacena información de distintos usuarios. La validación de citas usa exactamente el extracto enviado al modelo.

No se usa una segunda llamada para resumir, corregir resultados o escalar automáticamente a un modelo más caro. Un resultado inválido permite ir directamente a WhatsApp o reintentar conscientemente. Para cambiar el modelo, comprobar primero que soporta salidas estructuradas y `reasoning: "none"`: no todos los modelos admiten esa configuración. Evaluar relevancia, evidencia y cumplimiento de las tres áreas con los cinco objetivos antes de activar públicamente; si Luna no alcanza, comparar un modelo superior antes de elegirlo.

```bash
npm run check
npm run build
```

Los tests cubren el pipeline real de AI SDK con `MockLanguageModelV4`, los cinco mapas, validación del contrato y evidencias, nombres inventados, áreas/títulos repetidos, SSRF/DNS/redirects, límites del transporte, errores de proveedor, cancelación, rate limiting y mensajes de WhatsApp. Los mocks viven solo en tests; no existe un modo de demo o una API de fixtures en producción.

Verificación local realizada el 4 de octubre de 2026:

- Lint y TypeScript sin errores; 30 tests aprobados; build de producción aprobada con OpenAI directo.
- `/` prerenderizada estáticamente; `/api/business-ideas` ejecutada bajo demanda.
- Lectura HTTPS real de `example.com` mediante DNS/IP fijada: 577 bytes obtenidos.
- Navegador → API real: Instagram sin descripción devuelve `422 needs-context` y despliega el campo de contexto.
- Respuesta → UI: fixture temporal devuelve tres ideas y enfoca el título; WhatsApp contiene objetivo, enlace, contexto e ideas. No se envió el mensaje.
- Cambio de objetivo cancela y descarta la respuesta anterior; inputs se conservan; teclado y error recuperable 429 comprobados.
- Móvil de 375 px y escritorio de 1280 px sin overflow horizontal; consola sin errores ni warnings en las verificaciones.
- Endpoint de producción sin credenciales devuelve `503 unavailable`; no genera datos simulados.
- Ajuste final a OpenAI directo: adaptador Responses comprobado con transporte simulado exclusivamente en test; envía `gpt-6-luna`, `reasoning.effort=none`, `store=false`, tier estándar, JSON Schema estricto, sin herramientas y 1600 tokens máximos. Este test no realiza llamadas pagas ni valida por sí solo la calidad de un modelo real.
- WhatsApp final verificado en navegador: destino `wa.me/61409871882`, objetivo y enlace conservados; ningún mensaje enviado. Aviso de privacidad indica OpenAI; generación apagada sin clave; consola sin errores/warnings.
- Activación local posterior con credencial configurada: OpenAI confirmó acceso al modelo (HTTP 200). Un envío real desde el navegador, para una barbería hipotética descrita como caso de desarrollo, devolvió HTTP 200 en 5,7 segundos y tres ideas válidas en conversión, presencia local y retención. El resultado informa que solo usó la descripción; WhatsApp conserva negocio, objetivo, enlace, contexto e ideas. No se leyó el perfil ficticio ni se envió un mensaje.
- Clave mantenida únicamente en `.env.local`, fuera de Git y con permisos de lectura/escritura solo del dueño. Escaneo de 46 archivos de navegador (build/dev) y archivos versionados: ningún contenido de la clave encontrado. La activación local no configura ni sustituye las reglas de producción. Reemplazar cualquier clave compartida en chats/comentarios antes de publicar.
- Chunk de la herramienta: aproximadamente 5,1 KB gzip, sin contar el runtime compartido de React/Next. No incluye claves, catálogo privado, SDK de IA ni código del firewall.
- `npm audit --omit=dev`: cero vulnerabilidades. El audit completo mantiene cinco avisos high en la cadena de lint (`braces`/`micromatch`/`fast-glob`/ESLint de Next). La corrección automática propuesta degrada `eslint-config-next` a 14.2.35 y no es compatible con este proyecto Next 16; no se aplicó un downgrade destructivo. Revisar una corrección compatible upstream antes de actualizar esas herramientas.

La verificación de navegador prueba objetivos, teclado, enlaces conservados, contexto real solicitado por el endpoint para Instagram, carga, foco de resultados/errores, resultados y errores simulados temporalmente en el navegador, y cancelación de resultados antiguos. No se envían mensajes de WhatsApp ni se llama a un proveedor real sin credenciales.

Antes de publicar, con la clave real, probar al menos una barbería, un centro de buceo, e-commerce, un negocio sin web y una idea de aplicación, además de páginas con instrucciones maliciosas. Evaluar si las propuestas tienen sentido comercial, son condicionales donde corresponde, no inventan datos y tardan/cuestan lo esperado. Los tests del contrato no demuestran por sí solos la calidad de un modelo real ni garantizan inmunidad a prompt injection; el alcance sin herramientas limita el impacto y la revisión humana sigue siendo necesaria.

## Archivos principales

- `src/components/business-ideas/`: formulario interactivo y vista de resultados.
- `src/data/business-goals.ts`: primera capa instantánea, compartida con el servidor.
- `src/data/service-catalog.ts`: catálogo privado de servidor para generación.
- `src/app/api/business-ideas/route.ts`: endpoint Node, sin caché.
- `src/lib/business-ideas/`: validación, conexión pública segura, contexto, generación, límites, configuración y WhatsApp.
- `tests/`: pruebas deterministas sin consumo de IA.

## Referencias

- [AI SDK: salida estructurada](https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data).
- [AI SDK: proveedores simulados para tests](https://ai-sdk.dev/docs/ai-sdk-core/testing).
- [Vercel Firewall: Rate Limiting SDK](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk).
- [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components).
