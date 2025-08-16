'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Menu from './Menu';
import { useEffect, useState } from 'react';
import FilePrompt from './FilePrompt';
import toast, { Toaster } from 'react-hot-toast';
import Footer from './footer';

export default function Main() {
  const [data, setData] = useState<any>({});
  const [prompt, setPrompt] = useState('hidden');
  const [currentFile, setCurrentFile] = useState('');
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {},
        orderedList: {},
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '', // initially blank
    editorProps: {
      attributes: {
        class: 'bg-white h-[60vh] p-4 rounded-md shadow-xs outline-none',
      },
    },
  });

  // ✅ Load file content into editor
  useEffect(() => {
    if (editor && data?.data) {
      editor.commands.setContent(data.data);
    }
  }, [editor, data]);

  // ✅ Save file content
  async function saveContent() {
    if (!editor || !data?._id) return;

    const html = editor.getHTML();
    setSaving(true);

    try {
      const res = await fetch('/api/SaveData', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          fileId: data._id,
          newData: html,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success('File saved successfully!');
      } else {
        toast.error(result.message || 'Failed to save file');
      }
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Internal Server Error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4">
      <Toaster position="top-center" />
      <FilePrompt prompt={prompt} setPrompt={setPrompt} />
      <Menu
        editor={editor}
        setData={setData}
        prompt={prompt}
        setPrompt={setPrompt}
        currentFile={currentFile}
        setCurrentFile={setCurrentFile}
      />
      <EditorContent editor={editor} />
      
      <button
        onClick={saveContent}
        disabled={saving}
        className="text-white text-lg px-6 py-2 bg-blue-600 hover:bg-blue-700 m-2 cursor-pointer rounded-lg shadow-md transition duration-300 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
