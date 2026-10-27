# CAMBIOS · [id]

Una línea por avance. Un avance es cualquier cambio que deje al pedido más cerca de lo que tiene que quedar andando: una columna menos, una copia restaurada, una decisión. Un avance es un commit y una línea acá; el hash corto del commit es su id. La escribe quien hizo el cambio; quien opera firma cada cierre de etapa, y si no tipea, dicta y la línea dice "dictó". Nada se borra: lo que estuvo mal se revierte con otro avance.

| Fecha | Avance | Quién | Commit | Etapa que cierra (si cierra) |
| --- | --- | --- | --- | --- |
| [aaaa-mm-dd] | Ficha firmada; repo creado con dos owners | [quien opera] | [abc1234] | 1 Pedido |
| [aaaa-mm-dd] | De siete columnas quedaron cuatro; las otras no las mira nadie | [quien opera, dictó] · [referente] | [abc1235] | |
| | | | | |

Para reconstruir la historia sin esta tabla: `git log --oneline -- .` en el repo. Cada commit dice quién, cuándo y qué.
