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
        Schema::create('vocs', function (Blueprint $table) {
            $table->id();
            $table->string('cst_number');
            $table->string('sr_name');
            $table->string('sr_id');
            $table->string('type')->nullable();
            $table->string('bras')->nullable();
            $table->string('area')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vocs');
    }
};
