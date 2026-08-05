/**
 * Pruebas de saneamiento de texto enriquecido contra payloads de XSS
 * conocidos. No requiere un framework de test: se ejecuta con
 *
 *   npx tsx scripts/test-sanitize-html.ts
 *
 * Cubre exactamente los casos exigidos en la auditoría de seguridad del CMS
 * de texto enriquecido (ver SECURITY.md): <script>, javascript:, atributos
 * onerror/onclick, iframes, HTML malformado, enlaces inseguros y payloads
 * que evitan el editor (enviados directo a la función de saneamiento, como
 * simulando un payload manipulado desde el navegador).
 */
import {
  containsDangerousMarkup,
  sanitizeRichTextForRender,
  sanitizeRichTextHtml,
} from "../src/lib/sanitize-html";

interface Case {
  name: string;
  payload: string;
  /** Se espera que containsDangerousMarkup() detecte esto y se RECHACE el guardado. */
  expectRejected: boolean;
}

const cases: Case[] = [
  { name: "script tag", payload: "<script>alert(1)</script>", expectRejected: true },
  { name: "img onerror", payload: '<img src=x onerror="alert(1)">', expectRejected: true },
  { name: "javascript: href", payload: '<a href="javascript:alert(1)">click</a>', expectRejected: true },
  { name: "iframe", payload: '<iframe src="https://evil.com"></iframe>', expectRejected: true },
  { name: "malformed html", payload: "<p>unclosed <strong>bold", expectRejected: false },
  {
    name: "data:text/html href",
    payload: '<a href="data:text/html,<script>alert(1)</script>">x</a>',
    expectRejected: true,
  },
  { name: "onclick attr on allowed tag", payload: '<p onclick="alert(1)">hola</p>', expectRejected: true },
  {
    name: "style attr injection",
    payload: '<p style="position:fixed;top:0;background:red">x</p>',
    expectRejected: false,
  },
  { name: "vbscript href", payload: '<a href="vbscript:msgbox(1)">x</a>', expectRejected: true },
  { name: "object tag", payload: '<object data="evil.swf"></object>', expectRejected: true },
  { name: "embed tag", payload: "<embed src=\"evil.swf\">", expectRejected: true },
  {
    name: "form tag",
    payload: '<form action="https://evil.com"><input></form>',
    expectRejected: true,
  },
  {
    name: "legit bold+list+link (payload manipulado directo, sin pasar por el editor)",
    payload:
      '<p><strong>Hola</strong> <em>mundo</em></p><ul><li>uno</li></ul><a href="https://example.com">link</a>',
    expectRejected: false,
  },
  {
    name: "mailto link",
    payload: '<a href="mailto:hola@francissalazar.com">Escribime</a>',
    expectRejected: false,
  },
];

const DANGEROUS_OUTPUT =
  /<script|<iframe|<object|<embed|<form|on\w+\s*=|javascript:|vbscript:|data:text\/html|style=/i;

let failures = 0;

for (const c of cases) {
  const rejected = containsDangerousMarkup(c.payload);
  const rejectOk = rejected === c.expectRejected;
  if (!rejectOk) failures++;
  console.log(
    `${rejectOk ? "OK  " : "FAIL"} [detección] ${c.name}: esperado rejected=${c.expectRejected}, obtenido=${rejected}`,
  );

  // Defensa en profundidad: incluso si el pre-chequeo no lo marcara, el
  // saneamiento en sí (guardado + render) debe neutralizar cualquier ataque.
  const clean = sanitizeRichTextHtml(c.payload);
  const rendered = sanitizeRichTextForRender(clean);
  const survived = DANGEROUS_OUTPUT.test(rendered);
  if (survived) {
    failures++;
    console.log(`FAIL [neutralización] ${c.name}: quedó contenido peligroso -> "${rendered}"`);
  } else {
    console.log(`OK  [neutralización] ${c.name}: salida final -> "${rendered}"`);
  }
}

console.log(`\n${cases.length * 2 - failures}/${cases.length * 2} checks passed`);
if (failures > 0) {
  console.error(`\n${failures} FALLOS`);
  process.exit(1);
} else {
  console.log("\nTodas las pruebas de XSS pasaron.");
}
