# Worker del formulario (apagado hasta que haya responsable de datos)

Qué hace: recibe el formulario de `/fessionals`, arma un correo con fecha y hora, versión del aviso aceptado y "consentimiento: sí", y lo manda a la casilla del proyecto por Email Routing. **No guarda nada.** Es lo que votó la mesa (3 de 5) y lo que decidió la promotora el 26/10/2026.

Desde el 27/10/2026 el formulario tiene dos maneras de entrar: **a**, traer un proyecto (con un archivo opcional, audio, imagen o PDF, de hasta 10 MB, que va como adjunto del mismo correo), y **b**, anotarse a dos pedidos de `/jects` (dos códigos, `pedido-001`...). En los dos casos viaja un código de franjas libres (`lu-n,mi-t`), que quien convoca cruza en `/cruzar/`, en el navegador, sin guardar nada.

Hoy el sitio tiene `formulario_abierto: false` en `_config.yml`, así que el formulario no se muestra y este Worker no hace falta. Se enciende solo cuando exista un responsable del archivo con nombre y domicilio (Ley 25.326).

## Encender, en orden

1. **Cuenta de Cloudflare de sidepro**, no personal, con dos personas como miembros y 2FA en las dos. Códigos de recuperación impresos en dos sobres.
2. **Dominio**: `sidepro.org` registrado o transferido a esa cuenta (Registrar), pagado por tres años. DNS en Cloudflare.
3. **Email Routing**. Si la casilla del proyecto vive en otro proveedor con su propio MX (Zoho, por ejemplo), Email Routing no puede activarse sobre `sidepro.org`: activarlo sobre el subdominio `mensajes.sidepro.org` (Cloudflare lo permite por subdominio). En *Destination addresses*, agregar la casilla del proyecto (la que tiene contrato de encargado, no Gmail gratuito) y verificarla con el correo que manda Cloudflare.
4. Editar `wrangler.toml`: `destination_address`, `PARA` y `CORREO_AYUDA` con esa casilla. `DESDE` tiene que ser una dirección del dominio o subdominio donde está activo Email Routing (por defecto, `formulario@mensajes.sidepro.org`).
5. Desde esta carpeta, con Node 20 o más: `npx wrangler login` y `npx wrangler deploy`. Si wrangler rechaza la sección `[[unsafe.bindings]]`, borrarla y volver a desplegar.
6. Probar sin datos reales (las dos vías, y una con archivo):
   ```
   T=$(( $(date +%s%3N) - 5000 ))
   curl -i -X POST https://anotarse.sidepro.org/anotarse -H "Origin: https://sidepro.org" \
     -F "t=$T" -F "via=a" -F "nombre=prueba" -F "contacto=prueba@example.org" -F "proyecto=prueba" \
     -F "disp=lu-n,mi-t" -F "consentimiento=si" -F "aviso_version=2026-10-27"
   curl -i -X POST https://anotarse.sidepro.org/anotarse -H "Origin: https://sidepro.org" \
     -F "t=$T" -F "via=a" -F "nombre=prueba" -F "contacto=prueba@example.org" -F "proyecto=prueba" \
     -F "archivo=@prueba.pdf;type=application/pdf" -F "autorizo=si" -F "consentimiento=si" -F "aviso_version=2026-10-27"
   curl -i -X POST https://anotarse.sidepro.org/anotarse -H "Origin: https://sidepro.org" \
     -F "t=$T" -F "via=b" -F "nombre=prueba" -F "contacto=prueba@example.org" \
     -F "pedidos=pedido-001" -F "pedidos=pedido-002" -F "consentimiento=si" -F "aviso_version=2026-10-27"
   ```
   Cada una tiene que responder `303` y llegar un correo a la casilla (la segunda, con el PDF adjunto). Borrar esos correos.
7. En `_config.yml`: `formulario_abierto: true`, `responsable_datos`, `domicilio_datos` (una casilla postal o el del patrocinante, no una casa) y revisar `herramienta_datos`. Subir el cambio de `aviso_version` a la fecha del día.
8. Agregar a `MANTENIMIENTO.md` quién puede entrar a la cuenta de Cloudflare y dónde están los códigos.

## Reglas que el código cumple

- Solo acepta `POST` desde `https://sidepro.org` (cabecera `Origin` o `Referer`).
- Trampa para bots (campo oculto `sitio_web`) y comprobación de tiempo (menos de 3 segundos desde que se cargó la página = bot): en esos casos responde "gracias" y no manda nada.
- Campos que viajan: cómo entra (a o b), qué puede figurar en público, nombre o alias, contacto, qué sabe hacer, horas, franjas libres como código; en **a**, el proyecto, si habló con quien opera, el archivo (si mandó) y la autorización del archivo; en **b**, los dos códigos de pedido. Nada más.
- El archivo: solo audio, imagen o PDF; hasta `MAX_MB` (10). Va como adjunto del correo y no se guarda en ningún otro lado. Se vuelca a la ficha y se borra al firmarla o a los 30 días, lo que pase primero, con constancia en el acta. Nunca va al repo. Si falta la casilla de autorización, el Worker no manda nada y lo dice.
- Límites de Cloudflare a tener en cuenta: `send_email` acepta hasta 25 MiB si el destino es una *destination address* verificada en Email Routing (lo es, por el paso 3); el archivo en base64 crece un tercio, así que 10 MB entran. En el plan Free el Worker tiene 10 ms de CPU por pedido: codificar 10 MB puede pasarse. Si al probar con un archivo grande responde error 1102, bajar `MAX_MB` y `archivo_mb` a 5, o pasar la cuenta a Workers Paid (US$ 5 por mes).
- La casilla "trabajo hoy en IT" y cualquier pregunta sobre el contrato laboral no tienen `name` en el formulario: el navegador las exige, pero no se envían.
- En el correo no van IP, user agent ni cookies. El Worker no escribe logs con datos.
- Si el correo falla, la persona ve un texto con la casilla del proyecto para escribir directamente.

## Apagar

`npx wrangler delete` desde esta carpeta, y `formulario_abierto: false` en `_config.yml`. La única copia de cada anotación es el correo en la casilla del proyecto: borrar es borrar el correo (y la papelera) y dejar constancia en el acta.
