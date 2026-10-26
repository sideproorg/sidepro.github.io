# sidepro.org

Horas libres puestas en side projects que mejoran proyectos locales.

sidepro junta a profesionales de IT que trabajan remoto y tienen horas libres con proyectos de Argentina (ciclo 1: Córdoba) que ya saben qué les falta y no cómo llegar. Pedidos de doce semanas, al menos cuatro horas por semana, en dupla con quien va a operar el sistema. Lo que queda andando lo gobierna el proyecto. Este repo es el sitio y el archivo: lo que no está acá, no existe.

## Cómo está hecho

- **Jekyll tal como lo compila GitHub Pages**, sin plugins ni tema externo. No hay `npm install` ni Action de build: se hace push a `main` y GitHub publica.
- **Contenido en archivos de texto**: las fichas en `_pedidos/`, las RFC en `_rfc/`, el Estado real en `_data/estado.yml`, las tarjetas de `/fesionals` en `_data/fesionals.yml`, la FAQ en `_data/faq.yml`. Se editan desde el navegador.
- **Tipografía Paper Mono** (licencia OFL) servida desde `assets/fonts/`. Sin Google Fonts, sin rastreadores, sin analítica.
- **Formulario de /fesionals**: cerrado hasta que exista un responsable de datos (Ley 25.326). Cuando abra, lo recibe un Worker de Cloudflare que reenvía por correo y no guarda nada (`worker/`).

## Agregar una ficha en diez minutos

1. Copiá `_pedidos/pedido-002.md` como `_pedidos/pedido-003.md`.
2. Completá los campos del encabezado. La escribe el proyecto en su lenguaje; si dice "urgente", "etc." o "una plataforma", está mal escrita. `estado: ejemplo` hasta que quien opera la firme; entonces `estado: abierta` y `firmado: true`.
3. Abrí un pull request. Con una aprobación se publica sola en `/jects/pedido-003/`.

Lo mismo para una RFC (`_rfc/`), una tarjeta (`_data/fesionals.yml`) o una línea del Estado real (`_data/estado.yml`). Más en [CONTRIBUTING.md](CONTRIBUTING.md); qué corre, dónde y quién tiene qué clave, en [MANTENIMIENTO.md](MANTENIMIENTO.md).

## Estructura

```
_config.yml            nombre, firma, correo del proyecto, formulario abierto o cerrado
_data/estado.yml       Estado real a la fecha (pie de todas las páginas)
_data/faq.yml          preguntas honestas
_data/fesionals.yml    tarjetas de quienes forman parte (opt-in)
_data/pasos.yml        "Cómo funciona"
_data/no.yml           "Lo que no vas a encontrar acá"
_pedidos/              una ficha por pedido → /jects/<id>/
_rfc/                  una carilla por regla → /rfc/<id>/
_layouts/ _includes/   plantillas
assets/css/sidepro.css dirección "Papel": tokens de color y tipografía al principio del archivo
assets/fonts/          Paper Mono y su licencia
worker/                el Worker del formulario (apagado)
.github/workflows/     revisión de links rotos en cada PR
```

## Licencias

Textos e imágenes propias: [CC BY-SA 4.0](LICENSE). Código del sitio y del Worker: [MIT](LICENSE-CODIGO). Paper Mono: [OFL 1.1](assets/fonts/OFL-PaperMono.txt). Lo que nombre a personas o comunidades queda fuera de la licencia y no se publica sin su lectura.

## Estado real

Está en el pie de todas las páginas y en `/estado/`. Si tiene más de treinta días, cualquiera puede actualizarlo con un PR, aunque sea para decir "sin novedades".

## Publicar por primera vez

1. Crear la organización `sidepro` en GitHub (plan gratuito) y exigir 2FA a sus miembros. Crear el repo público `sidepro/sidepro.org` y subir este contenido a la rama `main`.
2. En el repo: *Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `/ (root)`*. En un minuto el sitio aparece en `https://sidepro.github.io/sidepro.org/`.
3. Reemplazar los marcadores: `[tu nombre]`, `[correo del proyecto]` y `[N]` en `_config.yml`, `_data/estado.yml` y `_pedidos/`.
4. Dominio: en la cuenta de Cloudflare de sidepro, registrar `sidepro.org` y crear dos registros DNS: `CNAME sidepro.org → sidepro.github.io` y `CNAME www → sidepro.github.io` (sin proxy naranja al principio). Después renombrar `CNAME.pendiente` a `CNAME`, poner `sidepro.org` como *Custom domain* en *Settings → Pages* y marcar *Enforce HTTPS*.
5. Espejo: crear `sidepro/sidepro.org` en Codeberg y configurar el push automático (Codeberg → *Settings → Mirror*, o una Action con un token guardado como secreto). Anotar en `MANTENIMIENTO.md`.
