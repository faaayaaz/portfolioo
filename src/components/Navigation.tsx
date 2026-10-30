import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowUpRight,
  Check,
  Command,
  Menu,
  Moon,
  Search,
  X,
} from "lucide-react";
import { navigation, profile, themes, type Theme } from "../data/content";
import { Button } from "./ui/button";

type Props = { theme: Theme; setTheme: (theme: Theme) => void };
export function Navigation({ theme, setTheme }: Props) {
  const [palette, setPalette] = useState(false),
    [mobile, setMobile] = useState(false),
    [themeOpen, setThemeOpen] = useState(false),
    [query, setQuery] = useState("");
  const location = useLocation();
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    setMobile(false);
    setPalette(false);
  }, [location]);
  const sectionLink = (id: string) => `/#${id}`;
  return (
    <>
      <header className="site-header">
        <div className="nav-inner">
          <Link className="brand" to="/">
            <span className="brand-mark" aria-hidden="true">
              f<span>·</span>
            </span>
            <span>
              fayaz<span className="brand-dot">.</span>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((n) => (
              <Link key={n.id} to={sectionLink(n.id)}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              className="command-trigger"
              onClick={() => setPalette(true)}
              aria-label="Open command menu"
            >
              <Command size={13} />
              <kbd>K</kbd>
            </button>
            <Dialog.Root open={themeOpen} onOpenChange={setThemeOpen}>
              <Dialog.Trigger asChild>
                <button
                  className="icon-button theme-trigger"
                  aria-label="Choose color theme"
                >
                  <Moon size={17} />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className="theme-dialog dialog-content">
                  <div className="dialog-heading">
                    <div>
                      <Dialog.Title>Your point of view.</Dialog.Title>
                      <Dialog.Description>
                        Five ways to explore the observatory.
                      </Dialog.Description>
                    </div>
                    <Dialog.Close
                      className="icon-button"
                      aria-label="Close theme selection"
                    >
                      <X size={20} />
                    </Dialog.Close>
                  </div>
                  <div className="theme-options">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        className={`theme-option ${t.id === theme ? "selected" : ""}`}
                        onClick={() => {
                          setTheme(t.id);
                          setThemeOpen(false);
                        }}
                      >
                        <span
                          className="theme-swatch"
                          style={{ background: t.color }}
                        />
                        <span>
                          <strong>{t.name}</strong>
                          <small>{t.description}</small>
                        </span>
                        {theme === t.id && <Check size={18} />}
                      </button>
                    ))}
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
            <Button
              asChild
              size="small"
              variant="outline"
              className="nav-contact"
            >
              <Link to="/#contact">
                Let’s talk <ArrowUpRight size={15} />
              </Link>
            </Button>
            <Dialog.Root open={mobile} onOpenChange={setMobile}>
              <Dialog.Trigger asChild>
                <button
                  className="icon-button mobile-menu-trigger"
                  aria-label="Open navigation"
                >
                  <Menu size={22} />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className="mobile-drawer dialog-content">
                  <div className="dialog-heading">
                    <Dialog.Title>Explore.</Dialog.Title>
                    <Dialog.Close
                      className="icon-button"
                      aria-label="Close navigation"
                    >
                      <X />
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="sr-only">
                    Navigate Fayaz’s portfolio
                  </Dialog.Description>
                  <nav aria-label="Mobile navigation">
                    {[
                      ...navigation,
                      { id: "skills", label: "Skills" },
                      { id: "contact", label: "Contact" },
                    ].map((n, i) => (
                      <Link
                        to={sectionLink(n.id)}
                        key={n.id}
                        onClick={() => setMobile(false)}
                      >
                        <span className="mono">0{i + 1}</span>
                        {n.label}
                        <ArrowUpRight size={20} />
                      </Link>
                    ))}
                  </nav>
                  <span className="eyebrow">{profile.location}</span>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </header>
      <Dialog.Root open={palette} onOpenChange={setPalette}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="command-dialog dialog-content">
            <Dialog.Title className="sr-only">Command menu</Dialog.Title>
            <Dialog.Description className="sr-only">
              Search sections and color themes. Tab to a result and press Enter.
            </Dialog.Description>
            <div className="command-input">
              <Search size={20} />
              <input
                aria-label="Search pages and themes"
                placeholder="Where would you like to go?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Dialog.Close className="keycap" aria-label="Close command menu">
                Esc
              </Dialog.Close>
            </div>
            <div className="command-results">
              <p className="eyebrow">JUMP TO</p>
              {[
                ...navigation,
                { id: "skills", label: "Skills" },
                { id: "contact", label: "Contact" },
              ]
                .filter((n) =>
                  n.label.toLowerCase().includes(query.toLowerCase()),
                )
                .map((n) => (
                  <Link
                    onClick={() => setPalette(false)}
                    key={n.id}
                    to={sectionLink(n.id)}
                  >
                    {n.label}
                    <ArrowUpRight size={17} />
                  </Link>
                ))}
              <p className="eyebrow">CHANGE ATMOSPHERE</p>
              {themes
                .filter((t) =>
                  t.name.toLowerCase().includes(query.toLowerCase()),
                )
                .map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setPalette(false);
                    }}
                  >
                    <span
                      className="theme-swatch"
                      style={{ background: t.color }}
                    />
                    {t.name}
                    {theme === t.id && <Check size={16} />}
                  </button>
                ))}
              {![...navigation, { label: "Skills" }, { label: "Contact" }].some(
                (n) => n.label.toLowerCase().includes(query.toLowerCase()),
              ) &&
                !themes.some((t) =>
                  t.name.toLowerCase().includes(query.toLowerCase()),
                ) && <p className="muted">No results. Try “work” or “dark”.</p>}
            </div>
            <div className="command-footer">
              Tab to navigate <span>↵ to select</span>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
