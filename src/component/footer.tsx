'use client';

import { Lock, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full flex justify-between items-center px-6 py-3 bg-white border-t shadow-sm fixed bottom-0 left-0 z-10">
      <div className="text-sm text-gray-500">© 2025 Codeflame Technology</div>

      <div className="flex items-center gap-4">
        <button
          className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
          title="Share"
        >
          <Share2 size={18} />
          <span className="hidden sm:inline text-sm">Share</span>
        </button>

        <button
          className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
          title="Lock"
        >
          <Lock size={18} />
          <span className="hidden sm:inline text-sm">Lock</span>
        </button>
      </div>
    </footer>
  );
}
