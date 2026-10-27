---
# Ficha "Pedido". La escribe el proyecto en su lenguaje y la firma quien va a operar el sistema.
# Si dice "urgente", "etc." o "una plataforma", está mal escrita y no se publica.
# estado: candidata | abierta | en-curso | cerrada     firmado: true cuando quien opera firmó la ficha.
# Los campos entre corchetes los completa el proyecto antes de firmar. El nombre y la localidad de la organización entran con la firma.
codigo: pedido-001
titulo: Un sistema de logística y comercialización para un Nodo de productores y consumidores agroecológicos
estado: en-curso
firmado: false
ciudad: Unquillo, Córdoba   # no se publica hasta que la ficha esté firmada (firmado: true)
orden: 1
actualizado: "2026-10-27"
etapa_n: 4   # 0 candidata, 1 pedido, 2 papel, 3 datos reales, 4 sola, 5 traspaso
quien_pide: Un nodo de productores y consumidores agroecológicos.
quien_lo_trajo: "Un fessional que lo viene construyendo desde antes de que existiera sidepro."
problema: "Cada quincena hay que coordinar los pedidos entre una red de productores de Córdoba y de otras provincias y las familias que compran. Cargar productos, armar el formulario, juntar pedidos, mandar comandas, recibir en el galpón, ajustar faltantes, entregar y liquidar eran pasos manuales, repartidos entre planillas, WhatsApp y correo."
que_hay: "Cada edición dependía de una sola persona, que gestionaba toda la información entre más de 50 productores y entre 80 y 100 familias. Antes, un formulario de Google tomaba los pedidos y el resto se hacía a mano, entre WhatsApp, Gmail y carga en planillas. Hoy, formularios propios en HTML y JavaScript sin frameworks, servidos por GitHub Pages, reemplazaron por completo al formulario de Google. Google Sheets funciona como base de datos de un sistema automatizado, no como registro que se edita a mano: más de treinta hojas (productores, productos, consumidores, ediciones, pedidos, ítems, comandas, recepciones, ajustes, liquidación, sobrantes, stock, pagos, registro de cambios). Una veintena de escenarios de Make, disparados por webhook, mueven los datos entre formularios y hojas; el correo y un grupo de WhatsApp avisan."
que_queda: "Que el equipo del nodo abra y cierre una edición completa, de la carga de productos a la liquidación a productores, guiado paso a paso por el sistema y operable por cualquier persona que esté a cargo, sin cuellos de botella ni largas cargas manuales. Que el sistema contemple cada variable operativa que puede aparecer (faltantes, ajustes, no retirados, sobrantes, correcciones) para que el registro sea consistente y confiable de punta a punta."
quien_opera: "Una persona del equipo del nodo, que ya corre ediciones sola. Suplente: cualquier otra persona del equipo; el sistema es simple y se guía solo."
horas: "4 por semana, 12 semanas, en dupla. Ya estaba en curso cuando nació sidepro; entró al método en la etapa 4."
licencia: "El código de los formularios ya es MIT, elegido por el nodo. La planilla y los escenarios se documentan en el repo del nodo."
hay_plata: No. Está escrito dónde va cada peso cuando lo haya.
financiamiento: "Sí, en especie. Se acordó un valor en pesos por hora según las posibilidades reales del nodo, y se pagó en alimentos agroecológicos que gestiona el nodo. Sin factura, porque fue un intercambio. Hito: el sistema lanzado y usado en una edición entera, reemplazando al anterior. No es un precedente: es un tipo de acuerdo posible."
etapa: "4 Sola"
cierre: "El primer pedido real del sitio. Quien opera ya corre ediciones; lo que queda es el traspaso."
stack: "Formularios HTML y JS sin frameworks en GitHub Pages · Google Sheets como base de datos · Make (escenarios por webhook, plan pago) · Google Drive para copias · correo y WhatsApp para avisos. El nodo paga Make y sus cuentas. Próximo paso: pasar la base de Google Sheets a Supabase o similar. El plan B, si Make cambia de precio, va en MANTENIMIENTO.md."
---

Cómo es una edición hoy, de punta a punta. Cada paso es un formulario del equipo o de la red, que llama a un escenario de Make, que escribe en la planilla:

1. **Abrir edición.** Se crea la edición quincenal y se limpian las hojas de trabajo.
2. **Carga de productos.** Cada productor actualiza lo suyo desde un link propio (qué hay, unidad, precio, oferta); queda registro de cada cambio de stock y de precio. El equipo cura y corrige el catálogo, y hay una vista previa antes de publicar.
3. **Generar el formulario de pedidos.** Un escenario arma el formulario de la edición desde una plantilla y lo publica en GitHub Pages con un commit. El formulario es un recorrido obligado por categorías, no un carrito: se pasa por todo lo que la red trae esa quincena antes de cerrar el pedido.
4. **Captura de pedidos.** Cada pedido entra a la planilla con su detalle y llega una confirmación por correo.
5. **Comandas por productor y fraccionamiento.** A cada productor le llega qué preparar; se planifica qué se fracciona en el galpón.
6. **Recepción en el galpón.** Se registra lo que llegó, con corrección si hace falta.
7. **Ajustes.** Faltantes y cambios, con aviso a cada familia.
8. **Entrega, no retirados y sobrantes.** Se marca lo entregado; lo no retirado se resuelve; lo que sobra se usa o se vende, y queda anotado.
9. **Liquidación.** Cuánto le corresponde a cada productor, con aviso.
10. **Copia de respaldo.** Una copia de la planilla antes de cada edición, y un reloj que limpia las viejas.

Lo que falta para el traspaso: `MANTENIMIENTO.md` (qué corre dónde, cuánto cuesta por mes, quién tiene cada clave, cómo se apaga), exportación a CSV probada, una restauración de la copia hecha por quien opera, y `SALIDA.md` con quién paga el año 2. El registro de avances pasa a `CAMBIOS.md` del repo del nodo.

