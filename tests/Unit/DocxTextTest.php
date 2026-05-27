<?php

use App\Support\DocxText;

it('converts html paragraphs to plain text with blank lines between blocks', function () {
    $html = '<p>First paragraph</p><p>Second paragraph</p>';

    expect(DocxText::fromHtml($html))->toBe("First paragraph\n\nSecond paragraph");
});

it('converts br tags to single line breaks within a block', function () {
    $html = 'Line one<br>Line two';

    expect(DocxText::fromHtml($html))->toBe("Line one\nLine two");
});

it('strips formatting tags but keeps text', function () {
    $html = '<p><strong>Bold</strong> and <em>italic</em></p>';

    expect(DocxText::fromHtml($html))->toBe('Bold and italic');
});

it('returns plain text unchanged when no html is present', function () {
    expect(DocxText::fromHtml('Plain thesis text'))->toBe('Plain thesis text');
});

it('prepares template text with word paragraphs instead of html tags', function () {
    $html = '<p>Paragraph one</p><p>Paragraph two</p>';

    $prepared = DocxText::prepareForTemplate($html);

    expect($prepared)
        ->not->toContain('<p>')
        ->not->toContain('&lt;p&gt;')
        ->toContain('Paragraph one</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">Paragraph two')
        ->not->toContain('Paragraph one</w:t><w:br/><w:t>Paragraph two');
});

it('uses soft line breaks only for br tags inside one paragraph', function () {
    $html = '<p>Line one<br>Line two</p>';

    $prepared = DocxText::prepareForTemplate($html);

    expect($prepared)
        ->toContain('Line one</w:t><w:br/><w:t>Line two')
        ->not->toContain('</w:p><w:p>');
});
