import { useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Github,
  Linkedin,
  Mail,
  Send,
} from "lucide-react";
import { profile, sections } from "../data/content";
import { Button } from "./ui/button";
export default function Contact() {
  const [draftUrl, setDraftUrl] = useState(`mailto:${profile.email}`);
  const [state, setState] = useState<
      "idle" | "sending" | "sent" | "draft" | "error"
    >("idle"),
    [error, setError] = useState("");
  const started = useRef(Date.now());
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setState("sending");
    setError("");
    const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(`Portfolio inquiry from ${values.name}`)}&body=${encodeURIComponent(`${values.message}\n\nFrom: ${values.name}\nEmail: ${values.email}`)}`;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, startedAt: started.current }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to prepare your message.");
      if (result.mode === "sent") {
        setState("sent");
        form.reset();
      } else {
        setDraftUrl(mailto);
        setState("draft");
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        setDraftUrl(mailto);
        setState("draft");
      } else {
        setState("error");
        setError(
          err instanceof Error
            ? err.message
            : "Please try again, or email me directly.",
        );
      }
    }
  };
  return (
    <section id="contact" className="section contact-section">
      <div className="section-heading">
        <span className="eyebrow">
          <span className="section-number">06 /</span> LET’S CONNECT
        </span>
        <span className="availability">
          <span className="status-dot" /> Based in the UAE
        </span>
      </div>
      <div className="contact-grid">
        <div className="contact-copy">
          <h2>
            {sections.contact.title}
            <br />
            Let’s find the <em>{sections.contact.emphasis}</em>
          </h2>
          <p>{sections.contact.description}</p>
          <a
            className="contact-email magnetic"
            href={`mailto:${profile.email}`}
          >
            {profile.email}
            <ArrowUpRight size={25} />
          </a>
          <div className="social-links">
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={17} />
              LinkedIn
              <ArrowUpRight size={13} />
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              <Github size={17} />
              GitHub
              <ArrowUpRight size={13} />
            </a>
            <a
              href={`mailto:${profile.email}?subject=Let%E2%80%99s%20schedule%20a%20call`}
            >
              <Mail size={17} />
              Arrange a call
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
        <form className="contact-form" onSubmit={submit}>
          <div className="form-row">
            <label>
              {sections.contact.labels.name}
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                placeholder="Alex Morgan"
              />
            </label>
            <label>
              {sections.contact.labels.email}
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="alex@company.com"
              />
            </label>
          </div>
          <label>
            {sections.contact.labels.message}
            <textarea
              name="message"
              required
              minLength={20}
              maxLength={5000}
              rows={4}
              placeholder="Tell me a little about your project or opportunity…"
            />
          </label>
          <div className="honeypot" aria-hidden="true">
            <label>
              Leave this empty
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className="form-submit">
            <p>{sections.contact.guidance}</p>
            <Button type="submit" disabled={state === "sending"}>
              {state === "sending" ? "Preparing…" : "Let’s connect"}
              <Send size={16} />
            </Button>
          </div>
          <div aria-live="polite">
            {state === "sent" && (
              <p className="form-feedback">
                <CheckCircle2 size={18} />
                {sections.contact.success}
              </p>
            )}
            {state === "draft" && (
              <p className="form-feedback">
                <CheckCircle2 size={18} />
                {sections.contact.draft}{" "}
                <a href={draftUrl} target="_blank" rel="noreferrer">
                  Open email draft <ArrowRight size={12} />
                </a>
              </p>
            )}
            {state === "error" && (
              <p role="alert" className="form-error">
                {error}{" "}
                <a href={`mailto:${profile.email}`}>Email me directly.</a>
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
