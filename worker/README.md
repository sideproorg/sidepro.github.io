# Worker del formulario (apagado hasta que haya responsable de datos)

Qué hace: recibe el formulario de `/fessionals`, arma un correo con fecha y hora, versión del aviso aceptado y "consentimiento: sí", y lo manda a la casilla del proyecto por Email Routing. **No guarda nada.** Es lo que votó la mesa (3 de 5) y lo que decidió la promotora el 26/10/2026.

Hoy el sitio tiene `formulario_abierto: false` en `_config.yml`, así que el formulario no se muestra y este Worker no hace falta. Se enciende solo cuando exista un responsable del archivo con nombre y domicilio (Ley 25.326).

## Encender, en orden

1. **Cuenta de Cloudflare de sidepro**, no personal, con dos personas como miembros y 2FA en las dos. Códigos de recuperación impresos en dos sobres.
2. **Dominio**: `sidepro.org` registrado o transferido a esa cuenta (Registrar), pagado por tres años. DNS en Cloudflare.
3. **Email Routing**. Si la casilla del proyecto vive en otro proveedor con su propio MX (Zoho, por ejemplo), Email Routing no puede activarse sobre `sidepro.org`: activarlo sobre el subdominio `mensajes.sidepro.org` (Cloudflare lo permite por subdominio). En *Destination addresses*, agregar la casilla del proyecto (la que tiene contrato de encargado, no Gmail gratuito) y verificarla con el correo que manda Cloudflare.
4. Editar `wrangler.toml`: `destination_address`, `PARA` y `CORREO_AYUDA` con esa casilla. `DESDE` tiene que ser una dirección del dominio o subdominio donde está activo Email Routing (por defecto, `formulario@mensajes.sidepro.org`).
5. Desde esta carpeta, con Node 20 o más: `npx wrangler login` y `npx wrangler deploy`. Si wrangler rechaza la sección `[[unsafe.bindings]]`, borrarla y volver a desplegar.
6. Probar sin datos reales:
   ```
   curl -i -X POST https://anotarse.sidepro.org/anotarse -H "Origin: https://sidepro.org" \
     -d "t=$(( $(date +%s%3N) - 5000 ))" -d "nombre=prueba" -d "contacto=prueba@example.org" \
     -d "proyecto=prueba" -d "consentimiento=si" -d "aviso_version=2026-10-26"
   ```
   Tiene que responder `303` y llegar un correo a la casilla. Borrar ese correo.
7. En `_config.yml`: `formulario_abierto: true`, `responsable_datos`, `domicilio_datos` (una casilla postal o el del patrocinante, no una casa) y revisar `herramienta_datos`. Subir el cambio de `aviso_version` a la fecha del día.
8. Agregar a `MANTENIMIENTO.md` quién puede entrar a la cuenta de Cloudflare y dónde están los códigos.

## Reglas que el código cumple

- Solo acepta `POST` desde `https://sidepro.org` (cabecera `Origin` o `Referer`).
- Trampa para bots (campo oculto `sitio_web`) y comprobación de tiempo (menos de 3 segundos desde que se cargó la página = bot): en esos casos responde "gracias" y no manda nada.
- Campos que viajan: qué puede figurar en público, nombre o alias, contacto, qué sabe hacer, horas, proyecto, si habló con quien opera, consentimiento, versión del aviso. Nada más.
- La casilla "trabajo hoy en IT" y cualquier pregunta sobre el contrato laboral no tienen `name` en el formulario: el navegador las exige, pero no se envían.
- En el correo no van IP, user agent ni cookies. El Worker no escribe logs con datos.
- Si el correo falla, la persona ve un texto con la casilla del proyecto para escribir directamente.

## Apagar

`npx wrangler delete` desde esta carpeta, y `formulario_abierto: false` en `_config.yml`. La única copia de cada anotación es el correo en la casilla del proyecto: borrar es borrar el correo (y la papelera) y dejar constancia en el acta.
