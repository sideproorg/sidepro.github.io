// sidepro-anotarse: recibe el formulario de /fessionals, arma un correo con fecha, hora,
// versión del aviso y consentimiento, lo manda a la casilla del proyecto por Email Routing
// y NO guarda nada. Sin base, sin logs con datos, sin IP ni user agent en el correo.
//
// Dos maneras de entrar (27/10/2026):
//   via=a  trae un proyecto: campo "proyecto" (obligatorio), archivo opcional (audio, imagen o PDF,
//          hasta MAX_MB) y, si hay archivo, la casilla "autorizo" (lo grabó esa persona o quien opera lo autoriza).
//   via=b  se anota a dos pedidos: exactamente dos códigos en "pedidos" (pedido-001, pedido-002...).
// En los dos casos viaja "disp": las franjas libres como código (lu-m,mi-t...), para cruzar en /cruzar/.
//
// El archivo va como adjunto del mismo correo. No se guarda en ningún lado: el correo es la única copia.
// Se borra al firmar la ficha o a los 30 días, con constancia en el acta.
//
// Lo que nunca viaja: la casilla "trabajo hoy en IT" y cualquier pregunta sobre el contrato laboral.
// El navegador las exige (required) pero no tienen name, así que no llegan; y si llegaran, acá se descartan.

import { EmailMessage } from "cloudflare:email";

const CAMPOS = ["via", "publico", "nombre", "contacto", "sabe", "horas", "proyecto", "opera", "autorizo", "disp", "consentimiento", "aviso_version"];
const MAX = { via: 1, nombre: 80, contacto: 120, sabe: 160, horas: 40, proyecto: 200, publico: 10, opera: 5, autorizo: 5, disp: 120, aviso_version: 20 };
const TIPOS = /^(audio\/|image\/|application\/pdf$)/;
const CODIGO_PEDIDO = /^pedido-\d{3}$/;
const CODIGO_DISP = /^((lu|ma|mi|ju|vi|sa|do)-[mtn])(,(lu|ma|mi|ju|vi|sa|do)-[mtn])*$/;

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

    // Tamaño total antes de leer nada: el archivo más el resto del formulario.
    const maxMb = Number(env.MAX_MB || 10);
    const largo = Number(request.headers.get("Content-Length") || 0);
    if (largo > (maxMb + 1) * 1024 * 1024) {
      return texto("El envío pesa más de " + maxMb + " MB. Mandá un archivo más chico o contalo en el campo de texto; el audio puede ir después por WhatsApp.", 413);
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
      const crudo = datos.get(campo);
      v[campo] = limpiar(typeof crudo === "string" ? crudo : "", MAX[campo] || 200);
    }
    const pedidos = datos.getAll("pedidos").filter((p) => typeof p === "string" && CODIGO_PEDIDO.test(p)).slice(0, 2);
    const archivo = datos.get("archivo");
    const hayArchivo = archivo && typeof archivo !== "string" && archivo.size > 0;

    const faltan = [];
    if (!v.nombre) faltan.push("nombre o alias");
    if (!v.contacto) faltan.push("cómo te escribimos");
    if (v.via === "a") {
      if (!v.proyecto) faltan.push("el proyecto que traés");
      if (hayArchivo && v.autorizo !== "si") faltan.push("la casilla de autorización del archivo");
    } else if (v.via === "b") {
      if (pedidos.length !== 2 || pedidos[0] === pedidos[1]) faltan.push("dos pedidos distintos");
    } else {
      faltan.push("cómo entrás (traés un proyecto o te anotás a dos pedidos)");
    }
    if (v.consentimiento !== "si") faltan.push("la casilla del aviso de datos");
    if (!v.aviso_version) faltan.push("la versión del aviso");
    if (v.disp && !CODIGO_DISP.test(v.disp)) v.disp = "";
    if (faltan.length) {
      return texto("Faltan: " + faltan.join(", ") + ". Volvé atrás y completalo. Si no funciona, escribí a " + env.CORREO_AYUDA, 400);
    }

    // El archivo: solo audio, imagen o PDF, hasta MAX_MB. Si no cumple, se avisa y no se manda nada.
    let adjunto = null;
    if (hayArchivo) {
      if (archivo.size > maxMb * 1024 * 1024) {
        return texto("El archivo pesa más de " + maxMb + " MB. Mandá uno más chico o contalo en el campo de texto.", 413);
      }
      const tipo = (archivo.type || "").toLowerCase();
      if (!TIPOS.test(tipo)) {
        return texto("El archivo tiene que ser un audio, una imagen o un PDF.", 415);
      }
      adjunto = { nombre: nombreSeguro(archivo.name, tipo), tipo, bytes: new Uint8Array(await archivo.arrayBuffer()) };
    }

    const ahora = new Date();
    const lineas = [
      "Anotación en sidepro.org/fessionals",
      "",
      "Fecha y hora (UTC): " + ahora.toISOString(),
      "Versión del aviso de datos aceptado: " + v.aviso_version,
      "Consentimiento: sí (casilla marcada por la persona antes de enviar)",
      "",
      "Cómo entra: " + (v.via === "a" ? "trae un proyecto" : "se anota a dos pedidos"),
      "Qué puede figurar en público: " + (v.publico || "nada"),
      "Nombre o alias: " + v.nombre,
      "Cómo escribirle: " + v.contacto,
      "Qué sabe hacer: " + (v.sabe || "(no dijo)"),
      "Horas libres reales por semana: " + (v.horas || "(no dijo)"),
      "Franjas libres (código para /cruzar/): " + (v.disp || "(no marcó)"),
    ];
    if (v.via === "a") {
      lineas.push(
        "Proyecto que trae: " + v.proyecto,
        "Habló con quien lo operaría: " + (v.opera === "si" ? "sí, y está dispuesto a firmar la ficha" : "todavía no"),
        "Archivo: " + (adjunto ? adjunto.nombre + " (" + adjunto.tipo + ", " + Math.round(adjunto.bytes.length / 1024) + " KB), adjunto a este correo" : "no mandó"),
        adjunto ? "Autorización del archivo: sí (lo grabó o escribió esa persona, o quien opera lo autoriza; sin nombres, voces ni caras de otras personas)" : "",
      );
    } else {
      lineas.push("Pedidos elegidos: " + pedidos.join(" y ") + " (entra como segunda; arranca por videollamada cuando el proyecto firme)");
    }
    lineas.push(
      "",
      "--",
      "No se guardó nada en el servidor: este correo es la única copia.",
      "Para borrar a pedido o a los 90 días: eliminar este correo (y la papelera) y dejar constancia en el acta.",
      adjunto ? "El archivo adjunto se vuelca a la ficha y se borra al firmarla o a los 30 días, lo que pase primero, con constancia en el acta. Nunca va al repo." : "",
      "La pregunta del contrato laboral no se pregunta ni viaja: se habla en el uno a uno.",
    );
    const cuerpo = lineas.filter((l) => l !== "").join("\r\n");

    const asunto = "Anotación (" + v.via + "): " + v.nombre + " · " + (v.via === "a" ? v.proyecto.slice(0, 60) : pedidos.join(", "));
    const raw = mime(env.DESDE, env.PARA, asunto, cuerpo, ahora, adjunto);

    try {
      await env.CORREO.send(new EmailMessage(env.DESDE, env.PARA, raw));
    } catch (e) {
      return texto("No se pudo enviar el correo. Escribí directamente a " + env.CORREO_AYUDA + " con el proyecto que traés o los dos pedidos que elegiste.", 500);
    }

    return redirigir(env.GRACIAS);
  },
};

