import {
  Activity,
  ArrowUpRight,
  Cpu,
  Database,
  Lightbulb,
  Radio,
  ScanLine,
  Smartphone,
  Workflow,
} from "lucide-react";
import type { Project } from "../data/content";
export default function ProjectVisual({
  type,
  large = false,
}: {
  type: Project["visual"];
  large?: boolean;
}) {
  return (
    <div
      className={`project-visual visual-${type} ${large ? "visual-large" : ""}`}
      aria-label={`${type} project illustrative visualization`}
    >
      {type === "healthcare" && (
        <div className="mini-dashboard">
          <div className="mini-top">
            <span>
              <Activity size={12} /> CARE / OVERVIEW
            </span>
            <i>LIVE SAMPLE</i>
          </div>
          <div className="mini-kpis">
            {[
              ["Patient visits", "2,486", "+12.8%"],
              ["Avg. wait time", "18 min", "−8.2%"],
              ["Satisfaction", "94.2%", "+3.4%"],
            ].map(([label, value, trend]) => (
              <div key={label}>
                <span>{label}</span>
                <b>{value}</b>
                <small>
                  {trend} <span>vs previous</span>
                </small>
              </div>
            ))}
          </div>
          <div className="mini-chart-label">
            Patient visits <span>JAN — JUN</span>
          </div>
          <svg
            viewBox="0 0 430 95"
            role="img"
            aria-label="Illustrative rising visit trend"
          >
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="currentColor" stopOpacity=".22" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[20, 45, 70].map((y) => (
              <path
                key={y}
                d={`M0 ${y}H430`}
                stroke="currentColor"
                strokeOpacity=".1"
              />
            ))}
            <path
              d="M0 84C25 82 30 50 60 55S100 75 125 48S165 65 195 42S230 60 260 26S290 43 325 20S370 43 400 10L430 4V95H0Z"
              fill="url(#chartFill)"
            />
            <path
              d="M0 84C25 82 30 50 60 55S100 75 125 48S165 65 195 42S230 60 260 26S290 43 325 20S370 43 400 10L430 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <div className="mini-months">
            <span>JAN</span>
            <span>FEB</span>
            <span>MAR</span>
            <span>APR</span>
            <span>MAY</span>
            <span>JUN</span>
          </div>
        </div>
      )}
      {type === "skin" && (
        <>
          <div className="scan-label">
            <ScanLine size={14} /> PATTERN RECOGNITION{" "}
            <span>MODEL STUDY / 2023</span>
          </div>
          <div className="scan-orbit">
            <div className="scan-grid" />
            <div className="cell cell-one" />
            <div className="cell cell-two" />
            <div className="cell cell-three" />
            <div className="scan-cross x-one" />
            <div className="scan-cross x-two" />
            <div className="scan-box">
              <span>FEATURE REGION</span>
            </div>
          </div>
          <div className="scan-footer">
            <span>INPUT → CNN → CLASSIFICATION</span>
            <b>
              92%+ <small>REPORTED</small>
            </b>
          </div>
        </>
      )}
      {type === "workforce" && (
        <div className="workforce-demo">
          <div className="mini-top">
            <span>
              <Workflow size={13} /> WORKFORCE / INSIGHTS
            </span>
            <i>ILLUSTRATIVE</i>
          </div>
          <div className="workforce-head">
            <div>
              <small>Patterns behind presence.</small>
              <b>People, in perspective.</b>
            </div>
            <span className="tiny-pill">2023</span>
          </div>
          <div className="bar-chart">
            {[45, 73, 57, 92, 68, 82, 55, 87, 71, 95, 75, 60].map((h, i) => (
              <div key={i}>
                <i style={{ height: `${h}%` }} />
                <i style={{ height: `${h * 0.66}%` }} />
              </div>
            ))}
          </div>
          <div className="bar-legend">
            <span>
              <i /> On-site
            </span>
            <span>
              <i /> Flexible
            </span>
            <small>SYNTHETIC COMPARISON</small>
          </div>
        </div>
      )}
      {type === "iot" && (
        <>
          <div className="mini-top">
            <span>
              <Radio size={14} /> CONNECTED / HOME
            </span>
            <i>SYSTEM SCHEMATIC</i>
          </div>
          <div className="iot-diagram">
            <div className="iot-source">
              <Smartphone size={25} />
              <span>BLYNK APP</span>
            </div>
            <span className="circuit-wire" />
            <div className="iot-chip">
              <Cpu size={36} />
              <span>ESP8266</span>
            </div>
            <span className="circuit-wire" />
            <div className="iot-devices">
              <div>
                <Lightbulb size={21} />
                <span>RELAY 01</span>
              </div>
              <div>
                <Lightbulb size={21} />
                <span>RELAY 02</span>
              </div>
            </div>
          </div>
          <div className="iot-footer">
            <span>
              <span className="status-dot" /> DUAL-CHANNEL CONTROL
            </span>
            <Database size={15} />
          </div>
        </>
      )}
      <div className="visual-corner">
        <ArrowUpRight size={16} />
      </div>
    </div>
  );
}
