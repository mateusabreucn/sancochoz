"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const cookieText = {
  en: {
    title: "Cookie Policy",
    updated: "Last updated: April 17, 2026",
    intro: "This website uses cookies to improve the user experience, analyze traffic, and personalize content and advertisements. By continuing to browse or by accepting cookies through our banner, you consent to their use under this policy.",
    sections: [
      {
        heading: "1. What are cookies?",
        body: "Cookies are small text files stored on your device (computer, smartphone, or tablet) when you visit a website. These files allow us to recognize the user and store information about their browsing.",
      },
      {
        heading: "2. What types of cookies do we use?",
        body: "This website uses the following types of cookies:\n\na) Strictly necessary cookies\nEssential for the website to function. They allow, for example, navigation and access to secure areas. These cookies do not require consent.\n\nb) Analytics cookies\nAllow us to analyze how users use the website, helping to improve performance and experience.\nExample: Google Analytics.\n\nc) Marketing and advertising cookies\nUsed to present relevant advertisements to the user and measure the effectiveness of advertising campaigns.\nIncludes technologies such as:\nMeta Pixel (Facebook/Instagram)\nGoogle Ads / Google Tag",
      },
      {
        heading: "3. Third-party cookies",
        body: "Some cookies are set by external entities. This website may use:\nMeta Platforms (Meta Pixel)\nGoogle (Google Analytics, Google Ads)\n\nThese entities may collect data about your browsing, even outside this website.\nWe recommend consulting their respective privacy policies:\nhttps://www.facebook.com/privacy/policy\nhttps://policies.google.com/privacy",
      },
      {
        heading: "4. What data may be collected?",
        body: "Through cookies and the contact form, the following data may be collected:\nName\nEmail address\nPhone number\nContent of the sent message\nBrowsing data (IP, approximate location, pages visited, browsing time, device)\n\nSubmitting the form is optional and depends on the user's consent.",
      },
      {
        heading: "5. Purpose of processing",
        body: "The collected data is used to:\nRespond to contact requests\nImprove website functionality\nAnalyze browsing behavior\nMeasure and optimize advertising campaigns",
      },
      {
        heading: "6. Consent",
        body: "The use of non-essential cookies depends on the user's consent, which will be requested through a cookie banner on the first access to the website.\nThe user may change or withdraw their consent at any time.",
      },
      {
        heading: "7. Cookie management",
        body: "The user can manage or disable cookies through their browser settings:\nGoogle Chrome\nMozilla Firefox\nSafari\nMicrosoft Edge\n\nNote that disabling cookies may affect the website's functionality.",
      },
      {
        heading: "8. User rights",
        body: "Under applicable legislation, the user has the right to:\nAccess their personal data\nRequest correction or deletion\nLimit or object to processing\nWithdraw consent at any time",
      },
      {
        heading: "9. Contact",
        body: "For any questions related to this policy or your personal data, you may contact:\nEmail: c.sancochoz@gmail.com",
      },
      {
        heading: "10. Changes to this policy",
        body: "We reserve the right to update this Cookie Policy at any time. We recommend regular consultation.",
      },
    ],
  },
  pt: {
    title: "Política de Cookies",
    updated: "Última atualização: 17-04-2026",
    intro: "Este website utiliza cookies para melhorar a experiência do utilizador, analisar o tráfego e personalizar conteúdos e anúncios. Ao continuar a navegar ou ao aceitar os cookies através do nosso banner, está a consentir a sua utilização, nos termos da presente política.",
    sections: [
      {
        heading: "1. O que são cookies?",
        body: "Cookies são pequenos ficheiros de texto armazenados no seu dispositivo (computador, smartphone ou tablet) quando visita um website. Estes ficheiros permitem reconhecer o utilizador e guardar informações sobre a sua navegação.",
      },
      {
        heading: "2. Que tipos de cookies utilizamos?",
        body: "Este website utiliza os seguintes tipos de cookies:\n\na) Cookies estritamente necessários\nEssenciais para o funcionamento do website. Permitem, por exemplo, a navegação e o acesso a áreas seguras. Estes cookies não requerem consentimento.\n\nb) Cookies analíticos\nPermitem analisar a forma como os utilizadores utilizam o website, ajudando a melhorar o desempenho e a experiência.\nExemplo: Google Analytics.\n\nc) Cookies de marketing e publicidade\nUtilizados para apresentar anúncios relevantes para o utilizador e medir a eficácia das campanhas publicitárias.\nIncluem tecnologias como:\nMeta Pixel (Facebook/Instagram)\nGoogle Ads / Google Tag",
      },
      {
        heading: "3. Cookies de terceiros",
        body: "Alguns cookies são definidos por entidades externas. Este website pode utilizar:\nMeta Platforms (Meta Pixel)\nGoogle (Google Analytics, Google Ads)\n\nEstas entidades podem recolher dados sobre a sua navegação, mesmo fora deste website.\nRecomendamos a consulta das respetivas políticas de privacidade:\nhttps://www.facebook.com/privacy/policy\nhttps://policies.google.com/privacy",
      },
      {
        heading: "4. Que dados podem ser recolhidos?",
        body: "Através dos cookies e do formulário de contacto, podem ser recolhidos os seguintes dados:\nNome\nEndereço de email\nNúmero de telefone\nConteúdo da mensagem enviada\nDados de navegação (IP, localização aproximada, páginas visitadas, tempo de navegação, dispositivo)\n\nO envio do formulário é opcional e depende do consentimento do utilizador.",
      },
      {
        heading: "5. Finalidade do tratamento",
        body: "Os dados recolhidos são utilizados para:\nResponder a pedidos de contacto\nMelhorar o funcionamento do website\nAnalisar comportamento de navegação\nMedir e otimizar campanhas publicitárias",
      },
      {
        heading: "6. Consentimento",
        body: "A utilização de cookies não essenciais depende do consentimento do utilizador, que será solicitado através de um banner de cookies no primeiro acesso ao website.\nO utilizador pode, a qualquer momento, alterar ou retirar o seu consentimento.",
      },
      {
        heading: "7. Gestão de cookies",
        body: "O utilizador pode gerir ou desativar cookies através das definições do seu navegador:\nGoogle Chrome\nMozilla Firefox\nSafari\nMicrosoft Edge\n\nNote que a desativação de cookies pode afetar o funcionamento do website.",
      },
      {
        heading: "8. Direitos do utilizador",
        body: "Nos termos da legislação aplicável, o utilizador tem o direito de:\nAceder aos seus dados pessoais\nSolicitar a sua retificação ou eliminação\nLimitar ou opor-se ao tratamento\nRetirar o consentimento a qualquer momento",
      },
      {
        heading: "9. Contacto",
        body: "Para qualquer questão relacionada com esta política ou com os seus dados pessoais, poderá contactar:\nEmail: c.sancochoz@gmail.com",
      },
      {
        heading: "10. Alterações a esta política",
        body: "Reservamo-nos o direito de atualizar esta Política de Cookies a qualquer momento. Recomendamos a sua consulta regular.",
      },
    ],
  },
} as const;

