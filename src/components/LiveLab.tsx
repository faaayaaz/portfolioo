import { useId, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  Clock3,
  Heart,
  Wallet,
} from "lucide-react";
import { departments, summarize } from "../data/healthcare";
import { ui } from "../data/content";
export default function LiveLab({ compact = false }: { compact?: boolean }) {
  const [department, setDepartment] = useState("all"),
    [period, setPeriod] = useState("six"),
    [metric, setMetric] = useState<"visits" | "revenue">("visits");
  const id = useId().replace(/:/g, "");
  const data = useMemo(
    () => summarize(department, period),
    [department, period],
  );
  const exportCsv = () => {
    const csv =
      "Month,Department,Visits,Average wait minutes,Satisfaction percent,Revenue AED\n" +
      data.records
        .map((r) =>
          [
            r.month,
            r.department,
            r.visits,
            r.wait,
            r.satisfaction.toFixed(1),
            r.revenue,
          ].join(","),
        )
        .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "fayaz-synthetic-healthcare.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className={`live-dashboard ${compact ? "dashboard-compact" : ""}`}>
      <div className="dashboard-toolbar">
        <div className="dashboard-title">
          <span className="dashboard-icon">
            <Activity size={21} />
          </span>
          <div>
            <h3>Healthcare overview</h3>
            <span>Operational intelligence / Jan – Jun 2026</span>
          </div>
        </div>
        <button className="export-button" onClick={exportCsv}>
          <ArrowDownToLine size={14} />
          <span>Export sample</span>
        </button>
      </div>
      <div className="dashboard-filters">
        <span className="sample-badge">
          <span className="status-dot" /> INTERACTIVE SAMPLE
        </span>
        <div>
          <label className="sr-only" htmlFor={`${id}-dept`}>
            Department
          </label>
          <select
            id={`${id}-dept`}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="all">All departments</option>
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor={`${id}-period`}>
            Date range
          </label>
          <select
            id={`${id}-period`}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="six">Jan – Jun 2026</option>
            <option value="three">Apr – Jun 2026</option>
          </select>
        </div>
      </div>
      <div className="dashboard-kpis">
        {[
          {
            label: "Patient visits",
            value: data.visits.toLocaleString("en-US"),
            icon: Activity,
            note: "Across selected departments",
          },
          {
            label: "Average wait",
            value: `${data.wait.toFixed(1)}`,
            unit: "min",
            icon: Clock3,
            note: "Weighted by patient visits",
          },
          {
            label: "Satisfaction",
            value: data.satisfaction.toFixed(1),
            unit: "%",
            icon: Heart,
            note: "Weighted sample score",
          },
          {
            label: "Revenue",
            value: `${(data.revenue / 1000000).toFixed(2)}`,
            unit: "M AED",
            icon: Wallet,
            note: "Synthetic billing total",
          },
        ].map((k) => (
          <div className="dashboard-kpi" key={k.label}>
            <div>
              <span>{k.label}</span>
              <k.icon size={15} />
            </div>
            <strong>
              {k.value}
              <small>{k.unit}</small>
            </strong>
            <span className="kpi-note">{k.note}</span>
          </div>
        ))}
      </div>
      <div className="chart-heading">
        <div>
          <h4>
            {metric === "visits"
              ? "A clearer view of patient flow."
              : "The financial picture."}
          </h4>
          <p>
            {department === "all" ? "All four departments" : department} ·{" "}
            {period === "six" ? "Six" : "Three"} months of synthetic data
          </p>
        </div>
        <div className="chart-tabs" aria-label="Chart metric">
          <button
            aria-pressed={metric === "visits"}
            onClick={() => setMetric("visits")}
          >
            Visits
          </button>
          <button
            aria-pressed={metric === "revenue"}
            onClick={() => setMetric("revenue")}
          >
            Revenue
          </button>
        </div>
      </div>
      <div
        className="live-chart"
        role="img"
        aria-label={`Monthly ${metric} for ${department === "all" ? "all departments" : department}. ${data.trend.map((d) => `${d.month}: ${d[metric]}`).join(", ")}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data.trend}
            margin={{ top: 14, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--chart)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--line)"
              strokeDasharray="3 5"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 11 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 11 }}
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
              }
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: 8,
                color: "var(--text)",
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--muted)" }}
              formatter={(v: number) => [
                metric === "revenue"
                  ? `AED ${v.toLocaleString()}`
                  : v.toLocaleString(),
                metric === "visits" ? "Visits" : "Revenue",
              ]}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke="var(--chart)"
              strokeWidth={2.5}
              fill={`url(#${id}-fill)`}
              isAnimationActive={false}
              activeDot={{
                r: 5,
                fill: "var(--accent)",
                stroke: "var(--surface)",
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="dashboard-bottom">
        <span>
          <span className="status-dot" />
          {ui.labDisclaimer}
        </span>
        <span className="mono">
          {data.records.length} RECORDS <ArrowUpRight size={12} />
        </span>
      </div>
    </div>
  );
}
