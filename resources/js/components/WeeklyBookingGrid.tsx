import { useState } from 'react';

interface WeeklyBookingGridProps {
  fullyBookedDates: string[];
  disabledDates: string[];
  blockedSlots: { [key: string]: string[] }; // { '2025-07-10': ['08:00', '08:30'] }
  onSelectSlot: (date: Date, time: string) => void;
}

export default function WeeklyBookingGrid({
  fullyBookedDates,
  disabledDates,
  blockedSlots,
  onSelectSlot,
}: WeeklyBookingGridProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const startHour = 8;
  const endHour = 20;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayDateStr = today.toDateString();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - startOfWeek.getDay() + weekOffset * 7);

  const hours: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    hours.push(`${h.toString().padStart(2, '0')}:00`);
    hours.push(`${h.toString().padStart(2, '0')}:15`);
    hours.push(`${h.toString().padStart(2, '0')}:30`);
    hours.push(`${h.toString().padStart(2, '0')}:45`);
  }

  const groupConsecutiveTimes = (times: string[]) => {
    const result: { start: string; length: number }[] = [];
    const timeToMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const sorted = [...times].sort((a, b) => timeToMinutes(a) - timeToMinutes(b));

    for (let i = 0; i < sorted.length; i++) {
      const start = sorted[i];
      let length = 1;
      while (
        i + length < sorted.length &&
        timeToMinutes(sorted[i + length]) - timeToMinutes(sorted[i + length - 1]) === 15
      ) {
        length++;
      }
      result.push({ start, length });
      i += length - 1;
    }

    return result;
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => setWeekOffset((prev) => Math.max(prev - 1, -1))}
          className="px-2 py-1 bg-gray-200 dark:bg-[#1a1a5a] rounded hover:bg-gray-300"
        >
          ← Previous
        </button>
        <h3 className="text-lg font-semibold">Week View</h3>
        <button
          onClick={() => setWeekOffset((prev) => Math.min(prev + 1, 1))}
          className="px-2 py-1 bg-gray-200 dark:bg-[#1a1a5a] rounded hover:bg-gray-300"
        >
          Next →
        </button>
      </div>
      <table className="min-w-full border text-sm text-center">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="border px-2 py-1">Time</th>
            {days.map((day, i) => {
              const date = new Date(startOfWeek);
              date.setDate(startOfWeek.getDate() + i);
              return (
                <th key={i} className="border px-2 py-1">
                  {day}
                  <br />
                  {date.toLocaleDateString('en-GB')}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {hours.map((time, tIndex) => (
            <tr key={tIndex}>
              <td className="border px-2 py-1 font-medium">{time}</td>
              {days.map((_, dIndex) => {
                const cellDate = new Date(startOfWeek);
                cellDate.setDate(startOfWeek.getDate() + dIndex);
                cellDate.setHours(0, 0, 0, 0);
                const dateStr = cellDate.toLocaleDateString('en-CA');
                const isBeforeToday = cellDate < today;
                const isToday = cellDate.toDateString() === todayDateStr;
                const isFriday = cellDate.getDay() === 5;
                const isSaturday = cellDate.getDay() === 6;
                const isDayOff = isFriday || isSaturday;
                const isDisabledDay = disabledDates.includes(dateStr);
                const isMergedDay = isBeforeToday || isToday || isDayOff || isDisabledDay;

                if (tIndex === 0 && isMergedDay) {
                  const colorClass = isToday
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500';

                  return (
                    <td
                      key={dIndex}
                      rowSpan={hours.length}
                      className={`border px-2 py-1 cursor-not-allowed font-semibold ${colorClass}`}
                    >
                      {isToday ? 'Today' : isDayOff ? 'Day Off' : 'Unavailable'}
                    </td>
                  );
                }

                if (isMergedDay) return null;

                const blockedForDay = blockedSlots[dateStr] || [];
                const key = `${dateStr}-${time}`;
                const showCell = !(
                  blockedForDay.includes(time) &&
                  blockedForDay.indexOf(time) !== 0 &&
                  blockedForDay.includes(hours[tIndex - 1])
                );

                let rowSpan = 1;
                let isBlockedGroupStart = false;
                const blockedGroups = groupConsecutiveTimes(blockedForDay);
                for (const group of blockedGroups) {
                  if (group.start === time) {
                    isBlockedGroupStart = true;
                    rowSpan = group.length;
                    break;
                  }
                }

                const isBlockedSlot = blockedForDay.includes(time);
                const cellClass = isBlockedSlot
                  ? 'bg-red-600 text-white'
                  : 'bg-green-700 hover:bg-green-900 dark:hover:bg-green-900';

                if (isBlockedSlot && !isBlockedGroupStart) return null;

                return (
                  <td
                    key={dIndex}
                    rowSpan={isBlockedSlot ? rowSpan : 1}
                    className={`border px-2 py-1 cursor-pointer ${cellClass}`}
                    onClick={() => {
                      if (!isBlockedSlot) onSelectSlot(cellDate, time);
                    }}
                  >
                    {isBlockedSlot ? 'Locked' : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
