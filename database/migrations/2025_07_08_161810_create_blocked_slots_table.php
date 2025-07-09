<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('blocked_slots', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('from'); // hh:mm format e.g. "14:00"
            $table->string('to'); // hh:mm format e.g. "14:00"
            $table->text('reason')->nullable(); // optional, e.g. "Maintenance"
            $table->timestamps();
            $table->unique(['date', 'from' , 'to' ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blocked_slots');
    }
};
