<?php

namespace App\Http\Controllers;

use App\Models\BlockedSlot;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminScheduleController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $start = $today->copy()->subWeek()->startOfWeek();
        $end = $today->copy()->addWeeks(2)->endOfWeek();

        $blockedSlots = BlockedSlot::whereBetween('date', [$start, $end])
            ->orderBy('date')
            ->get()
            ->groupBy('date')
            ->map(function ($slots) {
                return $slots->map(fn($slot) => [
                    'id' => $slot->id,
                    'from' => $slot->from,
                    'to' => $slot->to,
                    'reason' => $slot->reason,
                ]);
            });

        $bookings = Booking::with('user')
            ->where('status', 1)
            ->whereBetween('date', [$start, $end])
            ->orderBy('date')
            ->orderBy('time')
            ->get();

        return Inertia::render('Admin/Schedule', [
            'blockedSlots' => $blockedSlots,
            'bookings' => $bookings,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'from' => 'required|string',
            'to' => 'required|string',
            'reason' => 'nullable|string',
        ]);

        $conflict = Booking::where('date', $request->date)
            ->where('status', 1)
            ->where(function ($q) use ($request) {
                $q->whereBetween('time', [$request->from, $request->to])
                  ->orWhereBetween('time_to', [$request->from, $request->to])
                  ->orWhere(function ($sub) use ($request) {
                      $sub->where('time', '<', $request->from)
                          ->where('time_to', '>', $request->to);
                  });
            })->exists();

        if ($conflict) {
            return back()->withErrors(['error' => 'This time slot overlaps with an existing booking.'])->withInput();
        }

        BlockedSlot::create([
            'date' => $request->date,
            'from' => $request->from,
            'to' => $request->to,
            'reason' => $request->reason,
        ]);

        return back()->with('success', 'Blocked slot created successfully.');
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:blocked_slots,id',
            'date' => 'required|date',
            'from' => 'required|string',
            'to' => 'required|string',
            'reason' => 'nullable|string',
        ]);

        $slot = BlockedSlot::findOrFail($request->id);

        $hasConflictWithBooking = Booking::where('date', $request->date)
            ->where('status', 1)
            ->where(function ($q) use ($request) {
                $q->where('time', '<', $request->to)
                  ->where('time_to', '>', $request->from);
            })->exists();

        if ($hasConflictWithBooking) {
            return back()->withErrors(['error' => 'Conflict with existing reservations.'])->withInput();
        }

        $hasConflictWithBlock = BlockedSlot::where('date', $request->date)
            ->where('id', '!=', $request->id)
            ->where(function ($q) use ($request) {
                $q->where('from', '<', $request->to)
                  ->where('to', '>', $request->from);
            })->exists();

        if ($hasConflictWithBlock) {
            return back()->withErrors(['error' => 'Conflict with existing blocked slots.'])->withInput();
        }

        $slot->update([
            'date' => $request->date,
            'from' => $request->from,
            'to' => $request->to,
            'reason' => $request->reason,
        ]);

        return back()->with('success', 'Blocked slot updated successfully.');
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:blocked_slots,id',
        ]);

        BlockedSlot::findOrFail($request->id)->delete();

        return back()->with('success', 'Blocked slot deleted successfully.');
    }
}
