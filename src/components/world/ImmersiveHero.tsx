import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Compass,
  Cpu,
  Expand,
  Map,
  Minus,
  MoveUpRight,
  Plus,
  RotateCcw,
  Route,
  Sparkles,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { profile } from "../../data/content";
import { worldContent } from "../../data/world";
import IslandMap from "./IslandMap";
const IslandScene = lazy(() => import("./IslandScene"));
class WorldBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
const stationIcons = [Stethoscope, BrainCircuit, Users, Cpu];
export default function ImmersiveHero({ theme }: { theme: string }) {
  const frame = useRef<HTMLElement>(null),
    focus = useRef<HTMLDivElement>(null),
    keys = useRef(new Set<string>()),
    inView = useInView(frame, { margin: "80px" });
  const [enabled, setEnabled] = useState(false),
    [ready, setReady] = useState(false),
    [mapMode, setMapMode] = useState(false),
    [started, setStarted] = useState(false),
    [selected, setSelected] = useState<string | null>(null),
    [travel, setTravel] = useState(0),
    [visited, setVisited] = useState<string[]>([]),
    [collected, setCollected] = useState<number[]>([]),
    [toast, setToast] = useState(""),
    [zoom, setZoom] = useState(1),
    [view, setView] = useState(0),
    [session, setSession] = useState(0),
    [visible, setVisible] = useState(true),
    [position, setPosition] = useState({ x: -3, z: 2.4 });
  useEffect(() => {
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      matchMedia("(max-width: 699px)").matches ||
      nav.connection?.saveData ||
      (nav.deviceMemory && nav.deviceMemory <= 2) ||
      (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2)
    ) {
      setMapMode(true);
      return;
    }
    let timer = setTimeout(() => setEnabled(true), 650);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const stop = () => keys.current.clear();
    const visibility = () => {
      setVisible(!document.hidden);
      if (document.hidden) stop();
    };
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    const move = (e: Event) => setPosition((e as CustomEvent).detail);
    window.addEventListener("island-position", move);
    return () => window.removeEventListener("island-position", move);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4200);
    return () => clearTimeout(timer);
  }, [toast]);
  const visit = useCallback((id: string) => {
    setSelected(id);
    setTravel((v) => v + 1);
    setVisited((v) => (v.includes(id) ? v : [...v, id]));
  }, []);
  const collect = useCallback((index: number) => {
    setCollected((previous) =>
      previous.includes(index) ? previous : [...previous, index],
    );
    setToast(worldContent.discoveries[index].text);
    window.dispatchEvent(
      new CustomEvent("island-collected", { detail: index }),
    );
  }, []);
  const failed = useCallback(() => {
      setMapMode(true);
      setEnabled(false);
      setReady(false);
      setToast(
        "3D is unavailable here. Every project is accessible through the map.",
      );
    }, []),
    loaded = useCallback(() => setReady(true), []);
  const station = worldContent.stations.find((s) => s.id === selected);
  const start = () => {
    if (mapMode) {
      setEnabled(true);
      setReady(false);
      setMapMode(false);
      setStarted(true);
      focus.current?.focus({ preventScroll: true });
      return;
    }
    setStarted(true);
    focus.current?.focus({ preventScroll: true });
  };
  const reset = () => {
    setSession((v) => v + 1);
    setSelected(null);
    setVisited([]);
    setCollected([]);
    setTravel(0);
    setZoom(1);
    setView(0);
    setPosition({ x: -3, z: 2.4 });
    setToast("A fresh start. Follow your curiosity.");
    keys.current.clear();
  };
  const toggleMap = () => {
    if (mapMode) {
      setEnabled(true);
      setReady(false);
      setMapMode(false);
    } else {
      setMapMode(true);
      keys.current.clear();
    }
  };
  const controlledKey = (key: string) =>
    [
      "w",
      "a",
      "s",
      "d",
      "arrowup",
      "arrowdown",
      "arrowleft",
      "arrowright",
    ].includes(key.toLowerCase());
  return (
    <section
      ref={frame}
      id="island"
      className={`island-hero ${started ? "is-driving" : ""} ${mapMode ? "is-map" : ""}`}
      aria-labelledby="hero-title"
    >
      <div
        ref={focus}
        className="world-stage"
        data-rover-x={position.x.toFixed(2)}
        data-rover-z={position.z.toFixed(2)}
        tabIndex={0}
        role="group"
        aria-label="Explore Fayaz’s data island"
        aria-describedby="world-keyboard-help"
        onKeyDown={(e) => {
          if (!mapMode && controlledKey(e.key)) {
            e.preventDefault();
            keys.current.add(e.key.toLowerCase());
            setStarted(true);
          }
        }}
        onKeyUp={(e) => keys.current.delete(e.key.toLowerCase())}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).tagName === "CANVAS")
            focus.current?.focus({ preventScroll: true });
        }}
      >
        <div
          className={`world-map-layer ${ready && !mapMode ? "map-hidden" : ""}`}
        >
          <IslandMap onVisit={visit} />
        </div>
        {enabled && !mapMode && (
          <div className={`world-canvas-layer ${ready ? "world-ready" : ""}`}>
            <WorldBoundary onError={failed}>
              <Suspense fallback={null}>
                <IslandScene
                  key={session}
                  destination={selected}
                  travel={travel}
                  keys={keys}
                  onVisit={visit}
                  onCollect={collect}
                  onReady={loaded}
                  onFail={failed}
                  theme={theme}
                  zoom={zoom}
                  view={view}
                  active={inView && visible}
                />
              </Suspense>
            </WorldBoundary>
          </div>
        )}
      </div>
      <div className="world-topline">
        <span className="world-location">
          <span className="status-dot" /> FAYAZ / DUBAI, UAE
        </span>
        <span className="world-mode">
          <span className="status-dot" />
          {mapMode
            ? "MAP EXPLORER"
            : ready
              ? "INTERACTIVE 3D WORLD"
              : "LOADING THE ISLAND"}
        </span>
      </div>
      <div className="world-intro">
        <span className="eyebrow">{worldContent.eyebrow}</span>
        <h1 id="hero-title">
          {worldContent.title[0]}
          <br />
          <span>{worldContent.title[1]}</span>
          <span className="world-title-star" aria-hidden="true">
            ✳
          </span>
        </h1>
        <p>{worldContent.description}</p>
        <div className="world-intro-actions">
          <button className="world-enter magnetic" onClick={start}>
            <Compass size={17} />
            {mapMode
              ? "Enter the 3D island"
              : started
                ? "Keep exploring"
                : worldContent.start}
            <ArrowUpRight size={16} />
          </button>
          <a href="#work">
            {worldContent.conventional}
            <ArrowDown size={13} />
          </a>
        </div>
        <div className="world-person">
          <img
            src="/images/fayaz-avatar.webp"
            width="36"
            height="36"
            alt="Fayaz"
          />
          <span>
            <strong>{profile.name}</strong>
            <small>Data & Business Intelligence Analyst</small>
          </span>
          <a
            href={profile.resume}
            download
            aria-label="Download Fayaz’s résumé"
          >
            <ArrowDownToLine size={17} />
          </a>
        </div>
      </div>
      <aside className="world-passport" aria-label="Exploration progress">
        <span className="passport-icon">
          <Route size={17} />
        </span>
        <div>
          <span>YOUR LITTLE DETOUR</span>
          <strong>
            {visited.length}
            <i> / 04</i> <small>places discovered</small>
          </strong>
        </div>
        <div className="passport-stamps">
          {worldContent.stations.map((s) => (
            <span
              key={s.id}
              className={visited.includes(s.id) ? "stamped" : ""}
              title={s.name}
              style={{ "--stop-color": s.color } as React.CSSProperties}
            >
              {s.number}
            </span>
          ))}
        </div>
      </aside>
      <div className="world-view-controls" aria-label="World view controls">
        <button
          onClick={toggleMap}
          aria-label={mapMode ? "Enable 3D world" : "Switch to accessible map"}
          title={mapMode ? "Enable 3D world" : "Use the illustrated map"}
        >
          {mapMode ? <Expand size={17} /> : <Map size={17} />}
        </button>
        <span />
        {!mapMode && (
          <>
            <button
              onClick={() => setZoom((z) => Math.min(1.5, z + 0.15))}
              aria-label="Zoom in"
            >
              <Plus size={17} />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
              aria-label="Zoom out"
            >
              <Minus size={17} />
            </button>
            <button
              onClick={() => setView((v) => v + 1)}
              aria-label="Rotate island view"
            >
              <RotateCcw size={16} />
            </button>
          </>
        )}
        <button
          onClick={reset}
          aria-label="Restart exploration"
          title="Start a fresh exploration"
        >
          <Route size={17} />
        </button>
      </div>
      {station && (
        <aside
          className="world-project-panel"
          aria-label={`${station.name} destination`}
          style={{ "--stop-color": station.color } as React.CSSProperties}
        >
          <div className="destination-overline">
            <span>
              <span /> DESTINATION {station.number}
            </span>
            <button
              onClick={() => setSelected(null)}
              aria-label="Close destination details"
            >
              <X size={17} />
            </button>
          </div>
          <span className="destination-category">{station.category}</span>
          <h2>
            {station.name}
            <MoveUpRight size={22} />
          </h2>
          <p>{station.description}</p>
          <Link to={`/projects/${station.id}`}>
            {station.action}
            <ArrowRight size={16} />
          </Link>
        </aside>
      )}
      {!station && (
        <div className="island-caption">
          <span className="caption-orbit">
            <Compass size={15} />
          </span>
          <span>
            Four places to visit.
            <br />
            <strong>Take the scenic route.</strong>
          </span>
          <span className="caption-line" />
        </div>
      )}
      <div className="world-joystick" aria-label="Touch movement controls">
        <button
          className="joystick-up"
          aria-label="Drive forward"
          onPointerDown={() => {
            keys.current.add("w");
            setStarted(true);
          }}
          onPointerUp={() => keys.current.delete("w")}
          onPointerLeave={() => keys.current.delete("w")}
        >
          <ChevronUp size={20} />
        </button>
        <button
          className="joystick-left"
          aria-label="Drive left"
          onPointerDown={() => keys.current.add("a")}
          onPointerUp={() => keys.current.delete("a")}
          onPointerLeave={() => keys.current.delete("a")}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="joystick-down"
          aria-label="Drive backward"
          onPointerDown={() => keys.current.add("s")}
          onPointerUp={() => keys.current.delete("s")}
          onPointerLeave={() => keys.current.delete("s")}
        >
          <ChevronDown size={20} />
        </button>
        <button
          className="joystick-right"
          aria-label="Drive right"
          onPointerDown={() => keys.current.add("d")}
          onPointerUp={() => keys.current.delete("d")}
          onPointerLeave={() => keys.current.delete("d")}
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="world-dock-wrap">
        <div className="world-dock-label">
          <span>CHOOSE YOUR NEXT STOP</span>
          <span>
            <Sparkles size={11} />
            {collected.length} / 6 little insights
          </span>
        </div>
        <nav className="world-dock" aria-label="Island destinations">
          {worldContent.stations.map((s, i) => {
            const Icon = stationIcons[i];
            return (
              <button
                key={s.id}
                onClick={() => visit(s.id)}
                aria-pressed={selected === s.id}
                style={{ "--stop-color": s.color } as React.CSSProperties}
              >
                <span className="dock-number">{s.number}</span>
                <span className="dock-icon">
                  <Icon size={19} />
                </span>
                <span>
                  <strong>{s.name}</strong>
                  <small>{s.short}</small>
                </span>
                <span
                  className={`dock-visited ${visited.includes(s.id) ? "was-visited" : ""}`}
                  aria-label={
                    visited.includes(s.id) ? "Discovered" : "Not yet discovered"
                  }
                />
              </button>
            );
          })}
        </nav>
      </div>
      <div className="world-bottomline">
        <span id="world-keyboard-help">
          <kbd>W</kbd>
          <kbd>A</kbd>
          <kbd>S</kbd>
          <kbd>D</kbd>
          <span>or arrow keys to drive · click a place to explore</span>
        </span>
        <a href="#work">
          THE WORK, UP CLOSE <ArrowDown size={12} />
        </a>
      </div>
      <div className="world-toast" aria-live="polite">
        {toast && (
          <span>
            <Sparkles size={15} />
            {toast}
          </span>
        )}
        {visited.length === 4 && !toast && (
          <span>
            <Compass size={15} />
            You’ve explored all four destinations. There’s more to the story
            below.
          </span>
        )}
      </div>
    </section>
  );
}
