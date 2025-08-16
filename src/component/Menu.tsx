"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  File,
  UserCircle,
  Trash2,
  Edit2,
  Plus,
} from "lucide-react";
import { Menu as Dropdown } from "@headlessui/react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const buttons = [
  { icon: Heading1, title: "Heading 1", action: (e: Editor) => e.chain().focus().toggleHeading({ level: 1 }).run(), isActive: (e: Editor) => e.isActive("heading", { level: 1 }) },
  { icon: Heading2, title: "Heading 2", action: (e: Editor) => e.chain().focus().toggleHeading({ level: 2 }).run(), isActive: (e: Editor) => e.isActive("heading", { level: 2 }) },
  { icon: Heading3, title: "Heading 3", action: (e: Editor) => e.chain().focus().toggleHeading({ level: 3 }).run(), isActive: (e: Editor) => e.isActive("heading", { level: 3 }) },
  { icon: Bold, title: "Bold", action: (e: Editor) => e.chain().focus().toggleBold().run(), isActive: (e: Editor) => e.isActive("bold") },
  { icon: Italic, title: "Italic", action: (e: Editor) => e.chain().focus().toggleItalic().run(), isActive: (e: Editor) => e.isActive("italic") },
  { icon: Strikethrough, title: "Strikethrough", action: (e: Editor) => e.chain().focus().toggleStrike().run(), isActive: (e: Editor) => e.isActive("strike") },
  { icon: Highlighter, title: "Highlight", action: (e: Editor) => e.chain().focus().toggleHighlight().run(), isActive: (e: Editor) => e.isActive("highlight") },
  { icon: List, title: "Bullet List", action: (e: Editor) => e.chain().focus().toggleBulletList().run(), isActive: (e: Editor) => e.isActive("bulletList") },
  { icon: ListOrdered, title: "Ordered List", action: (e: Editor) => e.chain().focus().toggleOrderedList().run(), isActive: (e: Editor) => e.isActive("orderedList") },
  { icon: AlignLeft, title: "Align Left", action: (e: Editor) => e.chain().focus().setTextAlign("left").run(), isActive: (e: Editor) => e.isActive({ textAlign: "left" }) },
  { icon: AlignCenter, title: "Align Center", action: (e: Editor) => e.chain().focus().setTextAlign("center").run(), isActive: (e: Editor) => e.isActive({ textAlign: "center" }) },
  { icon: AlignRight, title: "Align Right", action: (e: Editor) => e.chain().focus().setTextAlign("right").run(), isActive: (e: Editor) => e.isActive({ textAlign: "right" }) },
  { icon: AlignJustify, title: "Justify", action: (e: Editor) => e.chain().focus().setTextAlign("justify").run(), isActive: (e: Editor) => e.isActive({ textAlign: "justify" }) },
];

type FileType = {
  name: string;
  _id: string;
  data?: string;
};

export default function Menu({
  editor,
  setPrompt,
  prompt,
  setData,
  currentFile,
  setCurrentFile,
}: {
  editor: Editor | null;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  prompt: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
  currentFile: string;
  setCurrentFile: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [files, setFiles] = useState<FileType[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchFiles();
   
  }, [prompt]);

  useEffect(() => {
    fetchFiles();
   
  }, []);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User not logged in");
        return router.push("/");
      
      }

      const res = await fetch("/api/Files", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        toast.error("You are not logged in");
        return router.push("/");
      }

      const data = await res.json();
      setFiles(data);

      if (data.length > 0) {
        setCurrentFile(data[0].name);
        setData(data[0]);
      }

      toast.success("Files loaded");
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Error loading files");
    }
  };


  function handlelogout(){
       localStorage.setItem('token','')
       location.reload();
  }

  const handleFileOpen = async (id: string) => {
    try {

      const res = await fetch(`/api/GetContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          id:id
        }),
      });
      console.log(res)
      if (!res.ok) {
        toast.error("Failed to load file");
        return;
      }

      const data = await res.json();
     
      setData(data);
      setCurrentFile(data.name);
      toast.success("File loaded");
    } catch (err) {
      console.error("Error opening file:", err);
      toast.error("Error opening file");
    }
  };

  if (!editor) return null;
async function DeleteFile(id: string) {
  try {
    const res = await fetch("/api/Files", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure 'token' is defined
      },
      body: JSON.stringify({ fileId: id }), // Match key name with backend
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(result.message || "Failed to delete file");
      return;
    }

    toast.success("File deleted successfully!");
    console.log(result)
    setFiles(result);
  } catch (error) {
    console.error("Error deleting file:", error);
    toast.error("Error deleting file");
  }
}
  return (
    <div className="bg-white border-b shadow-md px-4 py-2 sticky top-0 z-20">
      <Toaster position="top-center" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text whitespace-nowrap">
          Codeflame<span className="text-gray-800">Pad</span>
        </div>

        <div className="text-center mt-2 md:mt-0">
          <p className="text-sm md:text-base font-medium text-gray-800">
            📝 Current File:{" "}
            <span className="font-semibold text-blue-600">{currentFile}</span>
          </p>
        </div>

        <Dropdown as="div" className="relative">
          <Dropdown.Button className="px-3 py-2 cursor-pointer border rounded-md bg-gray-100 hover:bg-gray-200 text-sm flex gap-2 items-center">
            <UserCircle size={18} />
            Profile
          </Dropdown.Button>
          <Dropdown.Items className="absolute right-0 mt-2 w-44 bg-white shadow-md border rounded-md z-30">
            <div className="p-2">
              <button className="w-full cursor-pointer text-left px-4 py-2 hover:bg-gray-100">
               {localStorage.getItem('username')}
              </button>

              <button onClick={handlelogout} className="w-full cursor-pointer text-left px-4 py-2 hover:bg-gray-100 text-red-500">
                Logout
              </button>
            </div>
          </Dropdown.Items>
        </Dropdown>
      </div>

      <div className="mt-4 flex flex-wrap justify-between items-center gap-4">
        <Dropdown as="div" className="relative">
          <Dropdown.Button className="px-3 py-2 cursor-pointer border rounded-md bg-gray-100 hover:bg-gray-200 text-sm flex gap-2 items-center">
            <File size={18} />
            File
          </Dropdown.Button>
          <Dropdown.Items className="absolute left-0 mt-2 w-60 bg-white shadow-md border rounded-md z-30">
            <div className="p-2">
              <button
                onClick={() => setPrompt("flex")}
                className="flex cursor-pointer  items-center gap-2 w-full p-2 hover:bg-gray-100 rounded"
              >
                <Plus size={16} /> New File
              </button>
            </div>
            <hr />
            {files.map((file, index) => (
              <div
                key={index}
                className="flex justify-between items-center px-4 py-2 hover:bg-gray-100"
              >
                <button
                  className="text-left truncate cursor-pointer w-full text-sm text-gray-800"
                  onClick={() => handleFileOpen(file._id)}
                >
                  {file.name}
                </button>
                <div className="flex gap-2 ml-2">
                 
                  <button onClick={()=>DeleteFile(file._id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </Dropdown.Items>
        </Dropdown>

        <div className="flex flex-wrap gap-2 overflow-x-auto max-w-full">
          {buttons.map(({ icon: Icon, action, isActive, title }, index) => (
            <button
              key={index}
              onClick={() => action(editor)}
              title={title}
              className={`p-2 cursor-pointer rounded-md border transition duration-150 ease-in-out ${isActive(editor)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                }`}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
