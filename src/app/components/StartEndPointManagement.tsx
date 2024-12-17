"use client";

import { useState } from "react";

type Point = {
  id: number;
  latitude: string;
  longitude: string;
  type: "başlangıç" | "döküm_noktası";
};

export default function StartEndPointManagement() {
  const [startPoint, setStartPoint] = useState<Omit<
    Point,
    "id" | "type"
  > | null>(null);
  const [dumpPoint, setDumpPoint] = useState<Omit<Point, "id" | "type"> | null>(
    null
  );

  const handleSave = () => {
    // Burada kaydetme işlemleri yapılacak
    console.log("Kaydedilen noktalar:", { startPoint, dumpPoint });
  };

  return (
    <div>
      <div className="grid gap-4">
        {/* Başlangıç Noktası */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Başlangıç Noktası</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Enlem"
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={startPoint?.latitude || ""}
                onChange={(e) =>
                  setStartPoint((prev) =>
                    prev
                      ? { ...prev, latitude: e.target.value }
                      : { latitude: e.target.value, longitude: "" }
                  )
                }
              />
              <input
                type="text"
                placeholder="Boylam"
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={startPoint?.longitude || ""}
                onChange={(e) =>
                  setStartPoint((prev) =>
                    prev
                      ? { ...prev, longitude: e.target.value }
                      : { latitude: "", longitude: e.target.value }
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Döküm Noktası */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Döküm Noktası</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Enlem"
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={dumpPoint?.latitude || ""}
                onChange={(e) =>
                  setDumpPoint((prev) =>
                    prev
                      ? { ...prev, latitude: e.target.value }
                      : { latitude: e.target.value, longitude: "" }
                  )
                }
              />
              <input
                type="text"
                placeholder="Boylam"
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={dumpPoint?.longitude || ""}
                onChange={(e) =>
                  setDumpPoint((prev) =>
                    prev
                      ? { ...prev, longitude: e.target.value }
                      : { latitude: "", longitude: e.target.value }
                  )
                }
              />
            </div>
          </div>
        </div>

        <button
          className="w-full bg-green-500 text-white p-2.5 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2"
          onClick={handleSave}
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          Kaydet
        </button>
      </div>
    </div>
  );
}
