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
quien_pide: Un nodo de productores y consumidores agroecológicos. La localidad y el nombre se publican cuando firme su pedido.
quien_lo_trajo: "Un fessional que lo viene construyendo desde antes de que existiera sidepro. Su nombre lo ven quienes ya están anotados."
problema: "Cada quincena, decenas de familias le piden a una red de productores de Córdoba y de otras provincias; detrás, el equipo cargaba productos, armaba el formulario, juntaba pedidos, mandaba comandas, recibía en el galpón, ajustaba faltantes, entregaba y liquidaba a mano, entre planillas y WhatsApp, y cada edición dependía de las mismas dos o tres personas."
que_hay: "Antes: un formulario de Google para tomar pedidos y todo lo demás a mano, entre WhatsApp, Gmail y carga en planillas. Hoy, en transición: formularios propios en HTML y JavaScript sin frameworks, servidos por GitHub Pages; una planilla de Google con más de treinta hojas (productores, productos, consumidores, ediciones, pedidos, ítems, comandas, recepciones, ajustes, liquidación, sobrantes, stock, pagos, registro de cambios); una veintena de escenarios de Make que se disparan por webhook; correo y un grupo de WhatsApp para avisar. El formulario de Google sigue en uso mientras el sistema nuevo se consolida."
que_queda: "Que el equipo del nodo abra y cierre una edición completa, de la carga de productos a la liquidación, sin quien lo trajo en el medio; con exportación a CSV y copia de respaldo restaurada al menos una vez, y una hoja de mantenimiento que diga qué corre dónde, cuánto cuesta por mes, quién tiene cada clave y cómo se apaga."
quien_opera: "Una persona del equipo del nodo, que ya corre ediciones sola. Suplente: cualquier otra persona del equipo; el sistema es simple y se guía solo. Los nombres los ven quienes ya están anotados."
horas: "4 por semana, 12 semanas, en dupla. Ya estaba en curso cuando nació sidepro; entró al método en la etapa 4."
licencia: "El código de los formularios ya es MIT, elegido por el nodo. La planilla y los escenarios se documentan en el repo del nodo."
hay_plata: No. Está escrito dónde va cada peso cuando lo haya.
financiamiento: "Sí, en especie. Se acordó un valor en pesos por hora según las posibilidades reales del nodo, y se pagó en alimentos agroecológicos que gestiona el nodo. Sin factura, porque fue un intercambio. Hito: el sistema lanzado y usado en una edición entera, reemplazando al anterior. No es un precedente: es un tipo de acuerdo posible. El monto lo ven quienes ya están anotados."
etapa: "4 Sola"
cierre: "El primer pedido real del sitio. Ya corre ediciones con quien opera sola; falta escribir el traspaso."
stack: "Formularios HTML y JS sin frameworks en GitHub Pages · Google Sheets como base · Make (escenarios por webhook, plan pago) · Google Drive para copias · correo y WhatsApp para avisos. El nodo paga Make y sus cuentas. Plan de transición: Google Forms convive hasta que el sistema nuevo se consolide; después, la base pasa de Google Sheets a Supabase o similar. El plan B, si Make cambia de precio, va en MANTENIMIENTO.md."
---

Cómo es una edición hoy, de punta a punta. Cada paso es un formulario del equipo o de la red (salvo el de pedidos, que en la transición convive con Google Forms), que llama a un escenario de Make, que escribe en la planilla:

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

Lo que falta para el traspaso: nombrar suplente, `MANTENIMIENTO.md` (qué corre dónde, cuánto cuesta por mes, quién tiene cada clave, cómo se apaga), exportación a CSV probada, una restauración de la copia hecha por quien opera, y `SALIDA.md` con quién paga el año 2. El registro de avances pasa a `CAMBIOS.md` del repo del nodo.

Cuando el nodo firme, acá va su nombre, su localidad, el link a su repo y, al final, el postmortem firmado por quien opera.
