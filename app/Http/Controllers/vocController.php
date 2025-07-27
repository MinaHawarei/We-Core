<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\voc;
use App\Models\Setting;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\VocExport;

class vocController extends Controller
{
    public function store(Request $request)
    {
        if (Setting::get('voc_autosave', '1') !== '1') {
            return response('Logging disabled', 200);
        }

        $validated = $request->validate([
            'cst_number' => 'required|string',
            'sr_name' => 'required|string',
            'sr_id' => 'required|string',
        ]);

        Voc::create($validated);

        return response('Logged', 200);
    }

    public function index()
    {
        $logs = voc::latest()->paginate(50);
        return Inertia::render('voc', [
            'logs' => $logs
        ]);

    }

    public function toggleAutoSave()
    {
        $setting = Setting::firstOrCreate(
            ['key' => 'voc_autosave'],
            ['value' => '1']
        );

        $newValue = $setting->value === '1' ? '0' : '1';
        $setting->value = $newValue;
        $setting->save();

        return response()->json([
            'status' => 'success',
            'autoSaveEnabled' => $newValue === '1',
            'message' => 'Auto-save status updated.'
        ]);
    }

    /**
     * Delete all VOC records from the database.
     */
    public function destroyAll()
    {
        Voc::truncate();

        return response()->json([
            'status' => 'success',
            'message' => 'All VOC records have been deleted.'
        ]);
    }

}
