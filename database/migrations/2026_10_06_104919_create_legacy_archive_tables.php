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
        Schema::create('legacy_conferences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('wp_id')->unique();
            $table->string('slug')->unique();
            $table->string('title', 1000);
            $table->longText('content_html');
            $table->text('excerpt')->nullable();
            $table->string('status', 32)->default('publish');
            $table->timestamp('published_at')->nullable();
            $table->string('source_url', 500)->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
        });

        Schema::create('legacy_conference_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('legacy_conference_id')->constrained('legacy_conferences')->cascadeOnDelete();
            $table->unsignedBigInteger('wp_attachment_id')->nullable();
            $table->string('original_name');
            $table->string('mime', 191)->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->string('path', 1000);
            $table->string('kind', 32)->default('other');
            $table->boolean('is_featured')->default(false);
            $table->timestamps();

            $table->index('wp_attachment_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('legacy_conference_files');
        Schema::dropIfExists('legacy_conferences');
    }
};
