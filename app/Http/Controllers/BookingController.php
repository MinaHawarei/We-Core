<?php

namespace App\Http\Controllers;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon ;


class BookingController extends Controller
{
    public function index(Request $request)
    {
        $bookings = DB::table('bookings')
            ->select(DB::raw('DATE(date) as booking_date'), DB::raw('count(*) as count'))
            ->groupBy('booking_date')
            ->get();

        $fullyBookedDates = $bookings
            ->filter(fn($item) => $item->count >= 10)
            ->pluck('booking_date')
            ->map(fn($date) => Carbon::parse($date)->toDateString())
            ->values();

        return Inertia::render('reservation', [
            'fullyBookedDates' => $fullyBookedDates,
        ]);
    }
    public function store(Request $request)
    {
        $user = $request->user();

        $date = Carbon::parse($request->date);

        // ✅ منع الحجز في تواريخ سابقة
        if ($date->lt(now()->startOfDay())) {
            return response()->json(['message' => 'Cannot book for past dates.'], 422);
        }

        // ✅ التأكد أن اليوم لم يصل للحد الأقصى
        $totalVisitors = Booking::whereDate('date', $date)->sum('number_of_visitors');
            if ($totalVisitors + ($user->role === 'agent' ? 1 : $request->number_of_visitors) > 10) {
                return response()->json(['message' => 'This date is fully booked.'], 422);
        }

        // ✅ منع الحجز المتكرر من نفس المستخدم لنفس التاريخ
        $alreadyBooked = Booking::whereDate('date', $date)
            ->where('user_id', $user->id)
            ->exists();

        if ($alreadyBooked) {
            return response()->json(['message' => 'You already booked this slot.'], 422);
        }

        // ✅ التحقق حسب الدور
        if ($user->role === 'agent') {
            $validated = $request->validate([
                'date' => 'required|date',
                'booking_time' => 'required|date_format:H:i',
                'booking_time_to' => 'required|date_format:H:i',
                'notes' => 'nullable|string|max:1000',
                'visit_reason' => 'required|string|max:255',
            ]);

            // احسب وقت النهاية (30 دقيقة بعد البداية)
            $from = Carbon::createFromFormat('H:i', $validated['booking_time']);
            $to = $from->copy()->addMinutes(30);
            $validated['booking_time_to'] = $to->format('H:i');
            $validated['number_of_visitors'] = 1;
        } else {
            $validated = $request->validate([
                'date' => 'required|date',
                'booking_time' => 'required|date_format:H:i',
                'booking_time_to' => 'required|date_format:H:i|after:booking_time',
                'notes' => 'nullable|string|max:1000',
                'visit_reason' => 'required|string|max:255',
                'number_of_visitors' => 'required|integer|min:1|max:20',
            ]);
        }

        Booking::create([
            'user_id' => $user->id,
            'date' => $validated['date'],
            'time' => $validated['booking_time'],
            'time_to' => $validated['booking_time_to'],
            'notes' => $validated['notes'] ?? null,
            'reason' => $validated['visit_reason'],
            'number_of_visitors' => $validated['number_of_visitors'],
        ]);

        return response()->json(['message' => 'Booking created successfully!']);
    }

    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json(['message' => 'Booking cancelled successfully']);
    }

    public function admin(Request $request)
    {
        $fromDate = $request->input('from_date');
        $toDate = $request->input('to_date');
        $outId = $request->input('out_id');
        $role = $request->input('role');
        $reason = $request->input('reason');
        $attendance = $request->input('attendance');
        $sortBy = $request->input('sort_by', 'date');
        $sortDirection = $request->input('sort_direction', 'asc');

        $fromDate = $this->normalizeDate($request->input('from'));
        $toDate = $this->normalizeDate($request->input('to'));

        // ✅ نبدأ البناء الاستعلام
        $query = Booking::with('user');

        if ($fromDate) {
            $query->whereDate('date', '>=', $fromDate);
        }

        if ($toDate) {
            $query->whereDate('date', '<=', $toDate);
        }

        if ($outId) {
            $query->whereHas('user', fn($q) => $q->where('out_id', 'like', "%$outId%"));
        }

        if ($role) {
            $query->whereHas('user', fn($q) => $q->where('role', $role));
        }

        if ($reason) {
            $query->where('reason', $reason);
        }

        if (is_numeric($attendance)) {
            $query->where('attendance', $attendance);
        }

        // ✅ الترتيب الديناميكي
        $allowedSorts = ['date', 'time', 'booking_time_to', 'number_of_visitors', 'attendance', 'visit_reason'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDirection);
        } else {
            $query->orderBy('date', 'asc');
        }

        $reservations = $query->get();

        // ✅ لو الطلب من React يرجع JSON
        if ($request->wantsJson()) {
            return response()->json($reservations);
        }

        // ✅ وإلا نرجعه لـ Inertia
        return Inertia::render('Admin/reservation', [
            'reservations' => $reservations,
        ]);
    }

    public function updateAttendance(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        // ✅ أمنياً: لا تسمح بتعديل حضور في المستقبل
        if (Carbon::parse($booking->date)->isFuture()) {
            return response()->json(['message' => 'Cannot update attendance for future dates.'], 403);
        }

        $booking->attendance = $request->input('attendance') == 1 ? 1 : 0;
        $booking->save();

        return response()->json(['message' => 'Attendance updated successfully.']);
    }

    private function normalizeDate($input)
    {
        try {
            if ($input) {
                return Carbon::parse($input)->format('Y-m-d');
            }
        } catch (\Exception $e) {
            Log::warning("Invalid date format received: " . $input);
        }

        return null;
    }

}
