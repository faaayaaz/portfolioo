export const departments = [
  "Cardiology",
  "Orthopedics",
  "Pediatrics",
  "General medicine",
] as const;
export type Department = (typeof departments)[number];
export type HealthcareRecord = {
  month: string;
  monthIndex: number;
  department: Department;
  visits: number;
  wait: number;
  satisfaction: number;
  revenue: number;
};
export const healthcareData: HealthcareRecord[] = Array.from(
  { length: 6 },
  (_, monthIndex) =>
    departments.map((department, d) => {
      const visits =
        160 +
        d * 34 +
        monthIndex * 19 +
        Math.round(Math.sin(monthIndex * 2 + d) * 21);
      return {
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][monthIndex],
        monthIndex,
        department,
        visits,
        wait: Math.max(10, 27 - d * 2 - monthIndex),
        satisfaction: 89 + d + monthIndex * 0.6,
        revenue: visits * (210 + d * 45),
      };
    }),
).flat();
export function summarize(department: string, period: string) {
  const records = healthcareData.filter(
    (r) =>
      (department === "all" || r.department === department) &&
      (period === "six" || r.monthIndex >= 3),
  );
  const visits = records.reduce((s, r) => s + r.visits, 0);
  return {
    records,
    visits,
    wait: records.reduce((s, r) => s + r.wait * r.visits, 0) / visits,
    satisfaction:
      records.reduce((s, r) => s + r.satisfaction * r.visits, 0) / visits,
    revenue: records.reduce((s, r) => s + r.revenue, 0),
    trend: Array.from(new Set(records.map((r) => r.month))).map((month) => {
      const rows = records.filter((r) => r.month === month);
      return {
        month,
        visits: rows.reduce((s, r) => s + r.visits, 0),
        revenue: rows.reduce((s, r) => s + r.revenue, 0),
      };
    }),
  };
}
