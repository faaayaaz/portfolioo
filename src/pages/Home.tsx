import { lazy, Suspense, useState } from "react";
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
import {
  certifications,
  experience,
  profile,
  sections,
  skills,
} from "../data/content";
import Contact from "../components/Contact";
import StudioHero from "../components/StudioHero";
import ProjectExplorer from "../components/ProjectExplorer";
const LiveLab = lazy(() => import("../components/LiveLab"));
export default function Home() {
  const [skill, setSkill] = useState(0),
    [labVisible, setLabVisible] = useState(false);
  return (
    <div className="studio-home">
      <StudioHero />
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
        <ProjectExplorer />
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
              <div className="about-person-card">
                <img
                  src="/images/fayaz-avatar.webp"
                  width="76"
                  height="76"
                  loading="lazy"
                  alt="Muhammed Fayaz"
                />
                <div>
                  <span className="eyebrow">A LITTLE ABOUT ME</span>
                  <strong>Muhammed Fayaz</strong>
                  <span>Analyst. Builder. Curious by default.</span>
                </div>
              </div>
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
      <section id="lab" className="section container lab-section">
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
          <div className="lab-invitation">
            <div>
              <span className="eyebrow">GO DEEPER</span>
              <h3>Your questions. A working dashboard.</h3>
              <p>
                Explore department filters, compare reporting periods, switch
                metrics, and export the selected sample data.
              </p>
              <span className="lab-sample-note">
                Synthetic healthcare data · No confidential records
              </span>
            </div>
            <button
              className="button button-primary"
              onClick={() => setLabVisible(true)}
            >
              Open interactive dashboard
              <ArrowUpRight size={17} />
            </button>
          </div>
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
      <span>Loading the dashboard…</span>
    </div>
  );
}
