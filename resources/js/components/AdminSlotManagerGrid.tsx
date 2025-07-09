import { useState } from 'react';

interface Reservation {
  id: string;
  date: string;
  time: string;
  time_to: string;
  number_of_visitors: number;
}

interface BlockedSlot {
  from: string;
  to: string;
  reason: string;
}

interface AdminSlotManagerGridProps {
  blockedSlots: { [key: string]: BlockedSlot[] };
  reservations: Reservation[];
  loading: boolean;
  onSlotClick?: (dateStr: string, time: string, isBlocked: boolean) => void;
}

export default function AdminSlotManagerGrid({
  blockedSlots = {},
  reservations = [],
  loading = false,
  onSlotClick = () => {},
}: AdminSlotManagerGridProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const startHour = 8;
  const endHour = 20;
  const hours: string[] = [];

  for (let h = startHour; h < endHour; h++) {
    hours.push(`${h.toString().padStart(2, '0')}:00`);
    hours.push(`${h.toString().padStart(2, '0')}:15`);
    hours.push(`${h.toString().padStart(2, '0')}:30`);
    hours.push(`${h.toString().padStart(2, '0')}:45`);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - startOfWeek.getDay() + weekOffset * 7);

  const normalizeTime = (time: string) => time.slice(0, 5);

  const getBlockedSlotGroups = (dateStr: string) => {
    const slots = blockedSlots[dateStr] || [];
    return slots.map(slot => {
      const fromTime = normalizeTime(slot.from);
      const toTime = normalizeTime(slot.to);

      // حساب عدد الفترات (كل 30 دقيقة)
      const startMinutes = parseInt(fromTime.split(':')[0]) * 60 + parseInt(fromTime.split(':')[1]);
      const endMinutes = parseInt(toTime.split(':')[0]) * 60 + parseInt(toTime.split(':')[1]);
      const duration = (endMinutes - startMinutes) / 15;

      return {
        start: fromTime,
        end: toTime,
        reason: slot.reason,
        duration: duration
      };
    });
  };

  const getVisitorCountInSlot = (dateStr: string, time: string): number => {
    return reservations.reduce((total, res) => {
      if (
        res.date === dateStr &&
        time >= normalizeTime(res.time) &&
        time < normalizeTime(res.time_to)
      ) {
        return total + res.number_of_visitors;
      }
      return total;
    }, 0);
  };

  const isTimeInBlockedSlot = (dateStr: string, time: string) => {
    const slots = blockedSlots[dateStr] || [];
    return slots.some(slot =>
      time >= normalizeTime(slot.from) &&
      time < normalizeTime(slot.to)
    );
  };

  if (loading) {
    return <div className="text-center py-4">Loading schedule...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => setWeekOffset(prev => prev - 1)}
          className="px-2 py-1 bg-gray-200 dark:bg-[#1a1a5a] rounded hover:bg-gray-300"
        >
          ← Previous
        </button>
        <h3 className="text-lg font-semibold">Admin Schedule View</h3>
        <button
          onClick={() => setWeekOffset(prev => prev + 1)}
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
                const isFriday = cellDate.getDay() === 5;
                const isSaturday = cellDate.getDay() === 6;
                const isDayOff = isFriday || isSaturday;

                if (tIndex === 0 && isDayOff) {
                  return (
                    <td
                      key={dIndex}
                      rowSpan={hours.length}
                      className="border bg-gray-400 text-white font-semibold"
                    >
                      Day Off
                    </td>
                  );
                }
                if (isDayOff) return null;

                const blockedSlotGroups = getBlockedSlotGroups(dateStr);
                const visitorCount = getVisitorCountInSlot(dateStr, time);
                const isBlocked = isTimeInBlockedSlot(dateStr, time);

                // التحقق إذا كانت هذه الخلية هي بداية BlockedSlot
                const currentBlockedSlot = blockedSlotGroups.find(
                  slot => slot.start === time
                );

                if (isBlocked && !currentBlockedSlot) return null;

                let cellClass = 'border px-2 py-1 cursor-pointer ';
                let statusText = '';
                let rowSpan = 1;

                if (currentBlockedSlot) {
                  cellClass += 'bg-red-600 text-white';
                  statusText = currentBlockedSlot.reason || 'Blocked';
                  rowSpan = currentBlockedSlot.duration;
                } else if (visitorCount > 0) {
                  cellClass += 'bg-blue-600 text-white';
                  statusText = `${visitorCount} Visitors`;
                } else {
                  cellClass += 'bg-green-700 text-white hover:bg-green-900';
                }

                return (
                  <td
                    key={dIndex}
                    rowSpan={rowSpan}
                    className={cellClass}
                    onClick={() => onSlotClick(dateStr, time, isBlocked)}
                  >
                    {statusText}
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
