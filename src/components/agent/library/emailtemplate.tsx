import { useState, useEffect, useRef } from "react";
import { HiOutlineSearch, HiPlus, HiX } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import Signature from "@/components/admin/library/signature";
import { useLocation } from "react-router-dom";
import {
  useEmailTemplate,
  type EmailTemplate as EmailTemplateData,
} from "@/hooks/useEmailTemplate";
import { toast } from "react-hot-toast";
import Loader from "@/components/common/Loader";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import {
  Bold, Italic, Underline as UnderlineIcon,
  AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, Image as ImageIcon, Minus,
  Braces, Video, ChevronDown,
} from "lucide-react";
import api from "@/lib/axios";

// Merge fields shown in the UI. `label` is human-friendly; `token` is the safe
// placeholder stored in the template (HTML-safe — avoids clashing with real tags).
const MERGE_FIELDS: { label: string; token: string }[] = [
  { label: "Contact Name", token: "{{fullName}}" },
  { label: "First Name", token: "{{firstName}}" },
  { label: "Last Name", token: "{{lastName}}" },
  { label: "Address", token: "{{address}}" },
  { label: "City", token: "{{city}}" },
  { label: "State", token: "{{state}}" },
  { label: "Zip", token: "{{zip}}" },
  { label: "Email", token: "{{email}}" },
  { label: "Phone", token: "{{phone}}" },
  { label: "Agent Name", token: "{{agentName}}" },
];

// =================================================================
// DATA TYPES AND INTERFACES
// =================================================================

interface EmailTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    templateName: string;
    subject: string;
    content: string;
    includeSignature: boolean;
  }) => void;
  templateData: EmailTemplateData | null;
  loading: boolean;
}

// Reusable toolbar button (matches signature editor style)
const ToolbarButton = ({
  onClick, active, title, children,
}: {
  onClick: () => void; active?: boolean; title: string; children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    title={title}
    type="button"
    className={`p-1.5 rounded transition-colors duration-150 ${active
      ? "bg-[#FFCA06] text-gray-950"
      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
      }`}
  >
    {children}
  </button>
);

const ToolbarDivider = () => <div className="w-px h-5 bg-gray-200 dark:bg-slate-600 mx-1" />;

// DELETE MODAL
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1200] p-3">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm text-center p-8">
        <div className="mx-auto flex items-center justify-center w-fit">
          <span className="text-3xl text-red-600">
            <IoWarningOutline />
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-5">
          Delete Template?
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Once deleted, this cannot be undone.
        </p>

        <div className="mt-8 flex justify-center space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 w-full bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-8 py-2.5 w-full bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// BombBomb video type
interface BombBombVideo {
  id: string;
  name: string;
  thumbUrl: string;
  shortUrl: string;
  createdAt: string;
}

