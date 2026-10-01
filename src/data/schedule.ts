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
