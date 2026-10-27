# Cómo contribuir

1. Todo entra por pull request; con una aprobación se publica solo. No hace falta conocernos.
2. Se aceptan cambios de contenido: fichas (`_pedidos/`), RFC (`_rfc/`), tarjetas (`_data/fessionals.yml`), Estado real (`_data/estado.yml`), FAQ (`_data/faq.yml`), correcciones de texto.
3. Una ficha nueva: copiá `_pedidos/pedido-002.md`, completá el encabezado, `estado: candidata` hasta que quien opera la firme.
4. Nada sobre una persona u organización sin su lectura: la ficha la escribe el proyecto, y su nombre se publica cuando firma.
5. Sin estas palabras: voluntariado, impacto, empoderar, sumate, cambiá el mundo, beneficiarios, comunidad como muletilla. Sin contadores, sin fotos de gente.
6. Estado real con más de 30 días: cualquiera lo actualiza, aunque sea "sin novedades". Cambiá la fecha y solo lo que cambió.
7. Cambios de diseño o de estructura: primero un issue de tres líneas. Los tokens de color están al principio de `assets/css/sidepro.css`.
8. Una RFC nueva: copiá `_rfc/rfc-002.md`, numerala, una carilla. El PR es la discusión; cuando cierra, la RFC dice cómo se resolvió y quién objetó.
9. Nunca subas datos personales de nadie (correos, teléfonos, capturas): el repo es público y el historial no se borra.
10. Tono de README, no de manifiesto. Español rioplatense. Firmado por una persona.

## Nombre y localidad de una organización

Hasta que la ficha esté firmada (`firmado: true`), no se publica el nombre de la organización ni su localidad: `ciudad` queda en el front matter y las plantillas lo ocultan; en `quien_pide` va el tipo de organización, sin lugar. En un pueblo chico, rubro más localidad es nombrarla. Con la firma entran las dos cosas, y lo que se puede contar en público queda escrito en el CONTAR.md del pedido.
