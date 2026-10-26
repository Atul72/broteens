export const siteConfig = {
  name: "Reachdesk",
  shortName: "Reachdesk",
  title: "Reachdesk - Email & WhatsApp Marketing Platform",
  titleTemplate: "%s | Reachdesk",
  description:
    "Turn contacts into customers. Reachdesk helps businesses create, send, and automate high-converting email and verified WhatsApp campaigns from one powerful workspace.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://reachdesk.broteens.com",
  ogImage: "/opengraph-image",
  keywords: [
    "WhatsApp Marketing",
    "WhatsApp Business API",
    "Email Marketing Platform",
    "Marketing Automation",
    "Reachdesk",
    "Omnichannel Outreach",
    "Bulk WhatsApp Sender",
    "WhatsApp Template Builder",
    "Email Campaign Software",
    "Customer Engagement Platform",
    "Broadcast Messaging",
    "Contact List Management",
    "B2B Outreach",
    "WhatsApp API Integration",
  ],
  author: {
    name: "Reachdesk Team",
    url: "https://reachdesk.broteens.com",
  },
  links: {
    twitter: "https://twitter.com/reachdesk",
    github: "https://github.com/broteens",
    linkedin: "https://www.linkedin.com/company/reachdesk",
  },
  themeColor: "#8646D8",
};

/**
 * Generates Schema.org Organization structured data.
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/favicon.svg`,
    description: siteConfig.description,
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.linkedin,
      siteConfig.links.github,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      availableLanguage: ["English", "Hindi"],
    },
  };
}

/**
 * Generates Schema.org WebApplication / SoftwareApplication structured data.
 */
export function getWebApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    browserRequirements: "Requires modern web browser with JavaScript enabled",
    description: siteConfig.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      category: "Free Tier Available",
    },
    featureList: [
      "Official WhatsApp Business Cloud API Integration",
      "Interactive WhatsApp Message Template Builder",
      "Email Broadcast Campaign Management",
      "Contact List Import & Validation (CSV / Excel)",
      "Real-Time Delivery & Read Receipt Analytics",
      "Automated Compliance & Opt-Out Handling",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "128",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

/**
 * Generates Schema.org BreadcrumbList structured data for rich SERP navigation.
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${siteConfig.url}${item.url}`,
    })),
  };
}

/**
 * Generates Schema.org FAQPage structured data for rich FAQ search snippets.
 */
export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
