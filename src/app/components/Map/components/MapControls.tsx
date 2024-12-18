import L from "leaflet";
import { SelectionType } from "../types";

type MapControlsProps = {
  mapRef: React.RefObject<L.Map>;
  activeSelection: SelectionType;
  setActiveSelection: (selection: SelectionType) => void;
};

export function MapControls({
  activeSelection,
  setActiveSelection,
}: MapControlsProps) {
  const buttons = [
    {
      type: "başlangıç",
      title: "Başlangıç Noktası",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      type: "döküm_noktası",
      title: "Boşaltım Noktası",
      icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    },
    {
      type: "çöp_noktası",
      title: "Çöp Noktası",
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
    },
  ];

  return (
    <div className="leaflet-bar leaflet-control bg-white p-2 flex flex-col gap-1">
      {buttons.map(({ type, title, icon }) => (
        <button
          key={type}
          className={`flex items-center gap-2 p-2 rounded transition-colors ${
            activeSelection === type
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-900 hover:bg-blue-50"
          }`}
          onClick={() =>
            setActiveSelection(
              activeSelection === (type as SelectionType)
                ? null
                : (type as SelectionType)
            )
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={icon}
            ></path>
          </svg>
          <span>{title}</span>
        </button>
      ))}
    </div>
  );
}
