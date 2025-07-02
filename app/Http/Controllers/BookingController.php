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
        $request->validate([
            'date' => 'required|date',
            'booking_time' => 'required',
            'notes' => 'nullable|string|max:1000',
        ]);

        $date = Carbon::parse($request->date);

        // ✅ منع الحجز في تواريخ سابقة
        if ($date->lt(now()->startOfDay())) {
            return response()->json(['message' => 'Cannot book for past dates.'], 422);
        }

        // ✅ التأكد أن اليوم لم يصل للحد الأقصى
        $existingBookingsCount = Booking::whereDate('date', $date)->count();
        if ($existingBookingsCount >= 10) {
            return response()->json(['message' => 'This date is fully booked.'], 422);
        }

        // ✅ منع الحجز المتكرر من نفس المستخدم لنفس الوقت
        $alreadyBooked = Booking::whereDate('date', $date)
            ->where('date', $date)
            ->where('user_id', Auth::id())
            ->exists();

        if ($alreadyBooked) {
            return response()->json(['message' => 'You already booked this slot.'], 422);
        }

        Booking::create([
            'user_id' => Auth::id(),
            'date' => $date,
            'time' => $request->booking_time,
            'notes' => $request->notes,
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
         $date = $request->input('date') ?? Carbon::today()->toDateString();

        $reservations = Booking::with('user')
            ->whereDate('date', $date)
            ->get();

        // 👇 لو الطلب AJAX (من React) نرجع JSON فقط
        if ($request->wantsJson()) {
            return response()->json($reservations);
        }

        // 👇 لو الطلب من Inertia (أول مرة تحميل الصفحة)
        return Inertia::render('Admin/reservation', [
            'reservations' => $reservations,
            'selectedDate' => $date,
        ]);
    }

}
