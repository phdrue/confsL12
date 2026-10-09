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
        if (Schema::hasColumn('documents', 'is_approved')) {
            return;
        }

        Schema::table('documents', function (Blueprint $table) {
            $table->boolean('is_approved')->default(true)->after('science_guides');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('documents', 'is_approved')) {
            return;
        }

        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn('is_approved');
        });
    }
};
