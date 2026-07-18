/**
 * Exportación a Excel sin dependencias externas.
 *
 * Genera un archivo en formato SpreadsheetML (XML de Excel), que Excel,
 * LibreOffice y Google Sheets abren como una planilla real con columnas —
 * a diferencia de un CSV, respeta tipos y acentos sin configuración.
 */

function escapeXml(value: unknown): string {
  return (
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
      // Elimina caracteres de control no válidos en XML
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
  );
}

function cell(value: unknown): string {
  return `<Cell><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`;
}

function row(values: unknown[]): string {
  return `<Row>${values.map(cell).join("")}</Row>`;
}

/**
 * Descarga una planilla Excel (.xls) con los encabezados y filas dadas.
 * @param sheetName nombre de la hoja
 * @param headers   fila de títulos
 * @param rows      filas de datos (cada una, un array de celdas)
 * @param fileName  nombre del archivo (sin extensión)
 */
export function downloadExcel(
  sheetName: string,
  headers: string[],
  rows: unknown[][],
  fileName: string,
): void {
  const header =
    '<Row ss:StyleID="sHead">' +
    headers
      .map((h) => `<Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`)
      .join("") +
    "</Row>";

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<?mso-application progid="Excel.Sheet"?>\n' +
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ' +
    'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
    "<Styles>" +
    '<Style ss:ID="sHead"><Font ss:Bold="1"/>' +
    '<Interior ss:Color="#EEE8F6" ss:Pattern="Solid"/></Style>' +
    "</Styles>\n" +
    `<Worksheet ss:Name="${escapeXml(sheetName).slice(0, 31)}">\n<Table>\n` +
    header +
    "\n" +
    rows.map(row).join("\n") +
    "\n</Table>\n</Worksheet>\n</Workbook>";

  const blob = new Blob([xml], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}
