/**
 * Campo honeypot anti-spam. Invisible para las personas (aria-hidden +
 * fuera de pantalla + sin tab); los bots lo completan y el servidor descarta
 * el envío en silencio (ver isHoneypotTripped en lib/validation.ts).
 */
export function Honeypot() {
  return (
    <div
      aria-hidden="true"
      className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
    >
      <label>
        No completes este campo
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
