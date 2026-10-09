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
        if (Schema::hasColumn('conferences', 'force_enroll')) {
            return;
        }

        Schema::table('conferences', function (Blueprint $table) {
            $table->boolean('force_enroll')->default(false)->after('allow_report');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('conferences', 'force_enroll')) {
            return;
        }

        Schema::table('conferences', function (Blueprint $table) {
            $table->dropColumn('force_enroll');
        });
    }
};
