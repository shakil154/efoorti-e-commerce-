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
        Schema::create('review_screenshots', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('customer_name')->nullable();
            $table->text('review_text')->nullable();
            $table->string('image');
            $table->string('platform', 30)->default('facebook');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->string('badge')->nullable();
            $table->integer('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('review_screenshots');
    }
};
