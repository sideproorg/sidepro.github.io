# sidepro.org

Horas libres puestas en side projects que mejoran proyectos locales.

sidepro reúne a profesionales de tecnologías digitales que trabajan en remoto con pequeñas organizaciones socio-ambientales (ciclo 1: Córdoba) que ya saben qué les falta y necesitan profesionales calificados para mejorar su funcionamiento. Pedidos de doce semanas, al menos cuatro horas por semana, en dupla con quien va a operar el sistema. Lo que queda andando lo gobierna el proyecto. Este repo es el sitio y el archivo: lo que no está acá, no existe.

## Cómo está hecho

- **Jekyll tal como lo compila GitHub Pages**, sin plugins ni tema externo. No hay `npm install` ni Action de build: se hace push a `main` y GitHub publica.
- **Contenido en archivos de texto**: las fichas en `_pedidos/`, las RFC en `_rfc/`, el Estado real en `_data/estado.yml`, las tarjetas de `/fessionals` en `_data/fessionals.yml`, la FAQ en `_data/faq.yml`. Se editan desde el navegador.
- **Tipografía Paper Mono** (licencia OFL) servida desde `assets/fonts/`. Sin Google Fonts, sin rastreadores, sin analítica.
- **Formulario de /fessionals**: cerrado hasta que exista un responsable de datos (Ley 25.326). Cuando abra, lo recibe un Worker de Cloudflare que reenvía por correo y no guarda nada (`worker/`). Dos maneras de entrar: traer un proyecto (con un archivo opcional, audio, imagen o PDF de hasta 10 MB, que viaja como adjunto) o anotarse a dos pedidos de `/jects`. Las franjas libres viajan como un código que quien convoca cruza en `/cruzar/`, en su navegador; nada se guarda.

## Agregar una ficha en diez minutos

1. Copiá `_pedidos/pedido-002.md` como `_pedidos/pedido-004.md`.
2. Completá los campos del encabezado. La escribe el proyecto en su lenguaje; si dice "urgente", "etc." o "una plataforma", está mal escrita. `estado: candidata` hasta que el proyecto diga qué le falta y tenga quien opere; `abierta` cuando lo diga; `firmado: true` cuando quien opera firme. `actualizado` con la fecha del cambio y `etapa_n` (0 a 5): de ahí salen el orden y la etapa en la portada.
3. Abrí un pull request. Con una aprobación se publica sola en `/jects/pedido-004/`.

Lo mismo para una RFC (`_rfc/`), una tarjeta (`_data/fessionals.yml`) o una línea del Estado real (`_data/estado.yml`). Más en [CONTRIBUTING.md](CONTRIBUTING.md); qué corre, dónde y quién tiene qué clave, en [MANTENIMIENTO.md](MANTENIMIENTO.md).

## Estructura

```
_config.yml            nombre, firma, correo del proyecto, formulario abierto o cerrado
_data/estado.yml       Estado real a la fecha (pie de todas las páginas)
_data/faq.yml          preguntas honestas
_data/fessionals.yml    tarjetas de quienes forman parte (opt-in)
_data/pasos.yml        "Cómo participar", tres pasos (las cinco etapas de un pedido están en la RFC-001)
_data/no.yml           "Lo que no vas a encontrar acá"
_pedidos/              una ficha por pedido → /jects/<id>/
_rfc/                  una carilla por regla → /rfc/<id>/
cruzar/                /cruzar/: cruza códigos de franjas libres en el navegador, sin guardar nada
_layouts/ _includes/   plantillas
assets/css/sidepro.css dirección "Papel": tokens de color y tipografía al principio del archivo
assets/fonts/          Paper Mono y su licencia
plantillas/            PEDIDO, SESION0, CAMBIOS, DESPLIEGUE, MANTENIMIENTO, SALIDA y REPO para el repo de cada proyecto
worker/                el Worker del formulario (apagado)
.github/workflows/     revisión de links rotos en cada PR
```

## Licencias

Textos e imágenes propias: [CC BY-SA 4.0](LICENSE). Código del sitio y del Worker: [MIT](LICENSE-CODIGO). Paper Mono: [OFL 1.1](assets/fonts/OFL-PaperMono.txt). Lo que nombre a personas o comunidades queda fuera de la licencia y no se publica sin su lectura.

## Estado real

Está en el pie de todas las páginas y en `/estado/`. Si tiene más de treinta días, cualquiera puede actualizarlo con un PR, aunque sea para decir "sin novedades".

## Publicar por primera vez

1. La organización en GitHub es `sideproorg` (el nombre `sidepro` no estaba libre); exigir 2FA a sus miembros. El repo tiene que ser público y llamarse exactamente `sideproorg.github.io`, así el sitio se sirve en la raíz y no en una subcarpeta. Subir este contenido a la rama `main`.
2. En el repo: *Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `/ (root)`*. En un minuto el sitio aparece en `https://sideproorg.github.io/`.
3. Reemplazar los marcadores: `[tu nombre]`, `[correo del proyecto]` y `[N]` en `_config.yml`, `_data/estado.yml` y `_pedidos/`.
4. Dominio: `sidepro.org` está registrado en Namecheap; el DNS vive en la cuenta de Cloudflare de sidepro (nameservers cambiados en Namecheap). Registros para GitHub Pages: cuatro `A` en `@` (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) y `CNAME www → sideproorg.github.io`, todos sin proxy (nube gris). El archivo `CNAME` del repo (contiene `sidepro.org`) le dice a GitHub el dominio; con él presente, GitHub redirige `sideproorg.github.io` al dominio, así que solo tiene que existir cuando el DNS esté activo. En GitHub, *Settings → Pages* muestra el dominio y, cuando el certificado esté emitido (minutos a una hora), se marca *Enforce HTTPS*.
5. Espejo: crear `sideproorg/sideproorg.github.io` en Codeberg y configurar el push automático (Codeberg → *Settings → Mirror*, o una Action con un token guardado como secreto). Anotar en `MANTENIMIENTO.md`.
