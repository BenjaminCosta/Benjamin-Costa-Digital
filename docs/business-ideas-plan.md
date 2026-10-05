# Plan de la herramienta de oportunidades para negocios

La siguiente iteración (nombre o dominio, descubrimiento de negocio y contexto web ampliado) está documentada en [business-discovery-plan.md](./business-discovery-plan.md). Ese nuevo recorrido aún no está implementado; este archivo conserva el alcance de la versión anterior.

## Objetivo y alcance

La sección 02 ayudará al dueño de un negocio a reconocer un problema, ver posibilidades concretas y conversar con Benjamin con contexto. La recomendación es construir primero la experiencia controlada y conectar la IA después de validar el recorrido.

El resultado comercial buscado es una conversación útil sobre algo que Benjamin puede construir. No se ofrecerán diagnósticos técnicos exhaustivos ni promesas de ventas. El flujo completo está implementado, con generación de tres oportunidades en servidor y cierre contextual por WhatsApp (`+61 409 871 882`, ya configurado). La activación real requiere credenciales de OpenAI y reglas de protección en Vercel; ver `business-ideas-setup.md`. El detalle siguiente conserva el plan original como referencia de alcance.

Rama de trabajo local: `feat/business-ideas-tool`, creada desde `main` en `c408582`.

## Recorrido propuesto

1. La persona encuentra “What could work better in your business?”.
2. Elige uno de cinco objetivos y recibe una respuesta preparada, instantánea.
3. Pega un enlace de su web, Instagram o Google Business.
4. Si hay información pública suficiente, recibe tres oportunidades personalizadas. Si falta contexto, puede describir brevemente el negocio o contactar directamente con Benjamin.
5. Abre WhatsApp con el enlace y el objetivo que eligió. El mensaje queda preparado para que la persona decida enviarlo.

Los títulos y explicaciones aparecerán en inglés. En esta fase se define contenido y comportamiento; colores, tipografía, fotografías y animaciones se resolverán después.

## Primera capa con contenido controlado

Las opciones tienen IDs estables independientes del texto visible. Cada opción concreta cuenta con una introducción, sus áreas aprobadas y un siguiente paso. La opción para construir una idea muestra cuatro áreas; las tres oportunidades se limitan a la futura respuesta personalizada de IA. Seleccionar una opción no hace solicitudes a una API.

| ID | Opción | Ideas iniciales |
| --- | --- | --- |
| `more-bookings` | I need more bookings | Get found; Conversion; Retention |
| `less-manual-work` | I spend too much time doing things manually | Automation; Internal tools; AI |
| `better-website` | My website feels outdated | Website; Conversion; Google / local presence |
| `build-an-idea` | I have an idea I want to build | Custom tools; Apps; AI; E-commerce |
| `not-sure` | Honestly, I’m not sure | Paso directo al enlace; la futura IA elige las tres áreas con más potencial |

Benjamin aprobó este mapa de áreas. Las explicaciones son posibilidades, no afirmaciones sobre el negocio; no prometen rankings ni resultados de ventas.

Para `not-sure`, el texto será “That’s normal. Show me your business and I’ll look for a few opportunities.” y el CTA “Take a look”. Las demás opciones usarán “Want to see what this could look like for your business?” y “Show me ideas”.

La selección se implementará con controles nativos accesibles. Se podrá cambiar de opción, conservar el enlace y volver a generar. Cambiar el objetivo invalidará las ideas anteriores para que no se mezclen contextos.

## Un enlace y una alternativa cuando falta información

Etiqueta: “Paste your website, Instagram or Google Business link”. El input aceptará dominios sin protocolo, como `yourbusiness.com.au`, y los normalizará. También identificará enlaces de perfiles y fichas de negocio; aceptar un enlace no implica haber accedido a su contenido.

Para una web pública, la primera versión intentará obtener texto útil de la página principal: nombre, oferta, ubicación y vías de contacto o reserva visibles. No ejecutará scripts ni realizará un rastreo profundo. Si no encuentra contexto suficiente, pedirá una frase sobre el negocio.

Para Instagram y Google Business, se comprobará la disponibilidad real de una fuente permitida antes de comprometer extracción automática. No se prometerá acceso a reviews, métricas, publicaciones o contenido que exija iniciar sesión. Si el enlace no aporta información suficiente, el mismo campo opcional de contexto permitirá continuar.

No se inferirá la ausencia de automatizaciones porque no sean visibles en una página. “No se ve un enlace de reservas en el contenido leído” es una observación acotada; “tu negocio no tiene sistema de reservas” es una afirmación que no podemos sostener.

## Catálogo real de Benjamin

