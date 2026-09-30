import type { CrawlConfig } from "@broteens/contracts";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";

export interface ExtractedLink {
  url: string;
  anchorText: string | null;
}

export interface ExtractedPage {
  title: string | null;
  description: string | null;
  author: string | null;
  language: string | null;
  markdown: string;
  textContent: string;
  links: ExtractedLink[];
}

function cleanText(value: string | null | undefined): string | null {
  const cleaned = value?.replace(/\s+/g, " ").trim();
  return cleaned ? cleaned : null;
}

function extractLinks(document: Document, pageUrl: string): ExtractedLink[] {
  const unique = new Map<string, ExtractedLink>();

  for (const anchor of document.querySelectorAll<HTMLAnchorElement>(
    "a[href]",
  )) {
    try {
      const url = new URL(anchor.getAttribute("href") ?? "", pageUrl);
      if (url.protocol !== "http:" && url.protocol !== "https:") continue;

      const value = url.toString();
      if (!unique.has(value)) {
        unique.set(value, {
          url: value,
          anchorText: cleanText(anchor.textContent),
        });
      }
    } catch {
      // Invalid or incomplete links are ignored.
    }
  }

  return [...unique.values()];
}

export function extractPage(
  html: string,
  pageUrl: string,
  config: Pick<
    CrawlConfig,
    "includeImages" | "includeLinks" | "useMainContentOnly"
  >,
): ExtractedPage {
  const dom = new JSDOM(html, { url: pageUrl });
  const document = dom.window.document;
  const links = extractLinks(document, pageUrl);

  const description = cleanText(
    document.querySelector<HTMLMetaElement>('meta[name="description"]')
      ?.content ??
      document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
        ?.content,
  );

  let title = cleanText(document.title);
  let author = cleanText(
    document.querySelector<HTMLMetaElement>('meta[name="author"]')?.content,
  );
  let language = cleanText(document.documentElement.lang);
  let contentRootHtml = document.body?.innerHTML ?? html;
  let textContent = cleanText(document.body?.textContent) ?? "";

  if (config.useMainContentOnly) {
    const article = new Readability(
      document.cloneNode(true) as Document,
    ).parse();
    if (article) {
      title = cleanText(article.title) ?? title;
      author = cleanText(article.byline) ?? author;
      language = cleanText(article.lang) ?? language;
      contentRootHtml = article.content ?? contentRootHtml;
      textContent = cleanText(article.textContent) ?? textContent;
    }
  }

  const contentDom = new JSDOM(`<body>${contentRootHtml}</body>`, {
    url: pageUrl,
  });
  const contentDocument = contentDom.window.document;

  for (const element of contentDocument.querySelectorAll(
    "script, style, noscript, template, svg",
  )) {
    element.remove();
  }

  if (!config.includeImages) {
    for (const image of contentDocument.querySelectorAll(
      "img, picture, source",
    )) {
      image.remove();
    }
  }

  if (!config.includeLinks) {
    for (const anchor of contentDocument.querySelectorAll("a")) {
      anchor.replaceWith(...anchor.childNodes);
    }
  }

  const turndown = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
  });

  const markdown = turndown
    .turndown(contentDocument.body.innerHTML)
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return {
    title,
    description,
    author,
    language,
    markdown,
    textContent,
    links,
  };
}
