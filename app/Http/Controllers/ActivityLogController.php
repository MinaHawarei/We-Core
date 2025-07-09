<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityLog;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ActivityLogController extends Controller
{

     public function index(Request $request)
    {
        $query = ActivityLog::query()->with('user:id,out_id');


        // 🗓️ فلترة حسب التاريخ
        if ($request->filled('fromDate')) {
            $query->whereDate('created_at', '>=', $request->input('fromDate'));
        }

        if ($request->filled('toDate')) {
            $query->whereDate('created_at', '<=', $request->input('toDate'));
        }

        // 👤 فلترة حسب رقم المستخدم
        if ($request->filled('userId')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('out_id', $request->input('userId'));
            });
        }

        // 🔄 فلترة حسب نوع العملية
        if ($request->filled('action')) {
            $query->where('action', $request->input('action'));
        }

        $logs = $query->latest()->take(200)->get();
        $logs = $logs->map(function ($log) {
            $description = '';
            $ignoredFields = ['created_at', 'updated_at' , 'remember_token' , 'password'];

            // نحضّر old/new data
            $old = collect(json_decode($log->old_data, true) ?? [])->except($ignoredFields);
            $new = collect(json_decode($log->new_data, true) ?? [])->except($ignoredFields);

            // ✅ لو في user_id نحاول نجيبه كـ out_id
            if (($old->has('user_id') || $new->has('user_id')) && $log->user) {
                $outId = $log->user->out_id ?? null;
                if ($outId) {
                    if ($old->has('user_id')) {
                        $old->put('out_id', $outId)->forget('user_id');
                    }
                    if ($new->has('user_id')) {
                        $new->put('out_id', $outId)->forget('user_id');
                    }
                }
            }

            // 🧾 إنشاء الوصف بناءً على نوع العملية
            if ($log->action === 'created') {
                $description = "Created with values:\n" .
                    $new->map(fn($val, $key) => "- $key: \"$val\"")->implode("\n");

            } elseif ($log->action === 'updated') {
                $changes = $new->map(function ($newVal, $key) use ($old) {
                    $oldVal = $old[$key] ?? 'null';
                    return "- $key: \"$oldVal\" → \"$newVal\"";
                });

                $description = $changes->implode("\n");

            } elseif ($log->action === 'deleted') {
                $description = "Deleted with values:\n" .
                    $old->map(fn($val, $key) => "- $key: \"$val\"")->implode("\n");
            }

            $log->description = $description;
            $log->description = $this->simplifyActivityDescription($description);

            return $log;
        })->filter(function ($log) {
            return !empty($log->description);
        })->values(); // إعادة فهرسة المفاتيح



        // إذا كان طلب AJAX (من React)، رجّع JSON
        if ($request->wantsJson()) {
            return response()->json(['logs' => $logs]);
        }

        // أول تحميل: أرسل البيانات لـ Inertia
        return Inertia::render('Admin/ActivityLogs', [
            'logs' => $logs,
        ]);
    }
   private function simplifyActivityDescription(string $description): string
{
    $patterns = [
        '/- is_active: "0" → "1"/' => 'User was activated',
        '/- is_active: "1" → "0"/' => 'User was deactivated',
        '/- is_active: "1" → ""/'  => 'User was deactivated',
        '/- attendance: "0" → "1"/' => 'Request attendance was marked',
        '/- attendance: "1" → "0"/' => 'Request attendance updated from Attend to Absent',
        '/- status: "1" → "0"/' => 'Request updated from Accepted to Rejected',
        '/- status: "0" → "1"/' => 'Request updated from Rejected to Accepted',
        '/- status: "null" → "1"/' => 'Request Accepted',
        '/- status: "null" → "0"/' => 'Request Rejected',
    ];

    foreach ($patterns as $pattern => $replacement) {
        $description = preg_replace($pattern, $replacement, $description);
    }

    return $description;
}



}
