import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { MapControls } from "./components/MapControls";
import { useInitialPoints } from "./hooks/useInitialPoints";
import { useMapEvents } from "./hooks/useMapEvents";
import { useOptimizationEffect } from "./hooks/useOptimizationEffect";
import { MapProps, SelectionType } from "./types";

export default function Map({ optimizationResult }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const routeLinesRef = useRef<L.LayerGroup[]>([]);
  const markersRef = useRef<L.Marker[]>([]);
  const [activeSelection, setActiveSelection] = useState<SelectionType>(null);

  const icons = {
    başlangıç: L.icon({
      iconUrl: "/icons/start-icon.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    }),
    döküm_noktası: L.icon({
      iconUrl: "/icons/drop-icon.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    }),
    çöp_noktası: L.icon({
      iconUrl: "/icons/red-marker.png",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    }),
  };

  // Harita başlatma
  useEffect(() => {
    if (typeof window !== "undefined" && !mapRef.current) {
      mapRef.current = L.map("map").setView([41.0082, 28.9784], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapRef.current);
    }

    return () => {
      routeLinesRef.current.forEach(line => line.remove());
      markersRef.current.forEach(marker => marker.remove());
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const mapRefs = { mapRef, routeLinesRef, markersRef };
  
  useMapEvents(mapRefs, activeSelection, icons);
  useOptimizationEffect(optimizationResult, mapRefs);
  useInitialPoints(mapRefs, icons);

  return (
    <div className="relative w-full h-[calc(100vh-80px)]">
      <div id="map" className="w-full h-full" />
      <div className="absolute top-4 right-4 z-[1000]">
        <MapControls
          mapRef={mapRef}
          activeSelection={activeSelection}
          setActiveSelection={setActiveSelection}
        />
      </div>
    </div>
  );
} 