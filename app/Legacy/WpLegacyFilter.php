<?php

namespace App\Legacy;

class WpLegacyFilter
{
    /**
     * @var list<string>
     */
    private const SPAM_KEYWORDS = [
        'casino',
        'kasyno',
        'казино',
        'betonred',
        'bet-onred',
        'nvkasyno',
        'r2pbet',
        'stake casino',
        'goksector',
        'индивидуалк',
        'анкеты москвы',
        'e-sport',
        'online entertainment ecosystem',
        'plongez dans',
    ];

    /**
     * @var list<string>
     */
    public const KEPT_META_KEYS = [
        '_wp_attached_file',
        '_thumbnail_id',
        '_wp_old_slug',
        '_wp_attachment_metadata',
    ];

    /**
     * @param  array<string, mixed>  $post
     */
    public function dropReason(array $post): ?string
    {
        $type = (string) ($post['post_type'] ?? '');
        $status = (string) ($post['post_status'] ?? '');
        $title = (string) ($post['post_title'] ?? '');

        if ($type === 'revision' || str_starts_with($type, 'revision')) {
            return 'revision';
        }

        if (in_array($status, ['trash', 'auto-draft', 'inherit'], true) && $type !== 'attachment') {
            return $status === 'inherit' ? 'not_post' : $status;
        }

        if ($type === 'attachment') {
            return $status === 'inherit' ? null : 'attachment_not_inherit';
        }

        if ($type !== 'post') {
            return 'not_post';
        }

        if ($status !== 'publish') {
            return $status === '' ? 'not_publish' : $status;
        }

        if (str_contains($title, '<h1>')) {
            return 'spam_html_title';
        }

        if ($this->containsSpamKeyword($post)) {
            return 'spam_keyword';
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $post
     */
    public function containsSpamKeyword(array $post): bool
    {
        $haystack = mb_strtolower(implode("\n", [
            (string) ($post['post_title'] ?? ''),
            (string) ($post['post_excerpt'] ?? ''),
            (string) ($post['post_content'] ?? ''),
        ]));

        foreach (self::SPAM_KEYWORDS as $keyword) {
            if ($keyword !== '' && str_contains($haystack, mb_strtolower($keyword))) {
                return true;
            }
        }

        return false;
    }

    public function shouldKeepMetaKey(?string $key): bool
    {
        if ($key === null || $key === '') {
            return false;
        }

        if (in_array($key, ['_wp_attached_file', '_thumbnail_id', '_wp_old_slug'], true)) {
            return true;
        }

        return false;
    }

    /**
     * @param  array<string, mixed>  $post
     * @return array{id: int, title: string, reason: string}
     */
    public function reviewRow(array $post, string $reason): array
    {
        return [
            'id' => (int) ($post['ID'] ?? 0),
            'title' => (string) ($post['post_title'] ?? ''),
            'reason' => $reason,
        ];
    }
}
