# Google Cloud: estado de configuración

Verificado en Google Cloud Console el 5 de octubre de 2026.

Actualización posterior: el usuario eligió **OpenAI + contexto propio** y autorizó guardar la clave Google que proporcionó. Se guardó únicamente en `.env.local`, como `GOOGLE_PLACES_API_KEY`, ignorada por Git y con permisos 600. No se verificó esa credencial contra Google ni se habilitó Places: el recorrido actual usa website/descripcion y no consume Google. La búsqueda por nombre queda fuera de esta versión. La secuencia de rotación/proveedor de abajo documenta el estado anterior; no bloquea el flujo web + OpenAI elegido.

## Recurso creado

- Nombre: **Benjamin Costa Digital**.
- ID: `benjamin-costa-digital`.
- Número de proyecto: `1053731545661`.
- Organización: sin organización.
- [Abrir proyecto](https://console.cloud.google.com/welcome?project=benjamin-costa-digital).

El proyecto se creó en la sesión de Google Cloud del usuario, con autorización para empezar la configuración. No se modificaron los proyectos existentes de Mr Moustache. La terminal tiene `gcloud`, pero no cuenta con una cuenta autenticada; la operación se hizo desde Chrome.

## Facturación: desbloqueada

El primer intento de vincular **Mi cuenta de facturación** falló por el límite de proyectos. Después, por autorización explícita del usuario, se desvinculó facturación de estos dos proyectos, sin borrarlos:

- `buscador google maps`: `high-lacing-491322-m0`.
- `My First Project`: `project-94830558-e74f-49d8-9bc`.

Con la autorización de continuar, **Benjamin Costa Digital** quedó vinculado a **Mi cuenta de facturación** (`012890-5AE58A-F9EF7D`). Verificado en la tabla de proyectos y en la notificación de éxito. No se usó **Pago de Firebase** ni se modificaron las otras vinculaciones.

## Places y credencial: suspensión preventiva

La consola mostró **Places API (New)** (`places.googleapis.com`) habilitada tras vincular facturación. Al abrir su administración, Google redirigió al asistente Maps y creó automáticamente una credencial, inicialmente permitida para 32 APIs Maps. No se eligió «habilitar todas las APIs», ni se hicieron consultas Places.

La credencial se renombró a **Business discovery — Places server** y se restringió a **Places API (New)** únicamente; la restricción quedó verificada después de guardar. No se guardó la clave en `.env.local`, Vercel, Git ni documentos. **La clave apareció en un registro del asistente y debe rotarse por el usuario antes de usarla.** No volver a copiarla al chat. No hay una IP fija de Vercel configurada: no inventar una restricción IP ni usar referrers para un backend.

La consola ofreció siete cuotas diarias ajustables. Se intentó reducirlas a cero para impedir consumo mientras se rota la clave, pero el formulario no confirmó los cambios y, tras recargar, conservaba los valores originales. **No considerar configuradas esas cuotas.** No se crearon alertas ni presupuestos.

Para contener el riesgo, se inhabilitó **Places API (New)** temporalmente y se verificó que su página vuelve a ofrecer **Habilitar**. La facturación del proyecto permanece vinculada; los recursos no se borraron. No hay Google operativo en la aplicación, ni consumo de consultas emitido por esta implementación.

## Próxima secuencia

1. El usuario debe rotar la credencial mostrada por el asistente y revocar la anterior. La rotación de credenciales requiere intervención del usuario. Guardar la nueva fuera del chat y del repositorio, solo como variable de servidor.
2. Elegir la vía de IA: no enviar payloads Places a OpenAI automáticamente. Gemini con Grounding with Google Maps es una alternativa nativa para evaluar, distinta de Maps Grounding Lite; cambiar proveedor requiere aprobación del usuario y revisar sus condiciones.
3. Reutilizar este proyecto, configurar y verificar límites reales pequeños, y habilitar únicamente el servicio necesario para la vía elegida. No activar Legacy, Maps JavaScript, Business Profile ni suscripciones innecesarias. Una alerta no es un límite duro de gasto.
4. Implementar búsqueda solo al enviar, campos mínimos y selección de candidatos ambiguos. Incluir atribuciones, fuentes y políticas públicas antes de publicar. No guardar contenido Google en logs, caché, WhatsApp ni prompts de otro proveedor sin verificar su uso permitido.

La incorporación de contenido Google al prompt de OpenAI continúa pendiente de verificar términos, retención y caché. Habilitar Places no resuelve esa condición. Maps Grounding Lite y Gemini no fueron activados. Ver [plan de descubrimiento](./business-discovery-plan.md).

## Referencias oficiales

- [Crear proyectos](https://docs.cloud.google.com/resource-manager/docs/creating-managing-projects).
- [Vincular facturación](https://docs.cloud.google.com/billing/docs/how-to/modify-project).
- [Configurar Places API (New)](https://developers.google.com/maps/documentation/places/web-service/get-api-key).
- [Cuotas y facturación de Places](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing).
- [Seguridad de Google Maps Platform](https://developers.google.com/maps/api-security-best-practices).