El catálogo aprobado está preparado en `src/data/service-catalog.ts` y solo puede importarse en el servidor. Contiene Google y presencia local, conversión, retención, automatización, herramientas internas, IA, websites, herramientas a medida, apps y e-commerce, con descripción y límites para cada área.

“Get found” y “Google / local presence” comparten el ID `local-presence`: son dos entradas al mismo servicio según el objetivo. Las recomendaciones personalizadas se vincularán a estas áreas y el campo “What I’d build” permanecerá dentro de su alcance. Los requisitos concretos de cada proyecto se definirán en la conversación con Benjamin.

## Segunda capa con tres oportunidades

El servidor recibirá el objetivo, el enlace normalizado y el contexto opcional. Obtendrá la información disponible, separará observaciones de hipótesis y realizará una sola generación acotada con el catálogo aprobado.

La respuesta tendrá un formato validado con:

- Nombre del negocio cuando esté disponible y enlace aportado.
- Contexto utilizado y limitaciones relevantes.
- Exactamente tres oportunidades distintas, cada una con título, explicación, propuesta de construcción e ID del servicio.
- Soporte interno de cada oportunidad: observación detectada o hipótesis explícita.

Cada explicación será corta y orientada al negocio. No se devolverán HTML ni contenido ejecutable. Los resultados se mostrarán como texto escapado. Si la respuesta no cumple el contrato, se ofrecerá reintentar o hablar con Benjamin.

Cuando el objetivo sea `not-sure`, el generador podrá elegir tres áreas distintas del catálogo completo, sin un filtro previo por objetivo. Si la evidencia es insuficiente, no completará tres aparentes hallazgos: solicitará contexto antes de generar o presentará ideas exploratorias claramente condicionadas.

No habrá chat, conversación abierta ni múltiples agentes en la primera versión. El proveedor y el modelo se decidirán al integrar, probando calidad, latencia y coste con ejemplos representativos. AI SDK es una opción para validar salida estructurada; no hace falta instalarlo para construir la primera capa.

## WhatsApp como cierre

Después de las ideas: “Want me to look at it properly?” y “The ideas above were generated automatically. I’ll personally take a look and tell you what I’d actually do.”

CTA: “Talk to Ben”. Mensaje base:

> Hey Ben, I tried the business ideas tool. My business is [name or link] and I selected [goal]. Here’s my link: [link]. Would love your take.

Se añadirá un resumen corto de las oportunidades si ayuda y cabe de forma legible. El enlace y el objetivo se conservarán incluso cuando la generación falle. El usuario podrá contactar sin generar ideas. Una nota junto al envío explicará que se usa información pública del enlace para preparar ideas automáticas.

Se necesita el número real de WhatsApp en formato internacional. No se publicará un botón que prometa abrir WhatsApp y termine en otra sección o en una URL inventada.

## Arquitectura prevista

La portada y el contenedor de sección seguirán siendo Server Components. Solo el selector, el formulario y los estados del resultado necesitarán una pequeña zona con `use client`. La solicitud de IA ocurrirá exclusivamente después de enviar el formulario, nunca al visitar la página, elegir una opción o escribir.

```text
src/
  components/
    sections/business-ideas-section.tsx    Contenedor estático de la sección 02
    sections/business-ideas.tsx            Diseño interactivo y estados visuales
    business-ideas/use-business-ideas.ts    Solicitud, validación, cancelación y WhatsApp
  data/
    business-goals.ts                      Opciones y respuestas preparadas
    service-catalog.ts                     Servicios aprobados para el servidor
  types/
    business-ideas.ts                      Contratos de entrada y salida
  app/api/business-ideas/route.ts           Endpoint agregado al conectar IA
  lib/
    business-ideas/
      resolve-context.ts                  Obtención y clasificación de evidencia
      generate-ideas.ts                    Generación y validación
```

Estos archivos se crearán cuando cada fase los necesite. No se añadirá una librería genérica de componentes ni un módulo por cada tarjeta. Los módulos de acceso a servicios y el catálogo usado por IA tendrán límites de servidor mediante `server-only`.

Al integrar, se actualizará el enlace del Hero a `#business-ideas` y se propondrá “Find ideas for your business” para mantener coherencia con la nueva sección. Se conservará un ancla `#audit` temporal para enlaces antiguos. El título de sección propuesto es “02 / Business ideas”.

## Estados y comportamiento

Estados mínimos: selección inicial, respuesta preparada, enlace inválido, solicitud en curso, falta de contexto, tres resultados y fallo recuperable. El enlace y el objetivo nunca se perderán por un error. El botón bloqueará envíos simultáneos, y cambiar de contexto durante una solicitud impedirá mostrar un resultado de la solicitud anterior.

