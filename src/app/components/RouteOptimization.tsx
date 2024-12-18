"use client"

import { routeOptimizationService } from "@/services/routeOptimizationService";
import { startEndPointService } from "@/services/startEndPointService";
import { vehicleService } from "@/services/vehicleService";
import { wastePointService } from "@/services/wastePointService";
import { useState } from 'react';
import { toast } from "react-hot-toast";

type RouteOptimizationProps = {
  onOptimizationComplete: (result: any) => void;
};

export default function RouteOptimization({ onOptimizationComplete }: RouteOptimizationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startOptimization = async () => {
    setLoading(true);
    setError(null);

    try {
      // Tüm gerekli verileri paralel olarak getir
      const [vehicles, wastePoints, startPoint, dumpPoint] = await Promise.all([
        vehicleService.getAllVehicles(),
        wastePointService.getAllWastePoints(),
        startEndPointService.getStartPoint(),
        startEndPointService.getDumpPoint(),
      ]);

      // Başlangıç ve döküm noktalarının varlığını kontrol et
      if (!startPoint || !dumpPoint) {
        throw new Error("Başlangıç ve döküm noktaları tanımlanmamış");
      }

      // Araç ve çöp noktası varlığını kontrol et
      if (vehicles.length === 0) {
        throw new Error("Tanımlı araç bulunmamaktadır");
      }
      if (wastePoints.length === 0) {
        throw new Error("Tanımlı çöp noktası bulunmamaktadır");
      }

      // Rota optimizasyonunu başlat
      const result = await routeOptimizationService.optimizeRoutes(
        vehicles,
        wastePoints,
        { id: 0, ...startPoint },
        { id: -1, ...dumpPoint }
      );

      onOptimizationComplete(result);
      toast.success("Rota optimizasyonu başarıyla tamamlandı!");

    } catch (err) {
      setError(err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      <button
        onClick={startOptimization}
        disabled={loading}
        className={`w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Rota Optimizasyonunu Başlat
      </button>
    </div>
  );
}

