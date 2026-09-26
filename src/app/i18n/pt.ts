import type { Dictionary } from "./en";

// Portuguese (Brazil). "Você" throughout, and wording that doesn't assign
// vx a grammatical gender ("Engenharia de software", not "Engenheiro").
// Quotes from English READMEs stay in English.
const pt: Dictionary = {
  meta: {
    title: "vx — engenharia de software",
    description: "vx mora no Uruguai e escreve C para Linux e TypeScript para a web.",
  },
  skip: "Pular para o conteúdo",
  nav: {
    label: "Seções",
    language: "Idioma",
    skills: "Habilidades",
    principles: "Princípios",
    contact: "Contato",
  },
  hero: {
    status: "Disponível para trabalhar",
    line: "Sou vx e trabalho com engenharia de software no Uruguai.",
    lede: "Escrevo C para Linux, até o PID 1, e TypeScript para a web, como este site. Me interessa como as coisas funcionam por dentro, das camadas de rede aos modelos de linguagem.",
  },
  skills: {
    title: "Habilidades",
    groups: { languages: "Linguagens", web: "Web", networking: "Redes", ai: "IA" },
    names: { asm: "Assembly x86", llm: "Como funcionam os LLMs", ai: "Trabalhar com IA" },
    notes: { l23: "Enlace de dados, rede", l4: "Transporte", l67: "Apresentação, aplicação" },
  },
  principles: {
    title: "Princípios",
    quote: "Programas pequenos, cada um com uma só tarefa, que usam interfaces POSIX sempre que possível e são curtos o bastante para ler de uma vez só.",
    items: [
      {
        title: "Padrões em vez de atalhos",
        body: "Interfaces POSIX em vez de extensões de um fornecedor.",
      },
      {
        title: "Uma tarefa, feita de forma previsível",
        body: "Um init que só gerencia processos. Um gerenciador de serviços que só gerencia serviços.",
      },
      {
        title: "Pequeno o bastante para entender por inteiro",
        body: "Se eu não sei explicar por que uma linha está ali, ela sai.",
      },
    ],
  },
  contact: {
    title: "Contato",
    heading: "Estou disponível para trabalhar.",
    body: "Meus projetos são públicos no GitHub.",
  },
  footer: {
    source: "Código deste site",
    top: "Voltar ao topo",
  },
  notFound: {
    title: "Página não encontrada",
    body: "Não há nenhuma página neste endereço. O link pode estar desatualizado ou a URL pode ter um erro de digitação.",
    back: "Voltar para o início",
  },
};

export default pt;
