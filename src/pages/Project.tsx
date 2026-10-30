import { lazy, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { projects, profile } from "../data/content";
import ProjectVisual from "../components/ProjectVisual";
import { Button } from "../components/ui/button";
const LiveLab = lazy(() => import("../components/LiveLab"));
export default function Project() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  if (!project)
    return (
      <div className="container not-found">
        <span className="eyebrow">404 / OUTSIDE THE OBSERVATORY</span>
        <h1>No data at this address.</h1>
        <p>This case study couldn’t be found.</p>
        <Button asChild>
          <Link to="/#work">
            Back to selected work <ArrowLeft size={17} />
          </Link>
        </Button>
      </div>
    );
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <article className="case-study container">
      <Helmet>
        <title>{project.title} — Muhammed Fayaz</title>
        <meta name="description" content={project.description} />
        <meta
          property="og:title"
          content={`${project.title} — Muhammed Fayaz`}
        />
        <meta property="og:description" content={project.description} />
      </Helmet>
      <Link className="case-back text-link" to="/#work">
        <ArrowLeft size={15} />
        Back to selected work
      </Link>
      <div className="case-heading">
        <span className="eyebrow">
          {project.number} / {project.category} · {project.year}
        </span>
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        <div className="tags">
          {project.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
          <span>{project.kind}</span>
        </div>
      </div>
      <ProjectVisual type={project.visual} large />
      <div className="case-body">
        <aside>
          <span className="eyebrow">AT A GLANCE</span>
          <strong>{project.stat}</strong>
          <p>{project.statLabel}</p>
          <div className="case-disclaimer">
            <ShieldCheck size={18} />
            <p>
              {project.kind === "Interactive concept"
                ? "Self-directed portfolio demonstration. Synthetic data only."
                : "Based on the supplied résumé. Visuals are illustrative reconstructions."}
            </p>
          </div>
        </aside>
        <div className="case-narrative">
          {[
            ["01", "The question.", project.problem],
            ["02", "Data & approach.", project.approach],
            ["03", "Making it useful.", project.solution],
            ["04", "The outcome.", project.impact],
          ].map(([n, title, text]) => (
            <section key={n}>
              <span className="eyebrow">{n} /</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </section>
          ))}
        </div>
      </div>
      {project.visual === "healthcare" && (
        <section className="case-demo">
          <span className="eyebrow">EXPLORE THE WORKING DEMONSTRATION</span>
          <Suspense
            fallback={
              <div className="dashboard-skeleton" role="status">
                Loading dashboard…
              </div>
            }
          >
            <LiveLab />
          </Suspense>
        </section>
      )}
      <div className="case-end">
        <div>
          <span className="eyebrow">A SIMILAR QUESTION ON YOUR MIND?</span>
          <a className="text-link" href={`mailto:${profile.email}`}>
            Let’s work through it <ArrowUpRight size={18} />
          </a>
        </div>
        <Link to={`/projects/${next.slug}`}>
          <span className="eyebrow">NEXT EXPLORATION</span>
          <h3>
            {next.title}
            <ArrowRight size={23} />
          </h3>
        </Link>
      </div>
    </article>
  );
}
