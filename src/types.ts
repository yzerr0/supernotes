import { Content } from '@tiptap/react';

export interface Note {
    id: string;
    title: string;
    content: Content;
    updatedAt: Date;
}

export interface UserData {
    username: string;
    passphrase: string;
}