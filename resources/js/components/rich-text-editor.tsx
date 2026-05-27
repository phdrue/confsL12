import { useEffect, useRef } from 'react';

// TinyMCE so the global var exists
import tinymce from 'tinymce/tinymce';
// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin.min.css';
// DOM model
import 'tinymce/models/dom';

// Content styles
/* eslint-disable import/no-unresolved */
import contentCss from 'tinymce/skins/content/default/content.min.css?inline';
import contentUiCss from 'tinymce/skins/ui/oxide/content.min.css?inline';
/* eslint-enable import/no-unresolved */

export function getPlainTextLength(content: string): number {
    if (!content) {
        return 0;
    }

    if (!content.includes('<')) {
        return content.length;
    }

    const div = document.createElement('div');
    div.innerHTML = content;

    return (div.textContent || '').length;
}

export function getPlainText(content: string): string {
    if (!content) {
        return '';
    }

    if (!content.includes('<')) {
        return content;
    }

    const div = document.createElement('div');
    div.innerHTML = content;

    return div.textContent || '';
}

export default function RichTextEditor({
    id,
    value,
    onChange,
    height = 300,
    placeholder,
}: {
    id: string;
    value: string;
    onChange: (content: string) => void;
    height?: number;
    placeholder?: string;
}) {
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const editorInstanceRef = useRef<ReturnType<typeof tinymce.Editor> | null>(null);

    useEffect(() => {
        if (editorRef.current) {
            tinymce.init({
                target: editorRef.current,
                license_key: 'gpl',
                height,
                menubar: false,
                plugins: [],
                toolbar: false,
                branding: false,
                promotion: false,
                skin: false,
                content_css: false,
                placeholder,
                content_style: [contentCss, contentUiCss].join('\n'),
                setup: (editor) => {
                    editorInstanceRef.current = editor;
                    const syncContent = () => {
                        onChange(editor.getContent());
                    };
                    editor.on('change', syncContent);
                    editor.on('input', syncContent);
                },
            });
        }

        return () => {
            if (editorInstanceRef.current) {
                editorInstanceRef.current.destroy();
                editorInstanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (editorInstanceRef.current && value !== editorInstanceRef.current.getContent()) {
            editorInstanceRef.current.setContent(value || '');
        }
    }, [value]);

    return (
        <textarea
            ref={editorRef}
            id={id}
            defaultValue={value || ''}
        />
    );
}