Se reservará espacio razonable para evitar saltos bruscos, con mensajes de progreso honestos y sin porcentajes inventados. La carga se anunciará con `aria-live`, los errores estarán asociados al input y el resultado tendrá un encabezado enfocable. Los controles deberán funcionar con teclado y en móvil.

## Rendimiento y protección de la operación

La zona interactiva será pequeña, sin animaciones pesadas, navegador embebido, librería de chat ni crawler cliente. La página seguirá siendo prerenderizable. Se evaluará cargar la parte de resultados bajo demanda solo si su tamaño medido lo justifica.

El servidor establecerá límites de entrada, tamaño de descarga, tiempo de extracción, tiempo de generación y salida del modelo. Tendrá un límite de solicitudes compartido entre instancias antes de habilitar IA públicamente. Un contador en memoria de una función de Vercel no será la única protección.

Al consultar enlaces se permitirán únicamente HTTP y HTTPS con puertos esperados, se bloquearán destinos locales, privados y reservados, y se controlarán resolución DNS y redirecciones. La extracción seguirá una política de acceso público sin eludir bloqueos. El texto externo será evidencia no confiable, nunca instrucciones para la IA. El modelo no recibirá herramientas para navegar arbitrariamente.

Las claves del proveedor vivirán en variables de servidor. No se guardarán HTML completos ni datos sensibles en logs. El MVP no necesita base de datos ni almacenamiento de leads: el usuario traslada el contexto por WhatsApp. Tampoco se añadirá una caché compartida de entradas personales en esta etapa.

## Orden de implementación

### Paso 1 Experiencia controlada sin IA implementada

Objetivos tipados, respuestas preparadas y el pequeño componente interactivo creados. La sección 02 ya contiene el selector funcional y un campo que conserva el enlace al cambiar de objetivo. El diseño sigue pendiente.

Entrega: las cinco opciones funcionan instantáneamente; `not-sure` conduce directo al input; cambiar de opción funciona con teclado; ninguna selección produce solicitudes externas. El CTA de generación se habilitará únicamente cuando exista su endpoint. Los estados posteriores podrán probarse con fixtures exclusivos de desarrollo, nunca simulando un análisis real en producción.

### Paso 2 Contexto y contacto funcional

Validar y normalizar enlaces, conservar contexto y conectar el número de WhatsApp real. Permitir contactar directamente desde la respuesta preparada. Incorporar el catálogo confirmado y las muestras necesarias para evaluar generación.

Entrega: WhatsApp abre con el enlace y problema elegidos; no hay enlaces ficticios ni solicitudes de IA; el flujo ya es útil como captación contextual.

### Paso 3 Evidencia y generación en entorno de prueba

Implementar extracción acotada de webs y alternativa de contexto para fuentes inaccesibles. Añadir endpoint, proveedor y validación de tres oportunidades. Evaluar negocios distintos, incluyendo links sociales, webs pobres y objetivos inciertos.

Entrega: las recomendaciones son comprensibles, accionables y dentro del catálogo; cada afirmación se apoya en evidencia o se formula como posibilidad; no se inventan reviews, ingresos, conversiones ni sistemas internos.

### Paso 4 Preparación para publicación

Verificar límites de coste, protección de enlaces, fallos, cancelación de solicitudes y límites compartidos. Probar latencia, teclado, móvil y transferencia completa de contexto a WhatsApp. Ejecutar lint, typecheck y build, y medir el incremento de JavaScript frente a la base actual.

Entrega: recorrido completo revisado desde las cinco opciones hasta WhatsApp, con errores recuperables. Los eventos de analítica, si se integran más adelante, contarán selección, envío, resultado y apertura de WhatsApp sin enviar enlaces o descripciones personales. Una apertura de WhatsApp no equivale a un mensaje enviado ni a un lead confirmado.

## Datos que harán falta al avanzar

Para completar contacto se necesita el número de WhatsApp. El catálogo ya está aprobado; para conectar IA se necesitan ejemplos de negocios con recomendaciones esperadas y configurar credenciales y límites de coste. Las pruebas con Instagram y Google Business determinarán si una integración de datos adicional aporta suficiente valor para el MVP.

Los pasos 1–4 están implementados y cuentan con pruebas deterministas. Quedan la configuración de datos reales, evaluación del modelo con negocios representativos y verificación de las reglas en un preview de Vercel antes de habilitar IA públicamente. No se ha empezado el diseño final.

## Referencias técnicas

- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components): mantener el límite de cliente en los componentes interactivos para reducir JavaScript.
- [AI SDK Structured Output](https://ai-sdk.dev/docs/reference/ai-sdk-core/output): salida estructurada con contrato de validación. Revisar las APIs vigentes al implementar.
- [OWASP SSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html): validación de destinos y control de redirecciones para la consulta de enlaces.
