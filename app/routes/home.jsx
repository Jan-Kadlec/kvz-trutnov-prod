import { useState, useEffect } from "react";
import Header from "../components/header";
import AboutSection from "../components/AboutSection";
import HeroSection from "../components/HeroSection";
import NewsSection from "../components/NewsSection";
import RangesSection from "../components/RangesSection";
import EventsSection from "../components/EventsSection";
import ResultsSection from "../components/ResultSection";
import ContactSection from "../components/ContactSection";

function App() {
  const [currentSection, setCurrentSection] = useState("home");

  const handleNavigate = (sectionId) => {
    setCurrentSection(sectionId);
    const element = document.getElementById(sectionId);

    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "news",
        "ranges",
        "events",
        "results",
        "contact",
      ];

      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);

        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setCurrentSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update title & meta description when user navigates between sections
  useEffect(() => {
    const siteName = "KVZ TRUTNOV 2";
    const sectionMeta = {
      home: {
        title: `${siteName} — Úvod | Sportovní střelba Trutnov`,
        description:
          "KVZ Trutnov 2 – úvod. Informace o klubu, akcích, střelnicích a výsledcích. Přidejte se k nám.",
      },
      about: {
        title: `${siteName} — O klubu | Historie a poslání`,
        description:
          "O klubu KVZ Trutnov 2. Historie klubu, mise a aktivity v oblasti sportovní střelby.",
      },
      news: {
        title: `${siteName} — Aktuality | Novinky a oznámení`,
        description:
          "Poslední novinky, články a oznámení z klubu KVZ Trutnov 2.",
      },
      ranges: {
        title: `${siteName} — Střelnice | Kde trénujeme`,
        description:
          "Přehled střelnic a areálů, které klub pravidelně využívá v regionu.",
      },
      events: {
        title: `${siteName} — Akce | Kalendář a registrace`,
        description:
          "Kalendář nadcházejících akcí, soutěží a soustředění klubu.",
      },
      results: {
        title: `${siteName} — Výsledky & Foto | Archiv soutěží`,
        description:
          "Archiv výsledků, propozic a fotografií z minulých akcí klubu.",
      },
      contact: {
        title: `${siteName} — Kontakt | Jak nás kontaktovat`,
        description:
          "Kontaktní informace klubu KVZ Trutnov 2 a dostupnost pro dotazy a členství.",
      },
    };

    const meta = sectionMeta[currentSection] || sectionMeta.home;
    document.title = meta.title;
    const desc = document.head.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", meta.description);
    const ogTitle = document.head.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", meta.title);
    const ogDesc = document.head.querySelector(
      'meta[property="og:description"]',
    );
    if (ogDesc) ogDesc.setAttribute("content", meta.description);
  }, [currentSection]);

  // SEO: set page title, meta description, Open Graph tags and JSON-LD structured data
  useEffect(() => {
    const siteName = "KVZ TRUTNOV 2";
    const pageTitle = `${siteName} — Klub vojáků v záloze | Sportovní střelba a akce`;
    const pageDescription =
      "KVZ Trutnov 2 - Klub vojáků v záloze. Sportovní střelba, soutěže a akce v Královéhradeckém kraji. Připojte se k našim tréninkům a soutěžím.";

    document.title = pageTitle;

    function upsertMeta(selector, attrs) {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k]));
        document.head.appendChild(el);
      } else {
        Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k]));
      }
      return el;
    }

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: pageDescription,
    });

    // Open Graph
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: pageTitle,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: pageDescription,
    });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: window.location.origin + "/hero-background.jpg",
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: window.location.origin + "/hero-background.jpg",
    });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: window.location.href,
    });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: pageTitle,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: pageDescription,
    });

    // JSON-LD: Organization + dynamic articles/events extracted from DOM
    const buildJSONLD = () => {
      const graph = [];

      // Organization
      graph.push({
        "@type": "Organization",
        name: "KVZ TRUTNOV 2",
        url: window.location.origin,
        sameAs: [window.location.origin],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+420 123 456 789",
            contactType: "customer service",
            areaServed: "CZ",
            availableLanguage: ["cs-CZ"],
          },
        ],
      });

      // News articles
      const articles = Array.from(document.querySelectorAll("#news article"))
        .map((el) => {
          const titleEl = el.querySelector("h3");
          const timeEl = el.querySelector("time");
          const imgEl = el.querySelector("img");
          return {
            "@type": "NewsArticle",
            headline: titleEl ? titleEl.textContent.trim() : undefined,
            datePublished: timeEl ? timeEl.getAttribute("datetime") : undefined,
            image: imgEl ? imgEl.getAttribute("src") : undefined,
            mainEntityOfPage: window.location.href,
          };
        })
        .filter((a) => a.headline);

      graph.push(...articles);

      // Events
      const events = Array.from(
        document.querySelectorAll("#events [data-event-id]"),
      )
        .map((el) => {
          return {
            "@type": "Event",
            name: el.getAttribute("data-event-title") || undefined,
            startDate: el.getAttribute("data-event-date") || undefined,
            location: {
              "@type": "Place",
              name: el.getAttribute("data-event-location") || undefined,
            },
          };
        })
        .filter((e) => e.name);

      graph.push(...events);

      return { "@context": "https://schema.org", "@graph": graph };
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "structured-data-jsonld";
    script.text = JSON.stringify(buildJSONLD());
    document.head.appendChild(script);

    // update JSON-LD later once content is rendered (news/events)
    const timeout = setTimeout(() => {
      const existing = document.getElementById("structured-data-jsonld");
      if (existing) existing.textContent = JSON.stringify(buildJSONLD());
    }, 1200);

    return () => {
      clearTimeout(timeout);
      const s = document.getElementById("structured-data-jsonld");
      if (s) s.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-military-900">
      <Header onNavigate={handleNavigate} currentSection={currentSection} />

      <main className="pt-20">
        <HeroSection onNavigate={handleNavigate} />
        <AboutSection />
        <NewsSection />
        <RangesSection />
        <EventsSection />
        <ResultsSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
