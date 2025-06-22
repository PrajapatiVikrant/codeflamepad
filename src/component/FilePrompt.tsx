'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function FilePrompt({
  prompt,
  setPrompt,
}: {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  async function createNewFile() {
    if (!fileName.trim()) {
      toast.error('Please enter a file name');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/Files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: fileName,
          data: 'Write your data here ...',
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success('File created successfully!');
        setPrompt('hidden');
        setFileName('');
      } else {
        toast.error(result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error while creating file:', error);
      toast.error('Internal server error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className={`absolute ${prompt} top-0 left-0 w-full h-full z-30 flex items-center justify-center bg-black/50`}
    >
      <div className="bg-white border border-gray-300 rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">File Name</h2>

        <input
          type="text"
          placeholder="Enter file name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={createNewFile}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Done'}
        </button>
      </div>
    </section>
  );
}
