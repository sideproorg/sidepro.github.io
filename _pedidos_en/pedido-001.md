---
# English pair of _pedidos/pedido-001.md. Change both together.
codigo: pedido-001
titulo: A logistics and sales system for a network of agroecological producers and consumers
estado: en-curso
firmado: false
orden: 1
actualizado: "2026-10-27"
etapa_n: 4
quien_pide: A network of agroecological producers and consumers.
quien_lo_trajo: "A fessional who has been building it since before sidepro existed."
problema: "Every two weeks, orders have to be coordinated between a network of producers from Córdoba and other provinces and the families who buy. Loading products, putting the order form together, collecting orders, sending pick lists, receiving at the warehouse, adjusting shortages, delivering and settling were manual steps, spread across spreadsheets, WhatsApp and email."
que_hay: "Each round depended on a single person, who handled all the information between more than 50 producers and 80 to 100 families. Before, a Google form took the orders and the rest was done by hand, between WhatsApp, Gmail and typing into spreadsheets. Today, custom forms in plain HTML and JavaScript, served by GitHub Pages, have fully replaced the Google form. Google Sheets works as the database of an automated system, not as a record edited by hand: more than thirty sheets (producers, products, consumers, rounds, orders, items, pick lists, receipts, adjustments, settlement, leftovers, stock, payments, change log). Around twenty Make scenarios, triggered by webhook, move data between forms and sheets; email and a WhatsApp group send the notices."
que_queda: "That the network's team can open and close a full round, from loading products to settling with producers, guided step by step by the system and operable by whoever is in charge, with no bottlenecks or long manual data entry. That the system covers every operational case that can come up (shortages, adjustments, uncollected orders, leftovers, corrections) so the record is consistent and reliable end to end."
quien_opera: "A person on the network's team, who already runs rounds on her own. Alternate: anyone else on the team; the system is simple and guides itself."
stack: "Plain HTML and JS forms on GitHub Pages · Google Sheets as database · Make (webhook scenarios, paid plan) · Google Drive for backups · email and WhatsApp for notices. The network pays for Make and its accounts. Next step: moving the database from Google Sheets to Supabase or similar. Plan B, if Make changes its price, goes in MANTENIMIENTO.md."
horas: "4 a week, 12 weeks, as a pair. It was already under way when sidepro was born; it joined the method at stage 4."
licencia: "The form code is already MIT, chosen by the network. The spreadsheet and the scenarios are documented in the network's repo."
financiamiento: "Yes, in kind. An hourly value in pesos was agreed according to the network's real possibilities, and it was paid in agroecological food managed by the network. No invoice, since it was an exchange. Milestone: the system launched and used for a full round, replacing the previous one. It is not a precedent: it is one possible kind of agreement."
etapa: "4 Solo"
cierre: "The site's first real request. The operator already runs rounds; what's left is the handover."
---

What a round looks like today, end to end. Each step is a form for the team or the network, which calls a Make scenario, which writes to the spreadsheet:

1. **Open the round.** The two-week round is created and the working sheets are cleared.
2. **Load products.** Each producer updates their own from a personal link (what's available, unit, price, offer); every stock and price change is logged. The team curates and corrects the catalog, and there is a preview before publishing.
3. **Generate the order form.** A scenario builds the round's form from a template and publishes it on GitHub Pages with a commit. The form is a guided walk through every category, not a shopping cart: you go through everything the network brings that fortnight before closing the order.
4. **Capture orders.** Each order lands in the spreadsheet with its detail, and a confirmation arrives by email.
5. **Pick lists per producer, and splitting.** Each producer gets what to prepare; what gets split into smaller portions at the warehouse is planned.
6. **Receiving at the warehouse.** What arrived is recorded, with corrections if needed.
7. **Adjustments.** Shortages and changes, with a notice to each family.
8. **Delivery, uncollected orders and leftovers.** Deliveries are checked off; uncollected orders are resolved; leftovers are used or sold, and it's all logged.
9. **Settlement.** What each producer is owed, with a notice.
10. **Backup.** A copy of the spreadsheet before each round, and a clock that clears out the old ones.

What's left for the handover: `MANTENIMIENTO.md` (what runs where, what it costs per month, who holds each key, how to turn it off), a tested CSV export, a restore of the backup done by the operator, and `SALIDA.md` with who pays for year 2. The log of steps forward moves to `CAMBIOS.md` in the network's repo.
