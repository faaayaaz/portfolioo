import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { Navigation } from "./components/Navigation";
import { profile, themes, type Theme, ui } from "./data/content";
import { Button } from "./components/ui/button";
const Home = lazy(() => import("./pages/Home"));
const Project = lazy(() => import("./pages/Project"));
function RouteScroll() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      let tries = 0;
      const timer = setInterval(() => {
        const el = document.getElementById(location.hash.slice(1));
        if (el) {
          el.scrollIntoView({
            behavior: "instant",
          });
          clearInterval(timer);
        }
        if (++tries > 40) clearInterval(timer);
      }, 80);
      return () => clearInterval(timer);
    } else window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}
function ScrollUI() {
  const bar = useRef<HTMLDivElement>(null),
    [show, setShow] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = document.documentElement.scrollHeight - innerHeight;
      const progress = height > 0 ? scrollY / height : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
      setShow((old) => (old === progress > 0.15 ? old : progress > 0.15));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <>
      <div
        ref={bar}
        className="scroll-progress"
        style={{ transform: "scaleX(0)" }}
      />
      {show && (
        <button
          className="back-top icon-button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
}
export default function App({ siteOrigin }: { siteOrigin?: string }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const current =
      typeof document !== "undefined"
        ? document.documentElement.dataset.theme
        : "observatory";
    return themes.some((t) => t.id === current)
      ? (current as Theme)
      : "observatory";
  });
  const location = useLocation();
  const setTheme = (t: Theme) => {
    document.documentElement.dataset.theme = t;
    setThemeState(t);
    try {
      localStorage.setItem("fayaz-theme", t);
    } catch {}
  };
  const site = (
    siteOrigin ||
    import.meta.env.VITE_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")
  ).replace(/\/$/, "");
  return (
    <>
      <Helmet>
        <title>{ui.siteTitle}</title>
        <meta name="description" content={profile.introduction} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={ui.siteTitle} />
        <meta property="og:description" content={profile.introduction} />
        <meta property="og:image" content={`${site}/og-image.png`} />
        <meta property="og:url" content={`${site}${location.pathname}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ui.siteTitle} />
        <meta name="twitter:description" content={profile.introduction} />
        <meta name="twitter:image" content={`${site}/og-image.png`} />
        <link rel="canonical" href={`${site}${location.pathname}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: profile.name,
            jobTitle: profile.role,
            url: site,
            email: profile.email,
            sameAs: [profile.linkedin, profile.github],
            knowsAbout: ["Power BI", "SQL", "Healthcare analytics", "ETL"],
            workLocation: { "@type": "Place", name: profile.location },
            alumniOf: {
              "@type": "EducationalOrganization",
              name: "P.A. College of Engineering, VTU",
            },
          })}
        </script>
      </Helmet>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollUI />
      <Navigation theme={theme} setTheme={setTheme} />
      <main id="main">
        <RouteScroll />
        <Suspense
          fallback={
            <div className="page-loading container" role="status">
              <span className="status-dot" />
              Loading the portfolio…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<Project />} />
            <Route
              path="*"
              element={
                <div className="not-found container">
                  <span className="eyebrow">404 / NO SIGNAL HERE</span>
                  <h1>
                    Let’s get you back
                    <br />
                    to the bigger picture.
                  </h1>
                  <Button asChild>
                    <Link to="/">
                      Back to the portfolio <ArrowUpRight size={18} />
                    </Link>
                  </Button>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <footer className="site-footer container">
        <Link to="/" className="brand">
          <span className="brand-mark">
            f<span>·</span>
          </span>
          <span>
            fayaz<span className="brand-dot">.</span>
          </span>
        </Link>
        <p>{ui.footer}</p>
        <span className="mono">
          © {new Date().getFullYear()} MUHAMMED FAYAZ
        </span>
        <a
          href="#main"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({
              top: 0,
              behavior: "instant",
            });
          }}
          aria-label="Back to top"
        >
          <ArrowUp size={17} />
        </a>
      </footer>
    </>
  );
}
