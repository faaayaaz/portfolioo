import { useId, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { departments, summarize } from "../data/healthcare";
import { studioContent } from "../data/content";
export default function SignalBoard() {
  const [department, setDepartment] = useState("all"),
    [metric, setMetric] = useState<"visits" | "wait">("visits");
  const id = useId().replace(/:/g, "");
  const data = useMemo(() => summarize(department, "six"), [department]);
  const trend = data.trend.map((point) => {
    const rows = data.records.filter((r) => r.month === point.month);
    return {
      ...point,
      wait: rows.reduce((s, r) => s + r.wait * r.visits, 0) / point.visits,
    };
  });
  const values = trend.map((row) => row[metric]),
    max = Math.max(...values) * 1.18,
    min = Math.min(...values) * 0.75;
  const points = values.map((value, i) => ({
    x: 24 + i * 74.4,
    y: 148 - ((value - min) / (max - min)) * 110,
  }));
  const line = points
    .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L396,166 L24,166 Z`;
  const change = ((values[5] - values[0]) / values[0]) * 100;
  return (
    <div
      className="signal-board"
      role="group"
      aria-label="Interactive healthcare sample"
    >
      <div className="signal-board-head">
        <div className="signal-brand">
          <span>
            <ChartNoAxesCombined size={19} />
          </span>
          <div>
            <strong>Healthcare, at a glance.</strong>
            <small>{studioContent.boardSubtitle}</small>
          </div>
        </div>
        <span className="signal-sample">
          <span />
          SAMPLE DATA
        </span>
      </div>
      <div className="signal-filter">
        <label htmlFor={`${id}-department`}>
          <SlidersHorizontal size={13} />
          Explore a department
        </label>
        <div>
          <select
            id={`${id}-department`}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="all">All departments</option>
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <ChevronDown size={13} />
        </div>
      </div>
      <div className="signal-numbers" aria-live="polite">
        <div>
          <span>Patient visits</span>
          <strong data-testid="signal-visits">
            {data.visits.toLocaleString("en-US")}
          </strong>
          <small>Jan – Jun 2026</small>
        </div>
        <div>
          <span>Average wait</span>
          <strong>
            {data.wait.toFixed(1)}
            <em>min</em>
          </strong>
          <small>Weighted average</small>
        </div>
        <div>
          <span>Satisfaction</span>
          <strong>
            {data.satisfaction.toFixed(1)}
            <em>%</em>
          </strong>
          <small>Synthetic score</small>
        </div>
      </div>
      <div className="signal-chart-head">
        <span>
          {metric === "visits" ? "Patient flow" : "Waiting time"}
          <span>
            {change >= 0 ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            )}{" "}
            {Math.abs(change).toFixed(1)}%
          </span>
        </span>
        <div className="signal-metrics" aria-label="Preview chart metric">
          <button
            aria-pressed={metric === "visits"}
            onClick={() => setMetric("visits")}
          >
            Visits
          </button>
          <button
            aria-pressed={metric === "wait"}
            onClick={() => setMetric("wait")}
          >
            Wait time
          </button>
        </div>
      </div>
      <svg
        className="signal-chart"
        viewBox="0 0 420 195"
        role="img"
        aria-label={`${metric === "visits" ? "Patient visits" : "Average wait in minutes"} by month: ${trend.map((r) => `${r.month} ${r[metric].toFixed(1)}`).join(", ")}`}
      >
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="var(--accent)" stopOpacity=".12" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[38, 80, 122, 166].map((y) => (
          <path
            key={y}
            d={`M24 ${y}H396`}
            stroke="var(--line)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
        ))}
        <path d={area} fill={`url(#${id}-fill)`} />
        <path
          d={line}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === 5 ? 4.5 : 2.5}
            fill={i === 5 ? "var(--accent)" : "var(--surface)"}
            stroke="var(--accent)"
            strokeWidth="1.5"
          />
        ))}
        {trend.map((r, i) => (
          <text
            key={r.month}
            x={points[i].x}
            y="190"
            fill="var(--muted)"
            fontSize="10"
            textAnchor="middle"
            fontFamily="inherit"
          >
            {r.month}
          </text>
        ))}
      </svg>
      <div className="signal-board-foot">
        <span>{studioContent.boardFootnote}</span>
        <details>
          <summary>View data</summary>
          <table>
            <caption>
              {department === "all" ? "All departments" : department} ·
              synthetic monthly totals
            </caption>
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">Visits</th>
                <th scope="col">Wait (min)</th>
              </tr>
            </thead>
            <tbody>
              {trend.map((r) => (
                <tr key={r.month}>
                  <th scope="row">{r.month}</th>
                  <td>{r.visits}</td>
                  <td>{r.wait.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>
    </div>
  );
}
