import React from 'react';
import { useEditor, EditorContent, JSONContent, generateText } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Note } from './types';
import styles from './Editor.module.css';

const extensions = [StarterKit];

type Props = {
    note: Note;
    onChange: (content: JSONContent, title?: string) => void;
}


function Editor({ note, onChange }: Props) {
    const editor = useEditor({
        extensions,
        content: note.content,
        editorProps: {
            attributes: {
                class: styles.textEditor,
            },
        },
        onUpdate: ({ editor }) => {
            const editorContent = editor.getJSON();
            const firstContent = editorContent.content?.[0];
            onChange(editorContent, firstContent && generateText(firstContent, extensions));
        },
    }, [note.id]);

    const boldToggle = () => {
        editor ? editor.chain().focus().toggleBold().run() : null;
    }
    const italicToggle = () => {
        editor ? editor.chain().focus().toggleItalic().run() : null;
    }

    return (
        <div className={styles.editorContainer}>
        <div className={styles.toolbar}>
            <button className={editor?.isActive('bold') ? styles.toolbarButtonActive : styles.toolbarButton} onClick={boldToggle}>Bold</button>
            <button className={editor?.isActive('italic') ? styles.toolbarButtonActive : styles.toolbarButton} onClick={italicToggle}>Italic</button>
        </div>
        <EditorContent editor={editor} className={styles.textEditorContent} />
        </div>
    )
}

export default Editor;