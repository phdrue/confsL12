<?php

use App\Legacy\WpHtmlSanitizer;

it('strips scripts iframes and hidden links and rewrites upload urls', function () {
    $html = '<p>Hello</p><script>alert(1)</script><iframe src="https://evil.test"></iframe>'
        .'<img src="https://ksmuconfs.org/wp-content/uploads/2021/08/photo.jpg" />'
        .'<a href="https://spam.test" style="display:none">hidden</a>';

    $result = (new WpHtmlSanitizer)->sanitizeAndRewrite($html);

    expect($result)
        ->toContain('<p>Hello</p>')
        ->toContain('/legacy-files/2021/08/photo.jpg')
        ->not->toContain('<script')
        ->not->toContain('<iframe')
        ->not->toContain('hidden')
        ->not->toContain('ksmuconfs.org/wp-content/uploads');
});
