'use client';
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Accordion from "./components/Accordion";
import Map from "./components/Map";
import Navbar from "./components/Navbar";
import RouteOptimization from "./components/RouteOptimization";
import { RouteStatistics } from "./components/RouteStatistics";
import StartEndPointManagement from "./components/StartEndPointManagement";
import VehicleManagement from "./components/VehicleManagement";
import WastePointManagement from "./components/WastePointManagement";

type OptimizationResult = {
  routes: Array<{
    vehicleId: number;
    duration: number;
    steps: Array<{
      location: [number, number];
      type: string;
      arrival: number;
      duration: number;
    }>;
  }>;
};

export default function Home() {
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [vehicles, setVehicles] = useState<Array<{
    id: number;
    plate: string;
    brand: string | null;
    model: string | null;
  }>>([]);

  const handleOptimizationComplete = (result: OptimizationResult, usedVehicles: any[]) => {
    setOptimizationResult(result);
    setVehicles(usedVehicles);
  };

  return (
    <main className="flex flex-col min-h-screen">
      <div><Toaster/></div>
      <Navbar />
      <div className="flex flex-col md:flex-row flex-1">
        <div
          className="w-full md:w-1/4 p-4 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 64px)" }}
        >
          <Accordion title="Araç Yönetimi" id="vehicles">
            <VehicleManagement />
          </Accordion>
          <Accordion title="Çöp Noktaları" id="wastepoints">
            <WastePointManagement />
          </Accordion>
          <Accordion title="Başlangıç ve Boşaltım Noktaları" id="startend">
            <StartEndPointManagement />
          </Accordion>
          <Accordion title="Rota Optimizasyonu" id="routes">
            <RouteOptimization onOptimizationComplete={handleOptimizationComplete} />
            {optimizationResult && vehicles && (
              <div className="mt-4">
                <RouteStatistics 
                  routes={optimizationResult.routes} 
                  vehicles={vehicles}
                />
              </div>
            )}
          </Accordion>
        </div>
        <div className="w-full md:w-3/4 p-4">
          <Map optimizationResult={optimizationResult} />
        </div>
      </div>
    </main>
  );
}
