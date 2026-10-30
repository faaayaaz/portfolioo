import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Cpu,
  Stethoscope,
  Users,
} from "lucide-react";
import { projects } from "../data/content";
import { worldContent } from "../data/world";
import ProjectVisual from "./ProjectVisual";
const icons = [Stethoscope, BrainCircuit, Users, Cpu];
export default function ProjectExplorer() {
  const [index, setIndex] = useState(0);
  const project = projects[index],
    station = worldContent.stations[index];
  return (
    <div className="project-explorer">
      <div
        className="explorer-tabs"
        role="tablist"
        aria-label="Explore projects"
      >
        {worldContent.stations.map((s, i) => {
          const Icon = icons[i];
          return (
            <button
              role="tab"
              aria-selected={index === i}
              aria-controls="project-preview"
              id={`project-tab-${i}`}
              key={s.id}
              onClick={() => setIndex(i)}
              tabIndex={index === i ? 0 : -1}
              onKeyDown={(e) => {
                if (
                  ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                ) {
                  e.preventDefault();
                  const next =
                    e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? 3
                        : (i + (e.key === "ArrowRight" ? 1 : 3)) % 4;
                  setIndex(next);
                  document.getElementById(`project-tab-${next}`)?.focus();
                }
              }}
            >
              <span>{s.number}</span>
              <Icon size={17} />
              {s.name}
              <ArrowUpRight size={14} />
            </button>
          );
        })}
      </div>
      <div
        id="project-preview"
        role="tabpanel"
        aria-labelledby={`project-tab-${index}`}
        className={`explorer-preview preview-${project.visual}`}
      >
        <div className="explorer-visual">
          <ProjectVisual type={project.visual} large />
          <span className="explorer-stamp">
            {project.kind} / {project.year}
          </span>
        </div>
        <div className="explorer-story">
          <div className="explorer-project-meta">
            <span>{station.category}</span>
            <span>0{index + 1} / 04</span>
          </div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="explorer-proof">
            <strong>{project.stat}</strong>
            <span>{project.statLabel}</span>
          </div>
          <div className="tags">
            {project.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <Link
            className="explorer-case-link magnetic"
            to={`/projects/${project.slug}`}
          >
            Step inside the project
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </div>
      <div className="explorer-footer">
        <span>Four explorations. Follow whichever question interests you.</span>
        <div>
          <button
            aria-label="Previous project"
            onClick={() => setIndex((i) => (i + 3) % 4)}
          >
            <ArrowLeft size={17} />
          </button>
          <button
            aria-label="Next project"
            onClick={() => setIndex((i) => (i + 1) % 4)}
          >
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
