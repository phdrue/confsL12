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
        Schema::create('conferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('type_id')->constrained('conference_types');
            $table->foreignId('state_id')->default(1)->constrained('conference_states');
            $table->boolean('front_page')->default(false);
            $table->string('name', 1000);
            $table->string('description', 1500);
            $table->date('date');
            $table->boolean('allow_thesis')->default(false);
            $table->boolean('allow_report')->default(false);
            $table->string('img_path')->default('storage/img/conferences/2.png');
            $table->string('primary_color', 100)->default('#548FC7');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conferences');
    }
};
