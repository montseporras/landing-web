-- ═══════════════════════════════════════════════════════════════════
--  FS · Francis Salazar — Contenido inicial v5 (opcional)
--  Ejecutar DESPUÉS de schema.sql en el SQL Editor de Supabase.
--  Carga los mismos datos de ejemplo que el sitio muestra por defecto,
--  para que puedan editarse desde el panel.
--
--  NOTA: si no ejecutás este archivo, no pasa nada — la primera vez que
--  abras «Regalos» o «Preguntas frecuentes» en el panel, la aplicación
--  siembra este mismo contenido automáticamente.
--
--  Los textos de más abajo (description/answer) son texto plano: son
--  contenido de texto enriquecido válido tal cual (sin negrita ni listas)
--  gracias a las columnas *_align agregadas en el bloque "Desde v5 → v6" de
--  schema.sql, que tienen 'left' por defecto — no hace falta listarlas acá.
-- ═══════════════════════════════════════════════════════════════════

insert into public.gifts (title, description, category, access, featured, active, sort_order) values
('Calma: guía práctica de gestión emocional', 'Mi ebook con el método de 5 pasos que uso con mis clientes para pasar del caos emocional a la calma. Incluye ejercicios, plantillas y un plan de 7 días.', 'Ebook', 'email', true, true, 1),
('Meditación guiada: volver al cuerpo', 'Audio de 12 minutos para soltar el ruido mental y volver al presente. Ideal para empezar o cerrar el día.', 'Meditación', 'directo', false, true, 2),
('Checklist: tu botiquín emocional', 'Una lista imprimible con recursos rápidos para días difíciles: qué hacer, qué evitar y a quién llamar.', 'Checklist', 'directo', false, true, 3),
('Plantilla: diario de emociones semanal', 'Registrá tus emociones, disparadores y aprendizajes semana a semana con esta plantilla lista para imprimir.', 'Plantilla', 'directo', false, true, 4),
('Audio: respiración para calmar la ansiedad', 'Una práctica de respiración guiada de 6 minutos, basada en neurociencia, para usar en cualquier momento.', 'Audio', 'directo', false, true, 5),
('Guía: conversaciones difíciles sin explotar', 'Un guion paso a paso para comunicar límites con calma y firmeza, sin culpa y sin discusiones eternas.', 'Guía', 'directo', false, true, 6)
on conflict do nothing;

insert into public.faqs (question, answer, active, sort_order) values
('¿Qué diferencia hay entre coaching y terapia?', 'La terapia trabaja principalmente sanando el pasado y tratando cuadros clínicos; el coaching trabaja desde tu presente hacia tus objetivos. Yo trabajo con personas funcionales que quieren mejorar su gestión emocional, confianza y claridad. Si en el proceso detecto que necesitás apoyo terapéutico, te lo digo con honestidad y puedo derivarte con profesionales de confianza.', true, 1),
('¿Cómo son las sesiones?', 'Son encuentros online de 60 minutos por videollamada, en un espacio 100% confidencial. Combinamos conversación profunda con herramientas prácticas de coaching, inteligencia emocional y neurociencia. Entre sesiones te llevás ejercicios concretos para aplicar lo trabajado.', true, 2),
('¿Cuánto dura un proceso?', 'El proceso individual completo dura 3 meses, con una sesión semanal. Es el tiempo que la evidencia y mi experiencia muestran necesario para instalar nuevos hábitos emocionales. También ofrezco sesiones puntuales de claridad para temas específicos.', true, 3),
('¿La primera llamada tiene costo?', 'No. La llamada de claridad de 30 minutos es gratuita y sin compromiso. Sirve para conocernos, entender tu momento y ver si puedo ayudarte. Si no soy la persona indicada, te lo digo.', true, 4),
('¿Trabajás con hombres también?', 'Sí. Aunque gran parte de mi comunidad son mujeres, acompaño a cualquier persona comprometida con su desarrollo emocional. Las emociones no tienen género.', true, 5),
('¿Qué pasa si necesito reprogramar una sesión?', 'Podés reprogramar sin costo avisando con al menos 24 horas de anticipación. La vida pasa, y el proceso está diseñado para adaptarse a ella.', true, 6)
on conflict do nothing;

insert into public.services (title, description, features, price_label, cta_label, icon, highlighted, active, sort_order) values
('Proceso individual 1:1', 'Un acompañamiento personalizado de 3 meses para trabajar en profundidad tu gestión emocional, confianza y amor propio.', array['12 sesiones online de 60 minutos','Plan de trabajo 100% personalizado','Ejercicios y material entre sesiones','Acompañamiento por WhatsApp'], null, 'Reservar llamada de claridad', 'UserRound', true, true, 1),
('Sesión de claridad puntual', 'Una sesión intensiva de 90 minutos para destrabar una situación concreta: una decisión, un conflicto, un momento de ansiedad.', array['90 minutos de trabajo enfocado','Herramientas aplicables desde el día uno','Resumen escrito con tu plan de acción'], null, 'Quiero mi sesión', 'Lightbulb', false, true, 2),
('Coaching Organizacional', 'Acompañamiento para empresas e instituciones: capacitaciones corporativas e intervenciones que fortalecen el liderazgo, la comunicación efectiva y el bienestar de los equipos.', array['Desarrollo de liderazgo y formación de equipos','Inteligencia emocional aplicada al trabajo','Manejo del estrés laboral y bienestar organizacional','Programas a medida, online o presenciales'], null, 'Solicitar propuesta para mi empresa', 'Users', false, true, 3)
on conflict do nothing;

-- Marca las tablas como "ya sembradas" para que la aplicación no vuelva a
-- insertar el contenido de fábrica automáticamente.
insert into public.site_content (key, value) values
  ('seeded:gifts',    jsonb_build_object('at', now())),
  ('seeded:faqs',     jsonb_build_object('at', now())),
  ('seeded:services', jsonb_build_object('at', now()))
on conflict (key) do nothing;
