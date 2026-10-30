import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  Database,
  GraduationCap,
  Layers3,
  MapPin,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  certifications,
  experience,
  profile,
  projects,
  sections,
  skills,
  ui,
} from "../data/content";
import { Button } from "../components/ui/button";
import ProjectVisual from "../components/ProjectVisual";
import Contact from "../components/Contact";
const LiveLab = lazy(() => import("../components/LiveLab"));
const NetworkScene = lazy(() => import("../components/NetworkScene"));
gsap.registerPlugin(ScrollTrigger);
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function Count({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null),
    inView = useInView(ref, { once: true }),
    reduce = useReducedMotion();
  const [n, setN] = useState(value);
  useEffect(() => {
    if (!inView || reduce) return;
    let frame: number;
    const start = performance.now();
    const update = (now: number) => {
      const p = Math.min((now - start) / 1200, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [value, inView, reduce]);
  return (
    <span ref={ref}>
      {n}
      <span className="metric-suffix">{suffix}</span>
    </span>
  );
}
export default function Home({ theme }: { theme: string }) {
  const heroRef = useRef<HTMLElement>(null),
    heroInView = useInView(heroRef);
  const root = useRef<HTMLDivElement>(null),
    reduce = useReducedMotion(),
    [skill, setSkill] = useState(0),
    [webgl, setWebgl] = useState(false),
    [labVisible, setLabVisible] = useState(false);
  const labRef = useRef<HTMLElement>(null),
    labInView = useInView(labRef, { margin: "400px", once: true });
  useEffect(() => {
    if (labInView) setLabVisible(true);
  }, [labInView]);
  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const capable =
      !reduce &&
      matchMedia("(min-width: 1024px)").matches &&
      !connection?.saveData &&
      (navigator.hardwareConcurrency || 4) > 2;
    const timer = setTimeout(() => {
      if (capable) {
        try {
          const canvas = document.createElement("canvas");
          const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
          setWebgl(Boolean(gl));
          gl?.getExtension("WEBGL_lose_context")?.loseContext();
        } catch {
          setWebgl(false);
        }
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, [reduce]);
  useEffect(() => {
    if (reduce) return;
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.to(".portrait-image", {
          y: 24,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
        ScrollTrigger.create({
          trigger: ".experience-aside",
          start: "top 140px",
          endTrigger: ".experience-timeline",
          end: "bottom 65%",
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      },
      root,
    );
    return () => mm.revert();
  }, [reduce]);
  return (
    <div ref={root}>
      <section
        ref={heroRef}
        className="hero container"
        aria-labelledby="hero-title"
      >
        <div className="hero-grid">
          <motion.div
            className="hero-copy"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="availability hero-availability">
              <span className="status-dot" />
              {ui.available}
            </div>
            <p className="eyebrow hero-eyebrow">{ui.heroEyebrow}</p>
            <h1 id="hero-title">
              {profile.headline[0]}
              <br />
              {profile.headline[1]}
              <br />
              <em>{profile.headline[2]}</em>
              <span className="headline-star">✳</span>
            </h1>
            <p className="hero-description">{profile.introduction}</p>
            <div className="hero-ctas">
              <Button asChild>
                <Link className="magnetic" to="/#work">
                  {ui.work}
                  <ArrowUpRight size={18} />
                </Link>
              </Button>
              <a href={profile.resume} download className="resume-link">
                {ui.resume}
                <ArrowDownToLine size={16} />
              </a>
            </div>
            <div className="hero-person">
              <span className="person-line" />
              <div>
                <strong>{profile.name}</strong>
                <span>{profile.role}</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="hero-art"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <div className="art-coordinate mono">
              25.2048° N &nbsp; 55.2708° E <span>DUBAI, UAE</span>
            </div>
            <div className="portrait-frame">
              <picture>
                <source
                  srcSet="/images/fayaz-portrait-640.avif 640w, /images/fayaz-portrait.avif 1100w"
                  sizes="(max-width: 767px) 85vw, 40vw"
                  type="image/avif"
                />
                <img
                  className="portrait-image"
                  src="/images/fayaz-portrait-1100.webp"
                  srcSet="/images/fayaz-portrait-640.webp 640w, /images/fayaz-portrait-1100.webp 1100w"
                  sizes="(max-width: 767px) 85vw, 40vw"
                  width="1100"
                  height="1375"
                  alt="Fayaz in a navy suit beside the Dubai waterfront at night; photo adapted from supplied portrait"
                  fetchPriority="high"
                />
              </picture>
              <div className="portrait-shade" />
              <div className="portrait-grid" />
              <div className="portrait-caption">
                <span className="status-dot" />
                <span>THE HUMAN BEHIND THE DATA</span>
              </div>
            </div>
            <div className="network-layer">
              {webgl && heroInView && (
                <SceneBoundary>
                  <Suspense fallback={null}>
                    <NetworkScene theme={theme} />
                  </Suspense>
                </SceneBoundary>
              )}
            </div>
            <div className="floating-insight">
              <div className="insight-icon">
                <Activity size={22} />
              </div>
              <div>
                <span>From complexity to clarity.</span>
                <strong>One insight at a time.</strong>
              </div>
              <svg viewBox="0 0 74 30" aria-hidden="true">
                <path
                  d="M0 23h14l5-10 7 15 10-26 9 20h10l5-9 5 10h9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </div>
            <div className="portrait-side-note mono">
              ANALYTICS WITH PURPOSE — 001
            </div>
            <div className="art-corner corner-top" />
            <div className="art-corner corner-bottom" />
          </motion.div>
        </div>
        <div className="hero-bottom">
          <span>
            <MapPin size={13} />
            {ui.heroCaption}
          </span>
          <a href="#impact">
            SCROLL TO DISCOVER <ArrowDown size={13} />
          </a>
        </div>
      </section>
      <section id="impact" className="metrics-section">
        <div className="container metrics-grid">
          <div className="metrics-intro">
            <span className="eyebrow">
              LESS NOISE.
              <br />
              MORE IMPACT.
            </span>
            <Activity size={28} />
          </div>
          {profile.metrics.map((m) => (
            <div className="metric" key={m.label} title={m.source}>
              <strong>
                <Count value={m.value} suffix={m.suffix} />
              </strong>
              <h2>{m.label}</h2>
              <p>{m.detail}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="work" className="section container">
        <div className="section-heading">
          <span className="eyebrow">
            <span className="section-number">01 /</span> SELECTED WORK
          </span>
          <span className="section-meta">A FEW WAYS I CONNECT THE DOTS</span>
        </div>
        <div className="section-title-row">
          <h2>
            {sections.work.title}
            <br />
            <em>{sections.work.emphasis}</em>
          </h2>
          <p>{sections.work.description}</p>
        </div>
        <div className="projects-grid">
          {projects.map((p) => (
            <Link
              to={`/projects/${p.slug}`}
              className={`project-card project-${p.visual}`}
              key={p.slug}
            >
              <ProjectVisual type={p.visual} />
              <div className="project-details">
                <div className="project-eyebrow">
                  <span>
                    {p.number} / {p.category}
                  </span>
                  <span>{p.kind}</span>
                </div>
                <h3>
                  {p.title}
                  <ArrowUpRight size={24} />
                </h3>
                <p>{p.description}</p>
                <div className="tags">
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="work-note">
          <ShieldCheck size={15} />
          <span>{sections.work.note}</span>
        </div>
      </section>
      <section id="about" className="section about-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">
              <span className="section-number">02 /</span> A LITTLE CONTEXT
            </span>
            <span className="section-meta">
              THE PERSON, NOT JUST THE PROFILE
            </span>
          </div>
          <div className="about-grid">
            <div className="about-heading">
              <h2>
                {sections.about.title}
                <br />
                <em>{sections.about.emphasis}</em>
              </h2>
              <p className="about-intro">{profile.summary}</p>
              <div className="about-location">
                <MapPin size={15} />
                Dubai, United Arab Emirates <span>↗</span>
              </div>
            </div>
            <div className="about-story">
              <p>{profile.about}</p>
              <p>{profile.philosophy}</p>
              <div className="education-card">
                <GraduationCap size={24} />
                <div>
                  <h3>{profile.education.degree}</h3>
                  <p>{profile.education.school}</p>
                  <span>
                    {profile.education.year} · {profile.education.location}
                  </span>
                </div>
                <ArrowUpRight size={17} />
              </div>
            </div>
          </div>
          <div className="process-block">
            <span className="eyebrow">HOW I WORK</span>
            <div className="process-steps">
              {sections.process
                .map((p, i) => ({ ...p, icon: [Braces, Database, Layers3][i] }))
                .map((p, i) => (
                  <div key={p.title}>
                    <span className="process-index">0{i + 1}</span>
                    <p.icon size={19} />
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
      <section id="skills" className="section container">
        <div className="section-heading">
          <span className="eyebrow">
            <span className="section-number">03 /</span> THE TOOLKIT
          </span>
          <span className="section-meta">
            CHOSEN FOR THE PROBLEM. NOT THE TREND.
          </span>
        </div>
        <div className="skills-grid">
          <div>
            <h2>
              {sections.skills.title}
              <br />
              <em>{sections.skills.emphasis}</em>
            </h2>
            <p className="section-subtitle">{sections.skills.description}</p>
            <div
              className="skill-tabs"
              role="tablist"
              aria-label="Skill categories"
            >
              {skills.map((s, i) => (
                <button
                  id={`skill-tab-${i}`}
                  role="tab"
                  aria-selected={skill === i}
                  tabIndex={skill === i ? 0 : -1}
                  onKeyDown={(e) => {
                    if (
                      ["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)
                    ) {
                      e.preventDefault();
                      const next =
                        e.key === "Home"
                          ? 0
                          : e.key === "End"
                            ? skills.length - 1
                            : (i +
                                (e.key === "ArrowRight" ? 1 : -1) +
                                skills.length) %
                              skills.length;
                      setSkill(next);
                      document.getElementById(`skill-tab-${next}`)?.focus();
                    }
                  }}
                  aria-controls={`skill-panel-${i}`}
                  key={s.label}
                  onClick={() => setSkill(i)}
                >
                  <span>0{i + 1}</span>
                  {s.label}
                  <ArrowUpRight size={16} />
                </button>
              ))}
            </div>
          </div>
          <div
            className="skill-panel"
            id={`skill-panel-${skill}`}
            role="tabpanel"
            aria-labelledby={`skill-tab-${skill}`}
          >
            <div className="skill-panel-heading">
              <span className="eyebrow">{skills[skill].label}</span>
              <Plus size={18} />
            </div>
            <p>{skills[skill].description}</p>
            {skills[skill].tools.map((t, i) => (
              <div className="skill-tool" key={t.name}>
                <span className="tool-index">0{i + 1}</span>
                <div>
                  <h3>{t.name}</h3>
                  <p>{t.context}</p>
                </div>
                <Check size={16} />
              </div>
            ))}
            <div className="skill-footnote">{sections.skills.footnote}</div>
          </div>
        </div>
      </section>
      <section id="experience" className="section experience-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">
              <span className="section-number">04 /</span> THE JOURNEY SO FAR
            </span>
            <span className="section-meta">LEARNING THROUGH DOING</span>
          </div>
          <div className="experience-layout">
            <div className="experience-aside">
              <h2>
                {sections.experience.title}
                <br />
                <em>{sections.experience.emphasis}</em>
              </h2>
              <p>{sections.experience.description}</p>
              <a href={profile.resume} download className="text-link">
                The full story <ArrowDownToLine size={15} />
              </a>
            </div>
            <div className="experience-timeline">
              {experience.map((e, i) => (
                <article className="experience-item" key={e.company}>
                  <span className={`timeline-dot ${i === 0 ? "active" : ""}`} />
                  <div className="experience-meta">
                    <span className="eyebrow">{e.period}</span>
                    <span className="tiny-pill">{e.type}</span>
                  </div>
                  <h3>{e.title}</h3>
                  {e.subtitle && (
                    <p className="experience-subtitle">{e.subtitle}</p>
                  )}
                  <p className="experience-company">
                    {e.company}
                    <span>{e.location}</span>
                  </p>
                  <ul>
                    {e.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <div className="tags">
                    {e.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </article>
              ))}
              <div className="certifications">
                <span className="eyebrow">ALWAYS ADDING TO THE TOOLKIT</span>
                {certifications.map((c) => (
                  <p key={c}>
                    <ShieldCheck size={15} />
                    {c}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="lab" className="section container lab-section" ref={labRef}>
        <div className="section-heading">
          <span className="eyebrow">
            <span className="section-number">05 /</span> THE LIVE LAB
          </span>
          <span className="sample-badge">
            <span className="status-dot" /> LESS SCROLLING. MORE EXPLORING.
          </span>
        </div>
        <div className="section-title-row">
          <h2>
            {sections.lab.title}
            <br />
            <em>{sections.lab.emphasis}</em>
          </h2>
          <p>{sections.lab.description}</p>
        </div>
        {labVisible ? (
          <Suspense fallback={<DashboardSkeleton />}>
            <LiveLab />
          </Suspense>
        ) : (
          <DashboardSkeleton />
        )}
        <div className="lab-caption">
          <span>01 — Filter by department</span>
          <span>02 — Compare time periods</span>
          <span>
            03 — Take the sample with you <ArrowDownToLine size={13} />
          </span>
        </div>
      </section>
      <div className="container">
        <Contact />
      </div>
    </div>
  );
}
export function DashboardSkeleton() {
  return (
    <div
      className="dashboard-skeleton"
      role="status"
      aria-label="Loading interactive dashboard"
    >
      <div />
      <div />
      <div />
      <span>Preparing the observatory…</span>
    </div>
  );
}
