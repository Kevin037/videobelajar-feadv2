import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function ProgressPopover() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <div
        className="cursor-pointer flex items-center space-x-2 text-green-600 hover:opacity-80"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Misalnya progress bar */}
        <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-400 w-2/3" />
        </div>
        <p>10/12</p>
        <ChevronDown size={20} />
      </div>

      {/* Popover */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl p-4 z-50">
          <h3 className="font-semibold text-sm mb-1">25% Modul Telah Selesai</h3>
          <p className="text-sm text-gray-500 mb-3">
            Selesaikan Semua Modul Untuk Mendapatkan Sertifikat
          </p>
          <button
            disabled
            className="w-full text-sm bg-gray-300 text-white py-2 rounded-lg cursor-not-allowed"
          >
            Ambil Sertifikat
          </button>
        </div>
      )}
    </div>
  );
}
