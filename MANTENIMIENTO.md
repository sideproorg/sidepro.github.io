# Mantenimiento: qué corre, dónde, quién tiene qué, cómo se apaga

Hoja viva. Si algo aquí no es cierto, es un error y se corrige con un PR. Última revisión: 2026-10-26.

## Qué corre y dónde

| Pieza | Dónde | Cuenta | Costo | Quién puede entrar |
| --- | --- | --- | --- | --- |
| Sitio (Jekyll) | GitHub Pages, repo `sideproorg/sideproorg.github.io`, rama `main` | Organización `sideproorg` en GitHub | 0 | [owner 1], [owner 2: pendiente, mes 1] |
| Espejo del repo | Codeberg, `sideproorg/sideproorg.github.io` (push automático) | Organización `sidepro` en Codeberg | 0 | los mismos |
| Copia de resguardo | Software Heritage, "Save code now" con la URL del repo | ninguna | 0 | cualquiera |
| Dominio `sidepro.org` | Registrado en Namecheap el 27/10/2026 a nombre de Juan Pablo Moreno (deuda: nada a nombre personal). A los 60 días se transfiere a Cloudflare Registrar, a la cuenta de sidepro, con acta de custodia | Namecheap, cuenta personal con 2FA y WhoisGuard; vence [fecha] | ~USD 11-15/año | Juan Pablo Moreno |
| Dominio `sideproject.lat` | [registrador], alternativa si el INPI rechaza "sidepro" | la misma | ~USD 15-25/año | los mismos |
| DNS | Cloudflare (nameservers cambiados en Namecheap) | Cuenta de Cloudflare de sidepro, no personal | 0 | los mismos |
| Correo del proyecto | Email Routing (Cloudflare) → buzón con contrato de encargado ([proveedor]) | la misma + cuenta del buzón | 0 | los mismos |
| Formulario de /fessionals | Worker `sidepro-anotarse` (`worker/`), apagado | la misma | 0 | los mismos |
| `.com.ar` | no registrado: espera un responsable con CUIT | | | |

## Claves y recuperación

- 2FA en todas las cuentas. Códigos de recuperación impresos en dos sobres cerrados, uno por custodia. Dónde están: [lugar 1], [lugar 2].
- Ninguna cuenta a nombre personal. Si hoy alguna lo está, figura aquí como deuda: el registro de `sidepro.org` en Namecheap (a nombre de Juan Pablo Moreno hasta la transferencia a Cloudflare Registrar, posible desde el 26/12/2026).
- Acta de custodia y de cesión a la futura persona jurídica: `docs/acta-custodia.md` (pendiente).

## Rutina

- **Mensual (15 minutos)**: la segunda custodia entra a GitHub, Cloudflare y el buzón; revisa que el Estado real tenga menos de 30 días; si el formulario está abierto, borra las anotaciones de más de 90 días que no arrancaron ningún pedido, y los archivos adjuntos de más de 30 días o de fichas ya firmadas, y deja constancia en `docs/actas.md` (cantidad y fecha, nunca nombres).
- **Cada PR**: la Action de links rotos tiene que pasar. Si falla por un sitio ajeno caído, se agrega a `.lycheeignore` con una línea de por qué.
- **Mes 1 (una vez, 20 minutos)**: simulacro de apagado: desactivar GitHub Pages y servir el sitio desde Codeberg Pages. Si funciona, se anota aquí la fecha. Si no, se arregla antes de la semana 8.
- **Cada tres años**: renovar los dominios. Fecha de vencimiento de `sidepro.org`: [fecha].

## Cómo se apaga (disolución, ronda 7)

1. El repo queda público y archivado; cada proyecto conserva el suyo.
2. El dominio pasa a una co-definidora sin fines de lucro elegida en asamblea; nunca se vende.
3. Las anotaciones (correos) se borran con acta. Los postmortems y el Estado real quedan.
4. `npx wrangler delete` en `worker/`. Email Routing se desactiva después de avisar en el sitio durante 30 días.
