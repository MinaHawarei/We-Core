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
         Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_active')->default(0)->after('email');
            $table->string('department')->after('is_active');
            $table->string('site')->after('department');
            $table->unsignedBigInteger('manager_id')->nullable()->after('site');
            $table->string('out_id')->unique()->nullable()->after('manager_id');
            $table->string('role')->default('agent')->after('out_id');

            $table->foreign('manager_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
