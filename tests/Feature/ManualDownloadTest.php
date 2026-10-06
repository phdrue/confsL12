<?php

it('provides the manuals for download from public storage', function () {
    expect(public_path('manual1.pdf'))->toBeFile()
        ->and(public_path('manual2.pdf'))->toBeFile();
});
