import type { Dictionary } from "./en";

// Portuguese (Brazil). "Você" throughout, and wording that doesn't assign
// vx a grammatical gender ("Engenharia de sistemas", not "Engenheiro").
// Quotes from English READMEs stay in English.
const pt: Dictionary = {
  meta: {
    title: "vx — engenharia de sistemas",
    description:
      "vx escreve sistemas init mínimos e ferramentas de boot em C, pequenos o bastante para ler de uma vez só.",
  },
  skip: "Pular para o conteúdo",
  nav: {
    label: "Seções",
    language: "Idioma",
    work: "Trabalho",
    principles: "Princípios",
    stack: "Ferramentas",
    contact: "Contato",
  },
  hero: {
    line: "Sistemas init e ferramentas de boot em C.",
    lede: "Programas pequenos, cada um com uma só tarefa, que usam interfaces POSIX sempre que possível e são curtos o bastante para ler de uma vez só. O projeto atual é o 4suite, uma pilha de boot independente para Linux.",
    facts: [
      { k: "Função", v: "Engenharia de sistemas" },
      { k: "Foco", v: "Sistemas init, C POSIX" },
      { k: "Agora", v: "4suite / 4rc" },
      { k: "Código", v: "github.com/vx9k" },
    ],
  },
  work: {
    title: "Trabalho",
    status: {
      shipping: "disponível",
      "in progress": "em andamento",
      planned: "planejado",
    },
    spec: {
      language: "Linguagem",
      target: "Plataforma",
      build: "Build",
      license: "Licença",
      framework: "Framework",
      styling: "Estilos",
      hosting: "Hospedagem",
    },
    suite: {
      body: "Uma pilha de boot independente em C: init, rc, logger e user, cada um com escopo próprio e README próprio.",
      target: "Linux, BSD planejado",
      platforms: "Por enquanto, só Linux. signalfd é uma interface do Linux; o suporte a BSD está planejado.",
      components: "Componentes",
      nodes: {
        "4init": "PID 1 mínimo. Bloqueia os sinais e os lê por um signalfd, faz fork do 4rc em uma sessão própria e recolhe os processos filhos a cada SIGCHLD. Inspirado no init mínimo do rofl0r.",
        "4rc": "O gerenciador de serviços que o 4init inicia. Ainda está no começo: o próprio README diz que ele “larps as being functional”.",
        logger: "Faz parte do escopo da suíte. Ainda não começou.",
        user: "Faz parte do escopo da suíte. Ainda não começou.",
      },
    },
    site: {
      body: "Um export estático de Next.js servido pelo Cloudflare Workers, em inglês, espanhol e português. A raiz escolhe o idioma na edge e a página segue o modo claro ou escuro do seu sistema.",
    },
  },
  principles: {
    title: "Princípios",
    aside: "Três regras que resolvem quase todas as minhas escolhas de projeto antes de eu escrever uma linha.",
    items: [
      {
        title: "Padrões em vez de atalhos",
        body: "Interfaces POSIX em vez de extensões de um fornecedor. Se um programa roda em uma só plataforma, alguém decidiu isso, e a decisão precisa de um motivo.",
      },
      {
        title: "Uma tarefa, feita de forma previsível",
        body: "Um init que só gerencia processos. Um gerenciador de serviços que só gerencia serviços. Quando o escopo cresce sem controle, costuma ser o primeiro sinal de que algo vai deixar de ser confiável.",
      },
      {
        title: "Pequeno o bastante para entender por inteiro",
        body: "Código que cabe na sua cabeça é melhor que código em que você precisa confiar. Se eu não sei explicar por que uma linha está ali, ela sai.",
      },
    ],
  },
  stack: {
    title: "Ferramentas",
    groups: { languages: "Linguagens", web: "Web", tooling: "Utilitários" },
  },
  contact: {
    title: "Contato",
    quote:
      "Prefiro lançar algo pequeno que eu entendo por completo do que algo grande cujos limites ainda estou descobrindo.",
    source: "Código deste site",
  },
  footer: {
    top: "Voltar ao topo",
  },
  notFound: {
    title: "Página não encontrada",
    body: "Não há nada neste endereço. O link pode estar desatualizado ou a URL pode ter um erro de digitação.",
    back: "Voltar para o início",
  },
};

export default pt;
