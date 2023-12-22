import React from 'react';
import { useEditor, EditorContent, JSONContent, generateText, EditorProvider, useCurrentEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from '@tiptap/extension-underline';
import { Note } from './types';
import styles from './Editor.module.css';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';

const extensions = [StarterKit, Underline];

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

    const underlineToggle = () => {
        editor ? editor.chain().focus().toggleUnderline().run() : null;
    }

    const strikeToggle = () => {
        editor ? editor.chain().focus().toggleStrike().run() : null;
    }

    const codeToggle = () => {
        editor ? editor.chain().focus().toggleCode().run() : null;
    }

    const clearMarks = () => {
        editor ? editor.chain().focus().unsetAllMarks().run() : null;
    }

    const clearNodes = () => {
        editor ? editor.chain().focus().clearNodes().run() : null;
    }

    /*
    const highlightToggle = () => {
        editor ? editor.chain().focus().toggleHighlight().run() : null;
    }
    
    const textColorToggle = (color: string) => {
        editor ? editor.chain().focus().setTextColor(color).run() : null;
    }

    const backgroundColorToggle = (color: string) => {
        editor ? editor.chain().focus().setBackgroundColor(color).run() : null;
    }
    */

    const paragraphToggle = () => {
        editor ? editor.chain().focus().setParagraph().run() : null;
    }

    const heading1Toggle = () => {
        editor ? editor.chain().focus().setHeading({ level: 1 }).run() : null;
    }

    const heading2Toggle = () => {
        editor ? editor.chain().focus().setHeading({ level: 2 }).run() : null;
    }

    const heading3Toggle = () => {
        editor ? editor.chain().focus().setHeading({ level: 3 }).run() : null;
    }

    const heading4Toggle = () => {
        editor ? editor.chain().focus().setHeading({ level: 4 }).run() : null;
    }

    const heading5Toggle = () => {
        editor ? editor.chain().focus().setHeading({ level: 5 }).run() : null;
    }

    const heading6Toggle = () => {
        editor ? editor.chain().focus().setHeading({ level: 6 }).run() : null;
    }

    

    return (
        <div className={styles.editorContainer}>
            <div className={styles.toolbar}>
                <div className={styles.toolbarLarge}>
                    <button className={editor?.isActive('bold') ? styles.toolbarButtonActive : styles.toolbarButton} onClick={boldToggle}>bold</button>
                    <button className={editor?.isActive('italic') ? styles.toolbarButtonActive : styles.toolbarButton} onClick={italicToggle}>italic</button>
                    <button className={editor?.isActive('underline') ? styles.toolbarButtonActive : styles.toolbarButton } onClick={underlineToggle}>underline</button>
                    <button className={editor?.isActive('strike') ? styles.toolbarButtonActive : styles.toolbarButton} onClick={strikeToggle}>strike</button>
                    <button className={editor?.isActive('code') ? styles.toolbarButtonActive : styles.toolbarButton} onClick={codeToggle}>code</button>
                </div>
                <div className={styles.toolbarMedium}>
                    <button className={editor?.isActive('paragraph') ? styles.toolbarButtonActive : styles.toolbarButton} onClick={paragraphToggle}>paragraph</button>
                    <button className={editor?.isActive('heading', { level: 1 }) ? styles.toolbarButtonActive : styles.toolbarButton} onClick={heading1Toggle}>h1</button>
                    <button className={editor?.isActive('heading', { level: 2 }) ? styles.toolbarButtonActive : styles.toolbarButton} onClick={heading2Toggle}>h2</button>
                    <button className={editor?.isActive('heading', { level: 3 }) ? styles.toolbarButtonActive : styles.toolbarButton} onClick={heading3Toggle}>h3</button>
                    <button className={editor?.isActive('heading', { level: 4 }) ? styles.toolbarButtonActive : styles.toolbarButton} onClick={heading4Toggle}>h4</button>
                    <button className={editor?.isActive('heading', { level: 5 }) ? styles.toolbarButtonActive : styles.toolbarButton} onClick={heading5Toggle}>h5</button><button className={editor?.isActive('heading', { level: 6 }) ? styles.toolbarButtonActive : styles.toolbarButton} onClick={heading6Toggle}>h6</button>
                </div>
                <div className={styles.toolbarSmall}>
                    <button className={styles.toolbarButton} onClick={clearMarks}>clear marks</button>
                    <button className={styles.toolbarButton} onClick={clearNodes}>clear nodes</button>
                </div>
            </div>
            <EditorContent editor={editor} className={styles.textEditorContent}/>
        </div>
    )
}

export default Editor;