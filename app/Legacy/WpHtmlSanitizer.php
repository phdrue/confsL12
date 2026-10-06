<?php

namespace App\Legacy;

use DOMDocument;
use DOMElement;
use DOMNode;

class WpHtmlSanitizer
{
    /**
     * @var list<string>
     */
    private const ALLOWED_TAGS = [
        'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li',
        'a', 'img', 'strong', 'em', 'b', 'i', 'u', 'table', 'thead', 'tbody',
        'tr', 'th', 'td', 'figure', 'figcaption', 'blockquote', 'hr', 'span',
        'div', 'sup', 'sub', 'pre', 'code',
    ];

    /**
     * @var array<string, list<string>>
     */
    private const ALLOWED_ATTRIBUTES = [
        'a' => ['href', 'title'],
        'img' => ['src', 'alt', 'title', 'width', 'height'],
        'td' => ['colspan', 'rowspan'],
        'th' => ['colspan', 'rowspan'],
    ];

    public function sanitize(string $html): string
    {
        $html = preg_replace('/<!--.*?-->/s', '', $html) ?? $html;
        $html = preg_replace('#<(script|iframe|object|embed|form|style|link|meta)[^>]*>.*?</\1>#is', '', $html) ?? $html;
        $html = preg_replace('#<(script|iframe|object|embed|form|style|link|meta)[^>]*/>#is', '', $html) ?? $html;

        if (trim($html) === '') {
            return '';
        }

        $document = new DOMDocument;
        $previous = libxml_use_internal_errors(true);
        $wrapped = '<div id="legacy-root">'.$html.'</div>';
        $document->loadHTML('<?xml encoding="UTF-8">'.$wrapped, LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        $root = $document->getElementById('legacy-root');
        if (! $root instanceof DOMElement) {
            return '';
        }

        $this->scrubNode($root);

        $output = '';
        foreach ($root->childNodes as $child) {
            $output .= $document->saveHTML($child);
        }

        return trim($output);
    }

    public function rewriteUploadUrls(string $html): string
    {
        $pattern = '#(?:https?:)?(?://(?:www\.)?ksmuconfs\.org)?/wp-content/uploads/([^"\'\s<>?]+)#i';

        $rewritten = preg_replace_callback($pattern, function (array $matches): string {
            $path = rawurldecode($matches[1]);
            $path = str_replace('\\', '/', $path);
            $path = ltrim($path, '/');

            return '/legacy-files/'.$path;
        }, $html);

        return $rewritten ?? $html;
    }

    public function sanitizeAndRewrite(string $html): string
    {
        return $this->sanitize($this->rewriteUploadUrls($html));
    }

    private function scrubNode(DOMNode $node): void
    {
        $remove = [];

        foreach (iterator_to_array($node->childNodes) as $child) {
            if ($child instanceof DOMElement) {
                $tag = strtolower($child->tagName);

                if ($this->isHidden($child) || ! in_array($tag, self::ALLOWED_TAGS, true)) {
                    $remove[] = $child;

                    continue;
                }

                $this->scrubAttributes($child);
                $this->scrubNode($child);
            }
        }

        foreach ($remove as $child) {
            $child->parentNode?->removeChild($child);
        }
    }

    private function scrubAttributes(DOMElement $element): void
    {
        $tag = strtolower($element->tagName);
        $allowed = self::ALLOWED_ATTRIBUTES[$tag] ?? [];
        $toRemove = [];

        foreach (iterator_to_array($element->attributes ?? []) as $attribute) {
            $name = strtolower($attribute->name);
            $value = $attribute->value;

            if (! in_array($name, $allowed, true)) {
                $toRemove[] = $attribute->name;

                continue;
            }

            if (str_starts_with(mb_strtolower($value), 'javascript:')) {
                $toRemove[] = $attribute->name;
            }
        }

        foreach ($toRemove as $name) {
            $element->removeAttribute($name);
        }
    }

    private function isHidden(DOMElement $element): bool
    {
        $style = strtolower($element->getAttribute('style'));

        if ($style === '') {
            return false;
        }

        return str_contains($style, 'display:none')
            || str_contains($style, 'display: none')
            || str_contains($style, 'visibility:hidden')
            || str_contains($style, 'visibility: hidden')
            || str_contains($style, 'font-size:0')
            || str_contains($style, 'font-size: 0')
            || str_contains($style, 'opacity:0')
            || str_contains($style, 'opacity: 0');
    }
}