type Lang = keyof typeof cookieText;

export default function PrivacyPage() {
  const [lang, setLang] = useState<Lang>("pt");
  const t = cookieText[lang];
  const langIndex = lang === "en" ? 0 : 1;

  return (
    <div className="flex-1 flex flex-col">
      <div className="w-[85vw] md:w-2/3 flex flex-col mx-auto mt-14 md:mt-20 pb-12">
        {/* Language Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative grid grid-cols-2 w-24 md:w-32 md:-ml-8 mb-8"
        >
          <motion.div
            className="absolute top-0 left-0 h-full w-1/2 bg-gray-soft"
            animate={{ x: `${langIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
          {(["en", "pt"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className="relative z-10 font-body font-extralight text-sm md:text-lg text-black px-4 py-2 text-center"
            >
              {l.toUpperCase()}
            </button>
          ))}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-2xl md:text-3xl text-black mb-2"
        >
          {t.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-body text-xs text-text-muted mb-8"
        >
          {t.updated}
        </motion.p>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-body text-[clamp(0.85rem,1.5vw,1.2rem)] text-text-muted leading-[1.8] mb-8"
        >
          {t.intro}
        </motion.p>

        {/* Sections */}
        {t.sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 + i * 0.05 }}
            className="mb-6"
          >
            <h2 className="font-body font-semibold text-sm md:text-base text-black mb-2">
              {section.heading}
            </h2>
            <p className="font-body text-[clamp(0.8rem,1.3vw,1.1rem)] text-text-muted leading-[1.8] whitespace-pre-line">
              {section.body}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
