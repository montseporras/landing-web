import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center px-6 pt-20 text-center">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="text-display-lg mt-4 text-ink">
          Esta página se tomó un{" "}
          <em className="font-light italic text-gold-600">respiro</em>
        </h1>
        <p className="prose-fs mx-auto mt-5 max-w-md">
          No encontramos lo que buscabas, pero quizás era una señal para volver
          al inicio y empezar de nuevo — eso también es desarrollo personal.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button href="/" variant="lila">
            Volver al inicio
          </Button>
          <Button href="/regalos" variant="secondary">
            Ver los regalos
          </Button>
        </div>
      </div>
    </section>
  );
}
