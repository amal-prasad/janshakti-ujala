import { getUpcomingHolidays } from "@/lib/api/holidays";
import { HolidaysClientWidget } from "./HolidaysClientWidget";

export async function HolidaysWidget() {
  const holidays = await getUpcomingHolidays(6);
  if (holidays.length === 0) return null;

  return <HolidaysClientWidget holidays={holidays} />;
}