function limpiar(s, max) {
  return s.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
}

function nombreSeguro(nombre, tipo) {
  const base = (nombre || "archivo").replace(/[^A-Za-z0-9._-]+/g, "_").slice(0, 60) || "archivo";
  if (/\.[A-Za-z0-9]{1,5}$/.test(base)) return base;
  const ext = tipo === "application/pdf" ? ".pdf" : tipo.startsWith("image/") ? "." + tipo.slice(6).replace(/[^a-z0-9]/g, "") : ".audio";
  return base + ext;
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

// base64 de bytes sin pasar por String.fromCharCode(...spread), que revienta con archivos.
// Usa Uint8Array.prototype.toBase64 si el runtime lo tiene (nativo, rápido); si no, btoa por tramos.
function base64(bytes) {
  if (typeof bytes.toBase64 === "function") return bytes.toBase64();
  let s = "";
  const tramo = 0x8000;
  for (let i = 0; i < bytes.length; i += tramo) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + tramo));
  }
  return btoa(s);
}

function lineas76(b64) {
  return b64.replace(/(.{76})/g, "$1\r\n");
}

// MIME mínimo, sin dependencias: texto plano UTF-8 en base64 y, si hay, un adjunto en multipart/mixed.
function mime(desde, para, asunto, cuerpo, fecha, adjunto) {
  const utf8 = (s) => base64(new TextEncoder().encode(s));
  const id = "<" + crypto.randomUUID() + "@sidepro.org>";
  const cabecera = [
    "From: sidepro <" + desde + ">",
    "To: <" + para + ">",
    "Subject: =?UTF-8?B?" + utf8(asunto) + "?=",
    "Date: " + fecha.toUTCString(),
    "Message-ID: " + id,
    "MIME-Version: 1.0",
  ];
  const textoParte = [
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    lineas76(utf8(cuerpo)),
  ];
  if (!adjunto) {
    return cabecera.concat(textoParte, [""]).join("\r\n");
  }
  const borde = "=_sidepro_" + crypto.randomUUID().replace(/-/g, "");
  return cabecera
    .concat([
      'Content-Type: multipart/mixed; boundary="' + borde + '"',
      "",
      "--" + borde,
    ])
    .concat(textoParte, [
      "",
      "--" + borde,
      "Content-Type: " + adjunto.tipo + '; name="' + adjunto.nombre + '"',
      'Content-Disposition: attachment; filename="' + adjunto.nombre + '"',
      "Content-Transfer-Encoding: base64",
      "",
      lineas76(base64(adjunto.bytes)),
      "",
      "--" + borde + "--",
      "",
    ])
    .join("\r\n");
}
