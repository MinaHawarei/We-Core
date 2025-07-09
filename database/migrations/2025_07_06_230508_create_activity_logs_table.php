<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->string('model_type');               // اسم الموديل (مثلاً: App\Models\User)
            $table->string('model_id');                 // رقم العنصر (مثلاً: user_id = 5)
            $table->string('action');                   // العملية: created / updated / deleted
            $table->json('old_data')->nullable();       // البيانات القديمة
            $table->json('new_data')->nullable();       // البيانات الجديدة
            $table->timestamp('created_at');            // وقت التنفيذ
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
