export const translations = {
  en: {
    nav: {
      about: "ABOUT",
      contact: "CONTACT",
      home: "HOME",
    },
    hero: {
      taglineBefore: "let's make projects we ",
      taglineHighlight: "believe",
      taglineAfter: " in",
      cta: "talk to me",
    },
    contact: {
      heading: "talk to me",
      name: "name",
      phone: "phone",
      email: "e-mail",
      messageMobile: "tell me your idea",
      messageDesktop:
        "Short or long message, I'm here to understand your project.",
      send: "send",
      sending: "sending...",
      consent: "by sending, you authorize the use of your contact data",
      success: "thanks — i'll be in touch ASAP",
      error: "something went wrong — please try again",
      errors: {
        nameRequired: "what's your name?",
        nameTooLong: "name is too long",
        phoneRequired: "what's your phone?",
        phoneTooLong: "phone is too long",
        emailRequired: "your e-mail plz",
        emailTooLong: "e-mail is too long",
        emailInvalid: "this doesn't look like a valid e-mail",
        messageRequired: "tell us about your project",
      },
    },
    footer: {
      rights: "All rights reserved.",
    },
    cookie: {
      message:
        "We use cookies to analyze site traffic and improve your experience. By continuing, you agree to our",
      policy: "cookie policy",
      accept: "Accept",
      reject: "Reject",
    },
  },
  pt: {
    nav: {
      about: "SOBRE",
      contact: "CONTATO",
      home: "HOME",
    },
    hero: {
      taglineBefore: "vamos fazer projetos em que ",
      taglineHighlight: "acreditamos",
      taglineAfter: "",
      cta: "fale comigo",
    },
    contact: {
      heading: "fale comigo",
      name: "nome",
      phone: "telefone",
      email: "e-mail",
      messageMobile: "me conta sua ideia",
      messageDesktop:
        "Mensagem curta ou longa, estou aqui para entender o seu projeto.",
      send: "enviar",
      sending: "enviando...",
      consent: "ao enviar, você autoriza o uso dos seus dados de contato",
      success: "obrigado — entro em contato em breve",
      error: "algo deu errado — tente novamente",
      errors: {
        nameRequired: "qual é o seu nome?",
        nameTooLong: "nome muito longo",
        phoneRequired: "qual é o seu telefone?",
        phoneTooLong: "telefone muito longo",
        emailRequired: "seu e-mail, por favor",
        emailTooLong: "e-mail muito longo",
        emailInvalid: "esse e-mail não parece válido",
        messageRequired: "conta sobre o seu projeto",
      },
    },
    footer: {
      rights: "Todos os direitos reservados.",
    },
    cookie: {
      message:
        "Utilizamos cookies para analisar o tráfego do site e melhorar a sua experiência. Ao continuar, concorda com a nossa",
      policy: "política de cookies",
      accept: "Aceitar",
      reject: "Rejeitar",
    },
  },
} as const;

export type Lang = keyof typeof translations;
export type T = typeof translations.en;
