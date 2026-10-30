import { Link } from "react-router-dom";
import { ArrowDown, ArrowDownToLine, ArrowUpRight } from "lucide-react";
import { profile, studioContent } from "../data/content";
import { Button } from "./ui/button";
import SignalBoard from "./SignalBoard";
export default function StudioHero() {
  return (
    <section className="studio-hero container" aria-labelledby="hero-title">
      <div className="studio-hero-grid">
        <div className="studio-intro">
          <div className="studio-person">
            <img
              src="/images/fayaz-avatar.webp"
              width="44"
              height="44"
              alt="Muhammed Fayaz"
              fetchPriority="high"
            />
            <div>
              <strong>{profile.name}</strong>
              <span>{profile.role}</span>
            </div>
            <span className="studio-available" title="Open to opportunities" />
          </div>
          <p className="eyebrow studio-eyebrow">{studioContent.eyebrow}</p>
          <h1 id="hero-title">
            {studioContent.headline[0]}
            <br />
            <span>{studioContent.headline[1]}</span>
          </h1>
          <p className="studio-lead">{studioContent.description}</p>
          <div className="studio-actions">
            <Button asChild>
              <Link to="/#work">
                Explore selected work
                <ArrowUpRight size={18} />
              </Link>
            </Button>
            <a className="studio-resume" href={profile.resume} download>
              Download résumé
              <ArrowDownToLine size={15} />
            </a>
          </div>
          <div className="studio-specialties">
            {studioContent.specialties.map((skill, i) => (
              <span key={skill}>
                {i > 0 && <i />}
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="studio-preview">
          <div className="studio-preview-caption">
            <span>01 / A SMALL WORKING EXAMPLE</span>
            <span>TRY THE FILTER ↘</span>
          </div>
          <SignalBoard />
          <div className="studio-preview-footer">
            <span>{studioContent.previewNote}</span>
            <a href="#lab">
              Open the full lab <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>
      <div className="studio-impact">
        <div className="studio-impact-label">
          <span className="eyebrow">FROM THE WORK</span>
          <span>
            Concrete outcomes,
            <br />
            clear foundations.
          </span>
        </div>
        {profile.metrics.map((m) => (
          <div className="studio-impact-metric" key={m.label}>
            <strong>
              {m.value}
              <span>{m.suffix}</span>
            </strong>
            <div>
              <h2>{m.label}</h2>
              <p>{m.detail}</p>
            </div>
          </div>
        ))}
        <a
          className="studio-down"
          href="#work"
          aria-label="Scroll to selected work"
        >
          <ArrowDown size={19} />
        </a>
      </div>
    </section>
  );
}
