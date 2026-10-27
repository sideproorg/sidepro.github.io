# REPO · cómo se arma el repo de un pedido

La memoria del pedido son archivos de texto en un repo de git. Esta página dice cómo se crea, quién puede escribir qué, y cómo se lleva a otro lado. Es la RFC-001 ("Registro", "Concurrencia", "Permisos", "Portabilidad") hecha pasos. Todo se hace con lo que GitHub ya trae; no hay nada que programar.

## 1. Crear el repo (etapa 1, Pedido)

- Lo crea el proyecto, en una cuenta del proyecto (si no tiene, se abre una organización de GitHub con el nombre del proyecto; nunca en la cuenta personal de un fessional). Público, salvo que PEDIDO.md diga por qué no.
- **Owners**: quien opera y su suplente, con 2FA en las dos cuentas y códigos de recuperación impresos. Sin dos owners no hay fecha.
- **Colaboradores con escritura**: el referente técnico y la segunda, hasta el traspaso. Se agregan en *Settings → Collaborators*.
- Se copian las plantillas: `PEDIDO.md`, `SESION0.md`, `CAMBIOS.md`, `DESPLIEGUE.md`, `MANTENIMIENTO.md`, `SALIDA.md`, y este archivo. Una carpeta `datos/prueba/` con datos inventados; los reales nunca entran al repo.
- Primer commit: "avance: ficha firmada; repo creado con dos owners", hecho por quien opera (o dictado y hecho por el referente, y la línea de CAMBIOS.md lo dice).

## 2. Proteger la rama principal (concurrencia)

En *Settings → Branches → Add rule* para `main`:

- *Require a pull request before merging*, con **1 aprobación**.
- *Dismiss stale approvals when new commits are pushed*.
- *Require review from Code Owners*.
- *Do not allow bypassing the above settings*.
- Sin *force push* ni borrado de la rama (vienen apagados; dejar así).

Con eso, nadie escribe sobre lo que no leyó: git rechaza un cambio hecho sobre una versión vieja del archivo, y GitHub no deja mergear sin que otra persona haya mirado. La precondición vive en el servicio, no en la memoria de nadie.

## 3. Quién aprueba qué (`.github/CODEOWNERS`)

```
# quien opera aprueba lo que toca datos, despliegue y salida
DESPLIEGUE.md   @usuario-de-quien-opera @usuario-del-suplente
SALIDA.md       @usuario-de-quien-opera @usuario-del-suplente
datos/          @usuario-de-quien-opera @usuario-del-suplente
# el referente aprueba el resto
*               @usuario-del-referente @usuario-de-la-segunda
```

Reemplazar por los usuarios reales de GitHub. Un rol por persona.

## 4. Cómo se escribe (el avance)

- Cada fessional trabaja en **su fork**, en una rama por avance, y abre un PR al repo del proyecto. Sus commits llevan su nombre o alias; el fork es suyo y se lo lleva.
- Mensaje del commit: `avance: <qué cambió, en una línea>`. Si cierra una etapa: `avance: cierra etapa 3 (datos reales)`.
- Cada PR mergeado agrega una línea a `CAMBIOS.md` con fecha, avance, quién y el hash corto. Si el PR no la trae, no se mergea.
- Quien opera, si no usa GitHub: dicta por audio o WhatsApp, el referente hace el commit y la línea dice "dictó". Lo que quien opera firma (cierres de etapa) lo firma comentando "firmo" en el PR o por correo del proyecto, y el link queda en la línea.
- Nada se borra ni se reescribe: un error se arregla con otro avance que lo revierte (`git revert`), y CAMBIOS.md lo cuenta.

## 5. Permisos, en una tabla

| Qué | Quien opera y suplente | Referente y segunda | Cualquiera |
| --- | --- | --- | --- |
| Repo del proyecto | owners | escritura hasta el traspaso | lectura, issues, PR desde fork |
| `DESPLIEGUE.md`, `SALIDA.md`, `datos/` | aprueban | proponen | leen |
| Repo de sidepro (RFC, plantillas) | lectura, PR | lectura, PR | lectura, PR |
| Fork propio | — | todo, para siempre | — |

## 6. Traspaso (etapa 5)

- Los fessionals pasan de escritura a lectura (*Settings → Collaborators → Remove*). Conservan sus forks.
- sidepro hace un fork público del repo canónico con el historial intacto, a nombre de la organización sidepro, sin datos ni credenciales. Es el espejo; no se edita.
- `MANTENIMIENTO.md` dice dónde está cada cosa y quién tiene cada clave.

## 7. Portabilidad

- Para mudar el repo a otro proveedor: `git clone --mirror <url>` y `git push --mirror <nueva url>`. Se llevan todos los commits, ramas y autores.
- Para leer la memoria sin cuenta de GitHub: cualquier archivo `.md` se abre en el navegador o se descarga como zip. Para leerla sin internet: el clon.
- Los datos del sistema no viven en el repo: viven en la herramienta que quien opera abre en su teléfono, con exportación a CSV y copia en dos lugares del proyecto (DESPLIEGUE.md y MANTENIMIENTO.md lo dicen).
