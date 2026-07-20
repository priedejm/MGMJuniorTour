export type ScheduleRow = {
  id: string;
  dates: string;
  city: string;
  time: string;
  course: string;
  month: string;
  year: number;
  slug: string;
  tbd?: boolean;
};

export const mockSchedule: ScheduleRow[] = [
  { id: "1", dates: "July 12 – 13", city: "Coral Springs, FL", time: "8:00 AM", course: "Eagle Trace Golf Club", month: "July", year: 2026, slug: "coral-springs-eagle-trace" },
  { id: "2", dates: "July 24 – 25", city: "Janesville, WI", time: "7:30 AM", course: "Glen Erin Golf Club", month: "July", year: 2026, slug: "janesville-glen-erin" },
  { id: "3", dates: "August 5 – 6", city: "Hayward, WI", time: "9:00 AM", course: "Big Fish Golf Club", month: "August", year: 2026, slug: "hayward-big-fish" },
  { id: "4", dates: "August 18 – 19", city: "Madison, WI", time: "TBA", course: "Course TBD", month: "August", year: 2026, slug: "madison-tbd", tbd: true },
  { id: "5", dates: "September 9 – 10", city: "Naples, FL", time: "8:00 AM", course: "Tiburón Golf Club", month: "September", year: 2026, slug: "naples-tiburon", tbd: true },
  { id: "6", dates: "September 22 – 23", city: "Milwaukee, WI", time: "TBA", course: "Course TBD", month: "September", year: 2026, slug: "milwaukee-tbd", tbd: true },
  { id: "7", dates: "October 7 – 8", city: "Palm Beach, FL", time: "8:30 AM", course: "PGA National (Fazio)", month: "October", year: 2026, slug: "palm-beach-pga", tbd: true },
  { id: "8", dates: "October 21 – 22", city: "Championship Finale", time: "8:00 AM", course: "TPC Sawgrass — Dye's Valley", month: "October", year: 2026, slug: "championship-finale", tbd: true },
];

export const groupScheduleByMonth = (rows: ScheduleRow[]) => {
  const groups: { key: string; month: string; year: number; rows: ScheduleRow[] }[] = [];
  for (const row of rows) {
    const key = `${row.month} ${row.year}`;
    let group = groups.find((g) => g.key === key);
    if (!group) {
      group = { key, month: row.month, year: row.year, rows: [] };
      groups.push(group);
    }
    group.rows.push(row);
  }
  return groups;
};