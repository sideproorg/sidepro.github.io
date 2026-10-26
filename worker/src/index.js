// sidepro-anotarse: recibe el formulario de /fessionals, arma un correo con fecha, hora,
// versión del aviso y consentimiento, lo manda a la casilla del proyecto por Email Routing
// y NO guarda nada. Sin base, sin logs con datos, sin IP ni user agent en el correo.
//
// Lo que nunca viaja: la casilla "trabajo hoy en IT" y cualquier pregunta sobre el contrato laboral.
// El navegador las exige (required) pero no tienen name, así que no llegan; y si llegaran, acá se descartan.

import { EmailMessage } from "cloudflare:email";

const CAMPOS = ["publico", "nombre", "contacto", "sabe", "horas", "proyecto", "opera", "consentimiento", "aviso_version"];
const MAX = { nombre: 80, contacto: 120, sabe: 160, horas: 40, proyecto: 200, publico: 10, opera: 5, aviso_version: 20 };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET") {
      return texto("sidepro · anotarse. Solo acepta el formulario de " + env.ORIGEN + "/fessionals/. No guarda nada.", 200);
    }
    if (request.method !== "POST" || url.pathname !== "/anotarse") {
      return texto("Nada por acá.", 404);
    }

    // Solo desde el sitio.
    const origen = request.headers.get("Origin") || request.headers.get("Referer") || "";
    if (!origen.startsWith(env.ORIGEN)) {
      return texto("El formulario solo se manda desde " + env.ORIGEN, 403);
    }

    // Límite opcional por IP (si el binding existe).
    if (env.LIMITE) {
      const ip = request.headers.get("CF-Connecting-IP") || "0";
      const { success } = await env.LIMITE.limit({ key: ip });
      if (!success) return texto("Demasiados envíos seguidos. Probá en un minuto.", 429);
    }

    let datos;
    try {
      datos = await request.formData();
    } catch (e) {
      return texto("No se pudo leer el formulario.", 400);
    }

    // Trampa para bots y comprobación de tiempo: si cae, se responde como si hubiera salido bien y no se manda nada.
    const trampa = (datos.get("sitio_web") || "").toString();
    const t = Number(datos.get("t") || 0);
    if (trampa !== "" || !t || Date.now() - t < 3000) {
      return redirigir(env.GRACIAS);
    }

    const v = {};
    for (const campo of CAMPOS) {
      v[campo] = limpiar((datos.get(campo) || "").toString(), MAX[campo] || 200);
    }

    const faltan = [];
    if (!v.nombre) faltan.push("nombre o alias");
    if (!v.contacto) faltan.push("cómo te escribimos");
    if (!v.proyecto) faltan.push("el proyecto que traés");
    if (v.consentimiento !== "si") faltan.push("la casilla del aviso de datos");
    if (!v.aviso_version) faltan.push("la versión del aviso");
    if (faltan.length) {
      return texto("Faltan: " + faltan.join(", ") + ". Volvé atrás y completalo. Si no funciona, escribí a " + env.CORREO_AYUDA, 400);
    }

    const ahora = new Date();
    const cuerpo = [
      "Anotación en sidepro.org/fessionals",
      "",
      "Fecha y hora (UTC): " + ahora.toISOString(),
      "Versión del aviso de datos aceptado: " + v.aviso_version,
      "Consentimiento: sí (casilla marcada por la persona antes de enviar)",
      "",
      "Qué puede figurar en público: " + (v.publico || "nada"),
      "Nombre o alias: " + v.nombre,
      "Cómo escribirle: " + v.contacto,
      "Qué sabe hacer: " + (v.sabe || "(no dijo)"),
      "Horas libres reales por semana: " + (v.horas || "(no dijo)"),
      "Proyecto que trae: " + v.proyecto,
      "Habló con quien lo operaría: " + (v.opera === "si" ? "sí, y está dispuesto a firmar la ficha" : "todavía no"),
      "",
      "--",
      "No se guardó nada en el servidor: este correo es la única copia.",
      "Para borrar a pedido o a los 90 días: eliminar este correo (y la papelera) y dejar constancia en el acta.",
      "La pregunta del contrato laboral no se pregunta ni viaja: se habla en el uno a uno.",
    ].join("\r\n");

    const asunto = "Anotación: " + v.nombre + " · " + v.proyecto.slice(0, 60);
    const raw = mime(env.DESDE, env.PARA, asunto, cuerpo, ahora);

    try {
      await env.CORREO.send(new EmailMessage(env.DESDE, env.PARA, raw));
    } catch (e) {
      return texto("No se pudo enviar el correo. Escribí directamente a " + env.CORREO_AYUDA + " con el proyecto que traés.", 500);
    }

    return redirigir(env.GRACIAS);
  },
};

function limpiar(s, max) {
  return s.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
}

function texto(cuerpo, estado) {
  return new Response(cuerpo + "\n", {
    status: estado,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" },
  });
}

function redirigir(a) {
  return new Response(null, { status: 303, headers: { location: a, "cache-control": "no-store" } });
}

// MIME mínimo: texto plano UTF-8 en base64, sin dependencias.
function mime(desde, para, asunto, cuerpo, fecha) {
  const b64 = (s) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
  const id = "<" + crypto.randomUUID() + "@sidepro.org>";
  return [
    "From: sidepro <" + desde + ">",
    "To: <" + para + ">",
    "Subject: =?UTF-8?B?" + b64(asunto) + "?=",
    "Date: " + fecha.toUTCString(),
    "Message-ID: " + id,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    b64(cuerpo).replace(/(.{76})/g, "$1\r\n"),
    "",
  ].join("\r\n");
}
