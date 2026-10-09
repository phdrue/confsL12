<?php

use Illuminate\Support\Facades\Schema;

test('force_enroll migration is a no-op when column already exists', function () {
    expect(Schema::hasColumn('conferences', 'force_enroll'))->toBeTrue();

    $migration = require database_path('migrations/2026_02_27_072008_add_force_enroll_to_conferences_table.php');
    $migration->up();

    expect(Schema::hasColumn('conferences', 'force_enroll'))->toBeTrue();
});

test('is_approved migration is a no-op when column already exists', function () {
    expect(Schema::hasColumn('documents', 'is_approved'))->toBeTrue();

    $migration = require database_path('migrations/2026_03_20_111700_add_is_approved_to_documents_table.php');
    $migration->up();

    expect(Schema::hasColumn('documents', 'is_approved'))->toBeTrue();
});