// MODAL
const EmailTemplateModal = ({
  isOpen,
  onClose,
  onSave,
  templateData,
  loading,
}: EmailTemplateModalProps) => {
  const [templateName, setTemplateName] = useState("");
  const [subject, setSubject] = useState("");
  const [includeSignature, setIncludeSignature] = useState(false);

  const [showFieldMenu, setShowFieldMenu] = useState(false);
  const [showSubjectFieldMenu, setShowSubjectFieldMenu] = useState(false);

  // BombBomb picker
  const [showBombBomb, setShowBombBomb] = useState(false);
  const [videos, setVideos] = useState<BombBombVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const subjectRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "outline-none min-h-[220px] p-3 prose prose-sm max-w-none dark:prose-invert",
      },
    },
  });

  // Load template data into the form / editor whenever the modal opens
  useEffect(() => {
    if (!editor) return;
    if (templateData && isOpen) {
      setTemplateName(templateData.templateName);
      setSubject(templateData.subject);
      setIncludeSignature(!!templateData.includeSignature);
      editor.commands.setContent(templateData.content || "");
    } else if (isOpen) {
      setTemplateName("");
      setSubject("");
      setIncludeSignature(false);
      editor.commands.setContent("");
    }
  }, [templateData, isOpen, editor]);

  const fetchVideos = async () => {
    setLoadingVideos(true);
    try {
      const res = await api.get("/system-settings/integration/bombbomb/videos");
      if (res.data.success) setVideos(res.data.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to load BombBomb library");
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    if (showBombBomb) fetchVideos();
  }, [showBombBomb]);

  if (!isOpen) return null;

  const insertFieldIntoContent = (token: string) => {
    editor?.chain().focus().insertContent(token).run();
    setShowFieldMenu(false);
  };

  const insertFieldIntoSubject = (token: string) => {
    const el = subjectRef.current;
    if (el) {
      const start = el.selectionStart ?? subject.length;
      const end = el.selectionEnd ?? subject.length;
      setSubject(subject.slice(0, start) + token + subject.slice(end));
    } else {
      setSubject((s) => s + token);
    }
    setShowSubjectFieldMenu(false);
  };

  const insertVideo = (video: BombBombVideo) => {
    // Thumbnail image + a guaranteed-clickable text link beneath it.
    const thumb = video.thumbUrl
      ? `<img src="${video.thumbUrl}" alt="${video.name}" style="max-width:360px;border-radius:8px;" />`
      : "";
    editor
      ?.chain()
      .focus()
      .insertContent(
        `${thumb}<p><a href="${video.shortUrl}" target="_blank" rel="noopener">▶ Watch the video: ${video.name}</a></p>`
      )
      .run();
    setShowBombBomb(false);
    toast.success("Video added to template");
  };

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  };

  const handleSave = () => {
    const content = editor?.getHTML() || "";
    const isEmptyContent = !content || content === "<p></p>";
    if (!templateName || !subject || isEmptyContent) {
      toast.error("Please fill all fields");
      return;
    }
    onSave({ templateName, subject, content, includeSignature });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1100] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {templateData ? "Edit Email Template" : "Add Email Template"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <HiX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto custom-scrollbar">
          {/* Name */}
          <div className="bg-gray-100 dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-700 flex flex-col gap-1 text-sm">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Template name
            </label>
            <input
              value={templateName}
              className="bg-transparent outline-none dark:text-white"
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>

          {/* Subject */}
          <div className="bg-gray-100 dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-700 flex flex-col gap-1 text-sm">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Subject
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSubjectFieldMenu((v) => !v)}
                  className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700"
                >
                  <Braces className="w-3.5 h-3.5" /> Field <ChevronDown className="w-3 h-3" />
                </button>
                {showSubjectFieldMenu && (
                  <div className="absolute right-0 mt-1 w-44 max-h-60 overflow-y-auto bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-xl rounded-lg z-[100]">
                    {MERGE_FIELDS.map((f) => (
                      <button
                        key={f.token}
                        type="button"
                        onClick={() => insertFieldIntoSubject(f.token)}
                        className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-white"
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <input
              ref={subjectRef}
              value={subject}
              className="bg-transparent outline-none dark:text-white"
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
            />
          </div>

          {/* Content — rich editor */}
          <div className="rounded-lg border border-gray-200 dark:border-slate-700 overflow-visible">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
              <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")} title="Bold">
                <Bold className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")} title="Italic">
                <Italic className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive("underline")} title="Underline">
                <UnderlineIcon className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarDivider />
              <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign("left").run()} active={editor?.isActive({ textAlign: "left" })} title="Align Left">
                <AlignLeft className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign("center").run()} active={editor?.isActive({ textAlign: "center" })} title="Align Center">
                <AlignCenter className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign("right").run()} active={editor?.isActive({ textAlign: "right" })} title="Align Right">
                <AlignRight className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarDivider />
              <label title="Text Color" className="cursor-pointer p-1.5 rounded hover:bg-gray-100 dark:hover:bg-slate-700">
                <input
                  type="color"
                  className="w-4 h-4 cursor-pointer rounded border-0 bg-transparent"
                  onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
                />
              </label>
              <ToolbarButton onClick={addLink} title="Add Link">
                <LinkIcon className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={addImage} title="Add Image">
                <ImageIcon className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().setHorizontalRule().run()} title="Divider Line">
                <Minus className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarDivider />

              {/* Merge field dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFieldMenu((v) => !v)}
                  className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-200 px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
                  title="Insert merge field"
                >
                  <Braces className="w-4 h-4" /> Insert Field <ChevronDown className="w-3 h-3" />
                </button>
                {showFieldMenu && (
                  <div className="absolute left-0 mt-1 w-44 max-h-60 overflow-y-auto bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-xl rounded-lg z-[100]">
                    {MERGE_FIELDS.map((f) => (
                      <button
                        key={f.token}
                        type="button"
                        onClick={() => insertFieldIntoContent(f.token)}
                        className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-white"
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* BombBomb video */}
              <button
                type="button"
                onClick={() => setShowBombBomb(true)}
                className="flex items-center gap-1 text-xs font-medium text-red-600 px-2 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Insert BombBomb video"
              >
                <Video className="w-4 h-4" /> BombBomb
              </button>
            </div>

            {/* Editor */}
            <div className="bg-white dark:bg-slate-800">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Include signature toggle */}
          <label className="flex items-center justify-between bg-gray-100 dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-700 cursor-pointer">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Include Signature</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Append your saved signature when this template is sent</span>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={includeSignature}
                onChange={() => setIncludeSignature((v) => !v)}
              />
              <div className={`block w-[48px] h-[24px] rounded-full transition-colors ${includeSignature ? "bg-black dark:bg-yellow-400" : "bg-gray-300 dark:bg-slate-700"}`} />
              <div className={`absolute left-0.5 top-0.5 bg-white dark:bg-slate-900 w-[20px] h-[20px] rounded-full transition-transform ${includeSignature ? "translate-x-6" : ""}`} />
            </div>
          </label>
        </div>

        <div className="p-5 border-t border-gray-200 dark:border-slate-700 flex space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full bg-gray-200 dark:bg-slate-700 dark:text-white py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 font-semibold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-yellow-400 py-2.5 rounded-lg font-semibold hover:bg-yellow-500 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* BombBomb picker modal */}
      {showBombBomb && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1200] p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">BombBomb Library</h3>
              <button onClick={() => setShowBombBomb(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                <HiX className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              {loadingVideos ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
                  <p className="text-xs uppercase tracking-widest text-gray-400">Accessing Library...</p>
                </div>
              ) : videos.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {videos.map((video) => (
                    <button
                      key={video.id}
                      type="button"
                      onClick={() => insertVideo(video)}
                      className="group flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-red-500 transition-all text-left"
                    >
                      <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-slate-800 shrink-0">
                        {video.thumbUrl && (
                          <img src={video.thumbUrl} alt={video.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{video.name}</h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">Added {new Date(video.createdAt).toLocaleDateString()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No videos found in your BombBomb account.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =================================================================
// MAIN COMPONENT — NOW SCRIPT STYLE
// =================================================================

const EmailTemplate = () => {
  const {
    getEmailTemplates,
    createEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate,
    loading,
  } = useEmailTemplate();
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplateData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] =
    useState<EmailTemplateData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToDeleteId, setTemplateToDeleteId] = useState<string | null>(
    null,
  );

  const location = useLocation();
  const showSignature = location.pathname === "/admin/library";

  const fetchTemplates = async () => {
    const data = await getEmailTemplates();
    setEmailTemplates(data);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSaveTemplate = async (data: {
    templateName: string;
    subject: string;
    content: string;
    includeSignature: boolean;
  }) => {
    if (templateToEdit) {
      const updated = await updateEmailTemplate(templateToEdit.id, data);
      if (updated) {
        toast.success("Template updated successfully");
        setIsEditModalOpen(false);
        fetchTemplates();
      }
    } else {
      const created = await createEmailTemplate(data);
      if (created) {
        toast.success("Template created successfully");
        setIsEditModalOpen(false);
        fetchTemplates();
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (templateToDeleteId) {
      const success = await deleteEmailTemplate(templateToDeleteId);
      if (success) {
        toast.success("Template deleted successfully");
        setIsDeleteModalOpen(false);
        fetchTemplates();
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const updated = await updateEmailTemplate(id, { status: !currentStatus });
    if (updated) {
      setEmailTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: updated.status } : t)),
      );
      toast.success(`Template ${updated.status ? "activated" : "deactivated"}`);
    } else {
      toast.error("Failed to update status");
    }
  };

  const filteredTemplates = emailTemplates.filter((t) =>
    t.templateName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <div className="relative w-full sm:w-[40%] py-[12px] px-[24px] border-[1.5px] border-[#D8DCE1] dark:border-slate-700 bg-white dark:bg-slate-800 rounded-[1000000px]">
          <input
            placeholder="Search by email template name"
            className="w-full text-[#495057] dark:text-white bg-transparent text-sm outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <HiOutlineSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-[#495057] dark:text-gray-400" />
        </div>

        <button
          onClick={() => {
            setTemplateToEdit(null);
            setIsEditModalOpen(true);
          }}
          className="bg-[#FFCA06] hover:bg-yellow-500 py-[8px] px-[24px] rounded-[12px] flex items-center text-[16px] font-medium text-black"
        >
          <HiPlus className="mr-2" /> Add Template
        </button>
      </div>

      {/* SCRIPT STYLE CARDS */}
      <div className="space-y-4">
        {filteredTemplates.length > 0
          ? filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white dark:bg-slate-800 p-[16px] rounded-[16px] shadow-sm border border-[#EBEDF0] dark:border-slate-700 grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto_auto] gap-x-4 gap-y-3 items-center"
              >
                {/* NAME */}
                <div className="font-[500] text-[14px] text-[#0E1011] dark:text-white col-span-2 lg:col-span-1">
                  {template.templateName}
                </div>

                {/* CREATED BY */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created by
                  </span>
                  <span className="text-sm font-medium dark:text-white">
                    {template.library?.user?.fullName || "System"}
                  </span>
                </div>

                {/* CREATED ON */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created on
                  </span>
                  <span className="text-sm font-medium dark:text-white">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* MODIFIED */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Modified on
                  </span>
                  <span className="text-sm font-medium dark:text-white">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* STATUS */}
                <div className="flex flex-col gap-1 mr-20">
                  <span className="text-[#495057] dark:text-gray-400 text-[12px] font-[400]">
                    Status
                  </span>

                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={template.status}
                        onChange={() =>
                          handleToggleStatus(template.id, !!template.status)
                        }
                      />
                      <div
                        className={`block w-[48px] h-[24px] rounded-full transition-colors ${template.status ? "bg-black dark:bg-yellow-400" : "bg-gray-300 dark:bg-slate-700"}`}
                      ></div>
                      <div
                        className={`dot absolute left-0.5 top-0.5 bg-white dark:bg-slate-900 w-[20px] h-[20px] rounded-full transition-transform ${template.status ? "translate-x-6" : ""}`}
                      ></div>
                    </div>
                  </label>
                </div>

                {/* 3 DOT MENU */}
                <div className="relative justify-self-end">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === template.id ? null : template.id,
                      )
                    }
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
                  >
                    <BsThreeDots className="h-5 w-5" />
                  </button>

                  {openMenuId === template.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-xl rounded-lg z-[100]">
                      <button
                        onClick={() => {
                          setTemplateToEdit(template);
                          setIsEditModalOpen(true);
                          setOpenMenuId(null);
                        }}
                        className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setTemplateToDeleteId(template.id);
                          setIsDeleteModalOpen(true);
                          setOpenMenuId(null);
                        }}
                        className="block px-4 py-2 text-sm w-full text-left text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          : !loading && (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                No email templates found.
              </div>
            )}

        {loading && (
          <Loader/>
        )}

        {showSignature && <Signature />}
      </div>

      {/* MODALS */}
      <EmailTemplateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTemplate}
        templateData={templateToEdit}
        loading={loading}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={loading}
      />
    </div>
  );
};

export default EmailTemplate;
