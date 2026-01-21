import { useEffect, useRef } from 'react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';

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

export default function QuoteBlockFormComponent({
    content,
    setData,
    errors
}: {
    content: any,
    setData: any,
    errors: any
}) {
    const safeContent = content || { text: '' };
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const editorInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (editorRef.current) {
            tinymce.init({
                target: editorRef.current,
                license_key: 'gpl',
                height: 300,
                menubar: false,
                plugins: [],
                toolbar: 'bold italic',
                branding: false,
                promotion: false,
                skin: false,
                content_css: false,
                content_style: [contentCss, contentUiCss].join('\n'),
                setup: (editor) => {
                    editorInstanceRef.current = editor;
                    editor.on('change', () => {
                        const newContent = editor.getContent();
                        setData('content', { text: newContent });
                    });
                    editor.on('input', () => {
                        const newContent = editor.getContent();
                        setData('content', { text: newContent });
                    });
                },
            });
        }

        return () => {
            if (editorInstanceRef.current) {
                editorInstanceRef.current.destroy();
            }
        };
    }, []);

    // Update editor content when prop changes
    useEffect(() => {
        if (editorInstanceRef.current && safeContent.text !== editorInstanceRef.current.getContent()) {
            editorInstanceRef.current.setContent(safeContent.text || '');
        }
    }, [safeContent.text]);

    return (
        <div className="grid gap-2">
            <Label htmlFor="quote-text">Текст цитаты</Label>
            <textarea
                ref={editorRef}
                id="quote-text"
                defaultValue={safeContent.text || ''}
            />
            <InputError message={errors.content} className="mt-2" />
            {errors["content.text"] && <InputError message={errors["content.text"]} className="mt-2" />}
        </div>
    )
}
