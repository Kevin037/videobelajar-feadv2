import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { ButtonDisabled, ButtonPrimary } from "../Elements/button";

export default function ProgressPopover(props) {
  const {id, progress} = props;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <div
        className="cursor-pointer flex items-center space-x-2 text-green-600 hover:opacity-80"
        onClick={() => setIsOpen(!isOpen)}
      >
        {progress == 100 ? (
          <div className="flex items-center space-x-2 border border-green-300 rounded-lg p-2">
                        <img src="../assets/champion.svg" alt="" />
                        <p>Ambil Serttifikat</p>
          </div>
        ) : (
          <>
                  <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-400 w-2/3" />
        </div>
        <p>10/12</p>
          </>
        )}
        <ChevronDown size={20} />
      </div>

      {/* Popover */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl p-4 z-50">
          <h3 className="font-semibold text-sm mb-1">{progress != 100 ? progress+"%" : ""} Modul {progress != 100 ? "telah" : "sudah"} selesai</h3>
          <p className="text-sm text-gray-500 mb-3">
            {progress != 100 ? "Selesaikan Semua Modul Untuk Mendapatkan Sertifikat" : "16 dari 16 modul telah selesai, silahkan download sertifikat"}
          </p>
          <ButtonDisabled 
          varian={`${progress != 100 ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`} 
          url={`${progress != 100 ? "#" : `/certificate/${id}`}`}>Ambil Sertifikat</ButtonDisabled>
        </div>
      )}
    </div>
  );
}
