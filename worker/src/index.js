// sidepro-anotarse: recibe el formulario de /fessionals (y /en/fessionals), lo manda por correo
// al buzón del proyecto con Email Routing y NO guarda nada. Sin base, sin logs con datos,
// sin IP ni user agent en el correo.
//
// El navegador arma el texto (asunto y cuerpo) con lo que la persona completó y lo manda acá
// como JSON. El Worker solo revisa que venga del sitio, que no sea un bot, que tenga el
// consentimiento marcado, y lo reenvía. La casilla "trabajo hoy en IT" nunca viaja.

import { EmailMessage } from "cloudflare:email";

const MAX_ASUNTO = 160;
const MAX_CUERPO = 8000;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origen = request.headers.get("Origin") || "";
    const cors = {
      "access-control-allow-origin": origen === env.ORIGEN || origen === env.ORIGEN_WWW ? origen : env.ORIGEN,
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      "vary": "Origin",
    };

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method === "GET") return texto("sidepro · anotarse. Solo acepta el formulario de " + env.ORIGEN + ". No guarda nada.", 200, cors);
    if (request.method !== "POST" || url.pathname !== "/anotarse") return json({ ok: false, error: "nada por aquí" }, 404, cors);

    // Solo desde el sitio.
    if (origen !== env.ORIGEN && origen !== env.ORIGEN_WWW) return json({ ok: false, error: "origen" }, 403, cors);

    // Límite opcional por IP (si el binding existe).
    if (env.LIMITE) {
      const { success } = await env.LIMITE.limit({ key: request.headers.get("CF-Connecting-IP") || "0" });
      if (!success) return json({ ok: false, error: "demasiados envíos seguidos; prueba en un minuto" }, 429, cors);
    }

    let d;
    try {
      d = await request.json();
    } catch (e) {
      return json({ ok: false, error: "formulario ilegible" }, 400, cors);
    }

    // Trampa para bots y tiempo mínimo: si cae, se responde "ok" y no se manda nada.
    const t = Number(d.t || 0);
    if ((d.sitio_web || "") !== "" || !t || Date.now() - t < 3000) return json({ ok: true }, 200, cors);

    const asunto = limpiar(String(d.asunto || ""), MAX_ASUNTO);
    const cuerpo = String(d.cuerpo || "").replace(/\r/g, "").slice(0, MAX_CUERPO).trim();
    const contacto = limpiar(String(d.contacto || ""), 120);
    if (!asunto || !cuerpo) return json({ ok: false, error: "faltan datos" }, 400, cors);
    if (d.consentimiento !== "si") return json({ ok: false, error: "falta el consentimiento" }, 400, cors);

    const ahora = new Date();
    const texto_correo = [
      cuerpo,
      "",
      "--",
      "Recibido (UTC): " + ahora.toISOString() + " · aviso de datos " + limpiar(String(d.aviso_version || ""), 20),
      "No se guardó nada en el servidor: este correo es la única copia.",
      "Para borrar a pedido o a los 90 días: eliminar este correo (y la papelera) y dejar constancia en el acta.",
    ].join("\r\n");

    const responder = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(contacto) ? contacto : "";
    try {
      await env.CORREO.send(new EmailMessage(env.DESDE, env.PARA, mime(env.DESDE, env.PARA, responder, asunto, texto_correo, ahora)));
    } catch (e) {
      return json({ ok: false, error: "no se pudo enviar el correo" }, 502, cors);
    }
    return json({ ok: true }, 200, cors);
  },
};

function limpiar(s, max) {
  return s.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
}

function texto(c, estado, extra) {
  return new Response(c + "\n", { status: estado, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", ...extra } });
}

function json(o, estado, extra) {
  return new Response(JSON.stringify(o), { status: estado, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra } });
}

function b64(s) {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

// MIME mínimo: texto plano UTF-8 en base64.
function mime(desde, para, responder, asunto, cuerpo, fecha) {
  const h = [
    "From: sidepro <" + desde + ">",
    "To: <" + para + ">",
  ];
  if (responder) h.push("Reply-To: <" + responder + ">");
  h.push(
    "Subject: =?UTF-8?B?" + b64(asunto) + "?=",
    "Date: " + fecha.toUTCString(),
    "Message-ID: <" + crypto.randomUUID() + "@sidepro.org>",
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    b64(cuerpo).replace(/(.{76})/g, "$1\r\n"),
    "",
  );
  return h.join("\r\n");
}
