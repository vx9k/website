import type { Dictionary } from "./en";

// Spanish (Latin America). Tuteo throughout, and wording that doesn't
// assign vx a grammatical gender ("Ingeniería de sistemas", not
// "Ingeniero"). Quotes from English READMEs stay in English.
const es: Dictionary = {
  meta: {
    title: "vx — ingeniería de sistemas",
    description:
      "vx escribe sistemas init mínimos y herramientas de arranque en C, lo bastante pequeños para leerlos de una sentada.",
  },
  skip: "Saltar al contenido",
  nav: {
    label: "Secciones",
    language: "Idioma",
    skills: "Habilidades",
    principles: "Principios",
    contact: "Contacto",
  },
  hero: {
    line: "Sistemas init y herramientas de arranque en C.",
    lede: "Programas pequeños que hacen una sola cosa cada uno, usan interfaces POSIX siempre que pueden y son lo bastante cortos para leerlos de una sentada.",
    facts: [
      { k: "Rol", v: "Ingeniería de sistemas" },
      { k: "Enfoque", v: "Sistemas init, C POSIX" },
      { k: "Código", v: "github.com/vx9k" },
    ],
  },
  skills: {
    title: "Habilidades",
    groups: { languages: "Lenguajes", web: "Web", networking: "Redes", ai: "IA" },
    names: { asm: "Ensamblador x86", llm: "Cómo funcionan los LLM", ai: "Trabajo con IA" },
    notes: { l23: "Enlace de datos, red", l4: "Transporte", l67: "Presentación, aplicación" },
  },
  principles: {
    title: "Principios",
    items: [
      {
        title: "Estándares antes que atajos",
        body: "Interfaces POSIX antes que extensiones de un fabricante.",
      },
      {
        title: "Una sola tarea, hecha de forma predecible",
        body: "Un init que solo gestiona procesos. Un gestor de servicios que solo gestiona servicios.",
      },
      {
        title: "Lo bastante pequeño para entenderlo entero",
        body: "Si no puedo explicar por qué una línea está ahí, no se queda.",
      },
    ],
  },
  contact: {
    title: "Contacto",
    line: "Mis proyectos son públicos en GitHub.",
  },
  footer: {
    source: "Código de este sitio",
    top: "Volver arriba",
  },
  notFound: {
    title: "Página no encontrada",
    body: "No hay ninguna página en esta dirección. El enlace puede estar desactualizado o la URL puede tener un error.",
    back: "Volver al inicio",
  },
};

export default es;
