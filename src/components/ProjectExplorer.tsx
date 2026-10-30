import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "../data/content";
import ProjectVisual from "./ProjectVisual";
export default function ProjectExplorer() {
  const [index, setIndex] = useState(0);
  const project = projects[index];
  return (
    <div className="work-browser">
      <div
        className="work-index"
        role="tablist"
        aria-label="Explore projects"
        aria-orientation="vertical"
      >
        {projects.map((p, i) => (
          <button
            role="tab"
            aria-selected={index === i}
            aria-controls="project-preview"
            id={`project-tab-${i}`}
            key={p.slug}
            onClick={() => setIndex(i)}
            tabIndex={index === i ? 0 : -1}
            onKeyDown={(e) => {
              if (
                [
                  "ArrowUp",
                  "ArrowDown",
                  "ArrowLeft",
                  "ArrowRight",
                  "Home",
                  "End",
                ].includes(e.key)
              ) {
                e.preventDefault();
                const next =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? 3
                      : (i +
                          (["ArrowDown", "ArrowRight"].includes(e.key)
                            ? 1
                            : 3)) %
                        4;
                setIndex(next);
                document.getElementById(`project-tab-${next}`)?.focus();
              }
            }}
          >
            <span className="work-index-number">{p.number}</span>
            <span>
              <small>{p.category}</small>
              <strong>{p.label}</strong>
              <em>
                {p.kind} · {p.year}
              </em>
            </span>
            <ArrowUpRight size={19} />
          </button>
        ))}
        <p className="work-index-note">
          Four projects.
          <br />
          Different questions. Practical answers.
        </p>
      </div>
      <div
        id="project-preview"
        role="tabpanel"
        aria-labelledby={`project-tab-${index}`}
        className={`work-preview preview-${project.visual}`}
      >
        <div className="work-preview-art">
          <ProjectVisual type={project.visual} large />
          <span>
            {project.kind} / {project.year} · Illustrative visual
          </span>
        </div>
        <div className="work-preview-copy">
          <div className="work-copy-top">
            <div>
              <span className="eyebrow">{project.category}</span>
              <h3>{project.title}</h3>
            </div>
            <div className="work-proof">
              <strong>{project.stat}</strong>
              <span>{project.statLabel}</span>
            </div>
          </div>
          <p>{project.description}</p>
          <div className="work-copy-bottom">
            <div className="tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <Link className="work-case-link" to={`/projects/${project.slug}`}>
              Read the case study
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
