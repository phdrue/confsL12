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
        'img' => ['src', 'alt', 'title'],
        'td' => ['colspan', 'rowspan'],
        'th' => ['colspan', 'rowspan'],
        'div' => ['class'],
    ];

    /**
     * @var list<string>
     */
    private const AGGREGATOR_HOSTS = [
        'konferencii.ru',
        'konferencii.com',
        'na-konferencii.ru',
        'kon-ferenc.ru',
        'konferen.ru',
        'ruconf.ru',
        'vrachirf.ru',
        'yellmed.ru',
        'vsenauki.ru',
        'allconferencealert.com',
        'allconferencealert.ru',
        'conferencealerts.com',
        'worldconferencealerts.com',
        '10times.com',
        'eventseye.com',
        'medconfer.com',
        'scientific.ru',
        'science-community.org',
        'conferencii.com',
        'allconferences.com',
        'eventegg.com',
        'expomap.ru',
    ];

    public function sanitizeTitle(string $title): string
    {
        $title = html_entity_decode($title, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $title = strip_tags($title);
        $title = preg_replace('/\s+/u', ' ', $title) ?? $title;

        return trim($title);
    }

    /**
     * @param  array<int, list<array{src: string, alt?: string}>>  $galleries
     */
    public function sanitize(string $html, array $galleries = []): string
    {
        $html = $this->expandGalleries($html, $galleries);
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

        $this->removeBoilerplate($root);
        $this->removeAggregatorLogos($root);
        $this->removeTrailingAggregatorWall($root);
        $this->scrubNode($root);
        $this->removeEmptyWrappers($root);

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

    /**
     * @param  array<int, list<array{src: string, alt?: string}>>  $galleries
     */
    public function sanitizeAndRewrite(string $html, array $galleries = []): string
    {
        return $this->sanitize($this->rewriteUploadUrls($html), $galleries);
    }

    /**
     * @param  array<int, list<array{src: string, alt?: string}>>  $galleries
     */
    private function expandGalleries(string $html, array $galleries): string
    {
        $replaced = preg_replace_callback(
            '/\[FinalTilesGallery\s+id=["\']?(\d+)["\']?[^\]]*\]/i',
            function (array $matches) use ($galleries): string {
                $images = $galleries[(int) $matches[1]] ?? [];
                if ($images === []) {
                    return '';
                }

                $parts = ['<div class="legacy-gallery">'];
                foreach ($images as $image) {
                    $src = htmlspecialchars($image['src'], ENT_QUOTES | ENT_HTML5, 'UTF-8');
                    $alt = htmlspecialchars($image['alt'] ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8');
                    $parts[] = '<figure><img src="'.$src.'" alt="'.$alt.'"></figure>';
                }
                $parts[] = '</div>';

                return implode('', $parts);
            },
            $html,
        );

        return $replaced ?? $html;
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

            if ($tag === 'div' && $name === 'class') {
                if (trim($value) !== 'legacy-gallery') {
                    $toRemove[] = $attribute->name;
                }

                continue;
            }

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

    private function removeBoilerplate(DOMElement $root): void
    {
        $remove = [];

        foreach ($root->getElementsByTagName('*') as $element) {
            if (! $element instanceof DOMElement) {
                continue;
            }

            if ($this->isPrintFriendlyNode($element) || $this->isGoogleCalendarButton($element)) {
                $remove[] = $element;
            }
        }

        foreach ($remove as $element) {
            $element->parentNode?->removeChild($element);
        }
    }

    private function isPrintFriendlyNode(DOMElement $element): bool
    {
        $haystack = mb_strtolower(
            $element->getAttribute('href').' '
            .$element->getAttribute('src').' '
            .$element->getAttribute('class').' '
            .$element->getAttribute('alt').' '
            .$element->getAttribute('id')
        );

        return str_contains($haystack, 'printfriendly')
            || str_contains($haystack, 'print friendly')
            || str_contains($haystack, 'print-button');
    }

    private function isGoogleCalendarButton(DOMElement $element): bool
    {
        if (strtolower($element->tagName) !== 'a') {
            return false;
        }

        $href = mb_strtolower($element->getAttribute('href'));
        if (! str_contains($href, 'google.com/calendar') && ! str_contains($href, 'calendar.google.com')) {
            return false;
        }

        $hasImage = false;
        $hasText = false;
        foreach ($element->childNodes as $child) {
            if ($child instanceof DOMElement && strtolower($child->tagName) === 'img') {
                $hasImage = true;
            } elseif (trim($child->textContent) !== '') {
                $hasText = true;
            }
        }

        return $hasImage && ! $hasText;
    }

    private function removeAggregatorLogos(DOMElement $root): void
    {
        $remove = [];
        foreach ($root->getElementsByTagName('*') as $element) {
            if (! $element instanceof DOMElement) {
                continue;
            }

            $tag = strtolower($element->tagName);
            if (! in_array($tag, ['figure', 'p', 'div', 'span', 'a'], true)) {
                continue;
            }

            if ($this->isInSponsorSection($element)) {
                continue;
            }

            if ($this->isAggregatorLogoBlock($element)) {
                $remove[] = $element;
            }
        }

        foreach ($remove as $element) {
            $element->parentNode?->removeChild($element);
        }
    }

    private function isInSponsorSection(DOMElement $element): bool
    {
        $node = $element;
        while ($node instanceof DOMElement && $node->getAttribute('id') !== 'legacy-root') {
            $previous = $node->previousSibling;
            while ($previous) {
                if ($previous instanceof DOMElement) {
                    if ($this->isPartnerHeading($previous)) {
                        return false;
                    }
                    $tag = strtolower($previous->tagName);
                    if (in_array($tag, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], true)) {
                        return str_contains(mb_strtolower($previous->textContent), 'спонсор');
                    }
                }
                $previous = $previous->previousSibling;
            }
            $node = $node->parentNode instanceof DOMElement ? $node->parentNode : null;
        }

        return false;
    }

    private function removeTrailingAggregatorWall(DOMElement $root): void
    {
        $containers = [$root];
        foreach ($root->getElementsByTagName('*') as $element) {
            if ($element instanceof DOMElement && in_array(strtolower($element->tagName), ['div', 'span'], true)) {
                $containers[] = $element;
            }
        }

        foreach ($containers as $container) {
            $this->stripTrailingFrom($container);
        }
    }

    private function stripTrailingFrom(DOMElement $root): void
    {
        while ($root->lastChild) {
            $child = $root->lastChild;

            if (! $child instanceof DOMElement) {
                if (trim($child->textContent) === '') {
                    $root->removeChild($child);

                    continue;
                }

                break;
            }

            if ($this->isEmptyElement($child) || $this->isAggregatorLogoBlock($child) || $this->isPartnerHeading($child)) {
                $root->removeChild($child);

                continue;
            }

            break;
        }
    }

    private function isPartnerHeading(DOMElement $element): bool
    {
        $tag = strtolower($element->tagName);
        if (! in_array($tag, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'], true)) {
            return false;
        }

        $text = mb_strtolower(trim($element->textContent));
        if ($text === '') {
            return false;
        }

        if (str_contains($text, 'спонсор')) {
            return false;
        }

        return str_contains($text, 'информационн') || str_contains($text, 'партнер');
    }

    private function isAggregatorLogoBlock(DOMElement $element): bool
    {
        if ($this->containsSponsorHeading($element)) {
            return false;
        }

        if (strtolower($element->tagName) === 'a') {
            return $this->isAggregatorHref($element->getAttribute('href'))
                && $element->getElementsByTagName('img')->length > 0;
        }

        $text = trim(preg_replace('/\s+/u', ' ', $element->textContent) ?? '');
        $links = $element->getElementsByTagName('a');
        $images = $element->getElementsByTagName('img');

        if ($links->length === 0 && $images->length === 0) {
            return false;
        }

        if ($text !== '' && $images->length === 0) {
            return false;
        }

        $aggregatorLinks = 0;
        foreach ($links as $link) {
            if (! $link instanceof DOMElement) {
                continue;
            }
            if ($this->isAggregatorHref($link->getAttribute('href'))) {
                $aggregatorLinks++;
            } elseif (trim($link->textContent) !== '' && $link->getElementsByTagName('img')->length === 0) {
                return false;
            }
        }

        if ($aggregatorLinks === 0) {
            return false;
        }

        return $aggregatorLinks === $links->length || ($images->length > 0 && $aggregatorLinks > 0 && ! $this->hasSubstantialText($element));
    }

    private function containsSponsorHeading(DOMElement $element): bool
    {
        foreach (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as $tag) {
            foreach ($element->getElementsByTagName($tag) as $heading) {
                if (str_contains(mb_strtolower($heading->textContent), 'спонсор')) {
                    return true;
                }
            }
        }

        return str_contains(mb_strtolower($element->textContent), 'спонсоры мероприятия');
    }

    private function hasSubstantialText(DOMElement $element): bool
    {
        $clone = $element->cloneNode(true);
        if (! $clone instanceof DOMElement) {
            return false;
        }

        foreach (iterator_to_array($clone->getElementsByTagName('a')) as $link) {
            $link->parentNode?->removeChild($link);
        }
        foreach (iterator_to_array($clone->getElementsByTagName('img')) as $image) {
            $image->parentNode?->removeChild($image);
        }

        $text = trim(preg_replace('/\s+/u', ' ', $clone->textContent) ?? '');

        return mb_strlen($text) > 40;
    }

    private function isAggregatorHref(string $href): bool
    {
        $href = trim($href);
        if ($href === '') {
            return false;
        }

        $host = parse_url($href, PHP_URL_HOST);
        if (! is_string($host) || $host === '') {
            return false;
        }

        $host = mb_strtolower($host);
        if (str_starts_with($host, 'www.')) {
            $host = substr($host, 4);
        }

        foreach (self::AGGREGATOR_HOSTS as $aggregator) {
            if ($host === $aggregator || str_ends_with($host, '.'.$aggregator)) {
                return true;
            }
        }

        return str_contains($host, 'allconference')
            || str_contains($host, 'conferencealert')
            || str_contains($host, 'konferenc')
            || str_contains($host, 'yellmed')
            || str_contains($host, 'vsenauki')
            || str_contains($host, 'vrachirf')
            || str_contains($host, 'eventegg')
            || str_contains($host, 'expomap');
    }

    private function removeEmptyWrappers(DOMElement $root): void
    {
        $removed = true;
        while ($removed) {
            $removed = false;
            $empty = [];
            foreach ($root->getElementsByTagName('*') as $element) {
                if (! $element instanceof DOMElement) {
                    continue;
                }

                $tag = strtolower($element->tagName);
                if (! in_array($tag, ['div', 'span', 'p', 'figure'], true)) {
                    continue;
                }

                if ($this->isEmptyElement($element)) {
                    $empty[] = $element;
                }
            }

            foreach ($empty as $element) {
                $element->parentNode?->removeChild($element);
                $removed = true;
            }
        }
    }

    private function isEmptyElement(DOMElement $element): bool
    {
        foreach ($element->childNodes as $child) {
            if ($child instanceof DOMElement) {
                return false;
            }

            $text = html_entity_decode($child->textContent, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $text = trim($text, " \t\n\r\0\x0B\xC2\xA0");
            if ($text !== '') {
                return false;
            }
        }

        return true;
    }
}
