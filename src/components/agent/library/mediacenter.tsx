import { useState, useEffect } from "react";
import { HiOutlineSearch, HiPlus } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import UploadRecordingModal from "@/components/modal/uploadrecordingmodal";
import { useMediaCenter, type MediaCenterItem } from "@/hooks/useMediaCenter";
import { toast } from "react-hot-toast";
import Loader from "@/components/common/Loader";

const MediaCenter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getMediaCenterItems, deleteMediaCenterItem, loading } =
    useMediaCenter();
  const [media, setMedia] = useState<MediaCenterItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const fetchMedia = async () => {
    const data = await getMediaCenterItems();
    setMedia(data);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

    const handleDelete = (id: string) => {
    toast(
      (t) => (
        <span className="flex flex-wrap items-center gap-2">
          <span className="dark:text-white">Are you sure you want to delete this recording?</span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const success = await deleteMediaCenterItem(id);
                if (success) {
                  toast.success("Recording deleted successfully");
                  fetchMedia();
                }
              }}
              className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-md font-medium hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs px-3 py-1.5 rounded-md font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </span>
      ),
      { duration: 6000, style: { background: '#1e293b', color: '#fff' } },
    );
    setOpenMenuId(null);
  };

  const filteredMedia = media.filter((item) =>
    item.templateName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="">
      {/* Search + Add button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <div className="relative w-full sm:w-[40%]">
          <input
            type="text"
            placeholder="Search by template name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-slate-700 rounded-full bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-sm text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <HiOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        <button
          onClick={openModal}
          className="bg-yellow-400 text-sm hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg flex items-center transition-colors shadow-sm"
        >
          <HiPlus className="h-5 w-5 mr-2" />
          Add Template
        </button>
      </div>

      <div className="space-y-4">
        {loading && media.length === 0 ? (
          <Loader />
        ) : filteredMedia.length > 0 ? (
          filteredMedia.map((med) => (
            <div
              key={med.id}
              className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition hover:shadow-md border border-gray-100 dark:border-slate-700"
            >
              <div className="font-medium text-base text-gray-900 dark:text-white w-full lg:w-1/4 truncate">
                {med.templateName}
              </div>

              <div className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex flex-col">
                  <span className="text-gray-500 dark:text-gray-400 text-xs text-nowrap">
                    Type of Recording
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {med.mediaType.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-500 dark:text-gray-400 text-xs text-nowrap">
                    Created by
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white truncate">
                    {med.library?.user?.fullName || "System"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-500 dark:text-gray-400 text-xs text-nowrap">
                    Created on
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(med.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === med.id ? null : med.id)
                      }
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <BsThreeDots className="h-5 w-5" />
                    </button>
                    {openMenuId === med.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700 z-20 overflow-hidden">
                        <button
                          onClick={() => handleDelete(med.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No recordings found.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <UploadRecordingModal onClose={closeModal} onSuccess={fetchMedia} />
      )}
    </div>
  );
};

export default MediaCenter;
