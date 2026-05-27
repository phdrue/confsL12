<?php

namespace App\Support;

final class DocxText
{
    /**
     * Convert HTML from rich-text editors to plain text.
     * Block elements become blank-line-separated paragraphs; `<br>` becomes a single newline.
     */
    public static function fromHtml(?string $html): string
    {
        if ($html === null || $html === '') {
            return '';
        }

        if (! str_contains($html, '<')) {
            return $html;
        }

        $html = preg_replace('/<\s*br\s*\/?>/i', "\n", $html) ?? $html;
        $html = preg_replace('/<\s*\/\s*(?:p|div|h[1-6]|li|tr)\s*>/i', "\n\n", $html) ?? $html;
        $html = preg_replace('/<\s*\/\s*(?:ul|ol|table)\s*>/i', "\n\n", $html) ?? $html;

        $text = strip_tags($html);
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = str_replace("\xC2\xA0", ' ', $text);
        $text = preg_replace("/\n{3,}/", "\n\n", $text) ?? $text;

        return trim($text);
    }

    /**
     * Prepare text for PhpWord TemplateProcessor placeholders (including cloneBlock).
     *
     * Block-level breaks become new Word paragraphs (`<w:p>`); single newlines
     * (e.g. from `<br>`) become soft line breaks (`<w:br/>`) within one paragraph.
     */
    public static function prepareForTemplate(?string $text): string
    {
        $text = self::fromHtml($text);

        if ($text === '') {
            return '';
        }

        $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text) ?? '';
        $text = str_replace(["\r\n", "\r"], "\n", $text);
        $text = preg_replace('/[\x{200B}-\x{200D}\x{FEFF}]/u', '', $text) ?? '';
        $text = trim($text);

        $paragraphs = preg_split('/\n{2,}/', $text, -1, PREG_SPLIT_NO_EMPTY);
        $paragraphs = array_values(array_filter(
            array_map('trim', $paragraphs),
            static fn (string $paragraph): bool => $paragraph !== ''
        ));

        if ($paragraphs === []) {
            return '';
        }

        $escapedParagraphs = array_map(
            static fn (string $paragraph): string => self::escapeAndConvertInlineBreaks($paragraph),
            $paragraphs
        );

        $result = $escapedParagraphs[0];

        for ($i = 1, $count = count($escapedParagraphs); $i < $count; $i++) {
            $result .= '</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">'.$escapedParagraphs[$i];
        }

        return $result;
    }

    private static function escapeAndConvertInlineBreaks(string $text): string
    {
        $text = preg_replace(
            '/[^\x{9}\x{A}\x{D}\x{20}-\x{D7FF}\x{E000}-\x{FFFD}\x{10000}-\x{10FFFF}]/u',
            '',
            $text
        ) ?? '';

        $text = htmlspecialchars($text, ENT_QUOTES | ENT_XML1 | ENT_SUBSTITUTE, 'UTF-8');

        return str_replace("\n", '</w:t><w:br/><w:t>', $text);
    }
}
