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

it('removes printfriendly buttons and trailing aggregator figures', function () {
    $html = '<p>Программа</p>'
        .'<div class="printfriendly"><a href="https://www.printfriendly.com/print?url=x"><img src="https://cdn.printfriendly.com/buttons/print-button.png" alt="Print Friendly"></a></div>'
        .'<a href="https://www.google.com/calendar/event?action=TEMPLATE"><img src="https://example.test/gcal.gif" alt="Google Calendar"></a>'
        .'<h3>Спонсоры мероприятия</h3><p><a href="https://sponsor.example">Спонсор</a></p>'
        .'<p>Информационные партнеры</p>'
        .'<figure><a href="https://konferencii.ru/"><img src="https://ksmuconfs.org/wp-content/uploads/logo.png" width="150"></a></figure>'
        .'<div><figure><a href="https://yellmed.ru/"><img src="https://ksmuconfs.org/wp-content/uploads/logo3.png"></a></figure></div>';

    $result = (new WpHtmlSanitizer)->sanitizeAndRewrite($html);

    expect($result)
        ->toContain('Программа')
        ->toContain('Спонсоры мероприятия')
        ->toContain('sponsor.example')
        ->not->toContain('printfriendly')
        ->not->toContain('Print Friendly')
        ->not->toContain('google.com/calendar')
        ->not->toContain('konferencii.ru')
        ->not->toContain('vrachirf.ru')
        ->not->toContain('yellmed.ru')
        ->not->toContain('width=');
});

it('expands a Final Tiles gallery shortcode into images', function () {
    $html = '<p>Фото</p>[FinalTilesGallery id="2"]';
    $galleries = [
        2 => [
            ['src' => '/legacy-files/2021/08/gallery.jpg', 'alt' => 'Gallery photo'],
        ],
    ];

    $result = (new WpHtmlSanitizer)->sanitizeAndRewrite($html, $galleries);

    expect($result)
        ->toContain('legacy-gallery')
        ->toContain('/legacy-files/2021/08/gallery.jpg')
        ->toContain('Gallery photo')
        ->not->toContain('[FinalTilesGallery');
});

it('strips tags from titles', function () {
    expect((new WpHtmlSanitizer)->sanitizeTitle('<strong>Коррупция в сфере образования</strong>'))
        ->toBe('Коррупция в сфере образования');
});
