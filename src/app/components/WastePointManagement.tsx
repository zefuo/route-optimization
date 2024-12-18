"use client";

import { wastePointService } from "@/services/wastePointService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type WastePoint = {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
};

export default function WastePointManagement() {
  const [wastePoints, setWastePoints] = useState<WastePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newWastePoint, setNewWastePoint] = useState<Omit<WastePoint, "id">>({
    name: "",
    latitude: "",
    longitude: "",
  });

  // Çöp noktalarını getir
  const fetchWastePoints = async () => {
    try {
      const data = await wastePointService.getAllWastePoints();
      setWastePoints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Yeni çöp noktası ekle
  const addWastePoint = async () => {
    if (!newWastePoint.name.trim()) {
      toast.error("Lütfen nokta adı giriniz");
      return;
    }

    if (!newWastePoint.latitude.trim() || !newWastePoint.longitude.trim()) {
      toast.error("Enlem ve boylam alanları zorunludur");
      return;
    }

    const lat = parseFloat(newWastePoint.latitude);
    const lng = parseFloat(newWastePoint.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      toast.error("Lütfen geçerli enlem ve boylam değerleri giriniz");
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error(
        "Lütfen geçerli koordinat aralığı giriniz\nEnlem: -90 ile 90 arası\nBoylam: -180 ile 180 arası"
      );
      return;
    }

    try {
      const addedPoint = await wastePointService.addWastePoint(newWastePoint);
      setWastePoints([...wastePoints, addedPoint]);
      setNewWastePoint({ name: "", latitude: "", longitude: "" });
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Çöp noktası eklenirken bir hata oluştu"
      );
    }
  };

  // Çöp noktası sil
  const deleteWastePoint = async (id: number) => {
    try {
      await wastePointService.deleteWastePoint(id);
      setWastePoints(wastePoints.filter((point) => point.id !== id));
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Çöp noktası silinirken bir hata oluştu"
      );
    }
  };

  // Sayfa yüklendiğinde çöp noktalarını getir
  useEffect(() => {
    fetchWastePoints();
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
          onClick={fetchWastePoints}
          className="mt-2 text-blue-500 hover:text-blue-600"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-2 mb-3">
        <div className="grid grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="* Nokta Adı"
            className="col-span-2 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={newWastePoint.name}
            onChange={(e) =>
              setNewWastePoint({ ...newWastePoint, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="* Enlem"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={newWastePoint.latitude}
            onChange={(e) =>
              setNewWastePoint({ ...newWastePoint, latitude: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="* Boylam"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={newWastePoint.longitude}
            onChange={(e) =>
              setNewWastePoint({ ...newWastePoint, longitude: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <button
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
            onClick={addWastePoint}
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Nokta Ekle
          </button>
        </div>
      </div>

      <div>
        {wastePoints.length > 0 ? (
          <div className="grid gap-2">
            {wastePoints.map((point, index) => (
              <div key={point.id} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 bg-white border rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{point.name}</span>
                        {point.latitude && point.longitude && (
                          <span className="text-sm text-gray-500">
                            ({point.latitude}, {point.longitude})
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteWastePoint(point.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <svg
              className="w-10 h-10 mx-auto text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Henüz çöp noktası eklenmemiş
          </div>
        )}
      </div>
    </div>
  );
}
