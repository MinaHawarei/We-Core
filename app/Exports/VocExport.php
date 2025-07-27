<?php

namespace App\Exports;

use App\Models\Voc;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class VocExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Voc::all([
            'id', 'cst_number', 'sr_name', 'sr_id', 'type', 'bras', 'area', 'created_at'
        ]);
    }

    public function headings(): array
    {
        return [
            'ID', 'Customer Number', 'SR Name', 'SR ID', 'Type', 'BRAS', 'Area', 'Created At'
        ];
    }
}

