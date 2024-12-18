"use client";

import { startEndPointService } from "@/services/startEndPointService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Point = {
  latitude: string;
  longitude: string;
};

export default function StartEndPointManagement() {
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [dumpPoint, setDumpPoint] = useState<Point | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Noktaları getir
  const fetchPoints = async () => {
    try {
      const [start, dump] = await Promise.all([
        startEndPointService.getStartPoint(),
        startEndPointService.getDumpPoint(),
      ]);
      setStartPoint(start);
      setDumpPoint(dump);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Başlangıç noktasını güncelle
  const handleStartPointChange = (field: keyof Point, value: string) => {
    setStartPoint((prev) =>
      prev
        ? { ...prev, [field]: value }
        : {
            latitude: field === "latitude" ? value : "",
            longitude: field === "longitude" ? value : "",
          }
    );
  };

  // Döküm noktasını güncelle
  const handleDumpPointChange = (field: keyof Point, value: string) => {
    setDumpPoint((prev) =>
      prev
        ? { ...prev, [field]: value }
        : {
            latitude: field === "latitude" ? value : "",
            longitude: field === "longitude" ? value : "",
          }
    );
  };

  // Başlangıç noktasını kaydet
  const saveStartPoint = async () => {
    if (!startPoint?.latitude || !startPoint?.longitude) {
      toast.error("Lütfen enlem ve boylam değerlerini giriniz");
      return;
    }

    try {
      const savedPoint = await startEndPointService.saveStartPoint(startPoint);
      setStartPoint(savedPoint);
      toast.success("Başlangıç noktası başarıyla kaydedildi");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Başlangıç noktası kaydedilemedi"
      );
    }
  };

  // Döküm noktasını kaydet
  const saveDumpPoint = async () => {
    if (!dumpPoint?.latitude || !dumpPoint?.longitude) {
      toast.error("Lütfen enlem ve boylam değerlerini giriniz");
      return;
    }

    try {
      const savedPoint = await startEndPointService.saveDumpPoint(dumpPoint);
      setDumpPoint(savedPoint);
      toast.success("Döküm noktası başarıyla kaydedildi");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Döküm noktası kaydedilemedi"
      );
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        <p>{error}</p>
        <button
          onClick={fetchPoints}
          className="mt-2 text-blue-500 hover:text-blue-600"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
                handleStartPointChange("latitude", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Boylam"
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={startPoint?.longitude || ""}
              onChange={(e) =>
                handleStartPointChange("longitude", e.target.value)
              }
            />
          </div>
          <button
            onClick={saveStartPoint}
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
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
                handleDumpPointChange("latitude", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Boylam"
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dumpPoint?.longitude || ""}
              onChange={(e) =>
                handleDumpPointChange("longitude", e.target.value)
              }
            />
          </div>
          <button
            onClick={saveDumpPoint}
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
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
    </div>
  );
}
