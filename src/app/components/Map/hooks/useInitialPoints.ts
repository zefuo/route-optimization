import { startEndPointService } from "@/services/startEndPointService";
import { wastePointService } from "@/services/wastePointService";
import L from "leaflet";
import { useEffect } from "react";
import { MapRefs } from "../types";

export function useInitialPoints(mapRefs: MapRefs, icons: Record<string, L.Icon>) {
  useEffect(() => {
    if (!mapRefs.mapRef.current) return;

    const fetchAndDisplayPoints = async () => {
      try {
        // Tüm noktaları paralel olarak getir
        const [startPoint, dumpPoint, wastePoints] = await Promise.all([
          startEndPointService.getStartPoint(),
          startEndPointService.getDumpPoint(),
          wastePointService.getAllWastePoints(),
        ]);

        // Başlangıç noktası
        if (startPoint) {
          const marker = L.marker(
            [parseFloat(startPoint.latitude), parseFloat(startPoint.longitude)],
            { icon: icons["başlangıç"] }
          ).addTo(mapRefs.mapRef.current!);
          marker.bindPopup("Başlangıç Noktası");
          mapRefs.markersRef.current.push(marker);
        }

        // Döküm noktası
        if (dumpPoint) {
          const marker = L.marker(
            [parseFloat(dumpPoint.latitude), parseFloat(dumpPoint.longitude)],
            { icon: icons["döküm_noktası"] }
          ).addTo(mapRefs.mapRef.current!);
          marker.bindPopup("Boşaltım Noktası");
          mapRefs.markersRef.current.push(marker);
        }

        // Çöp noktaları
        wastePoints.forEach((point) => {
          const marker = L.marker(
            [parseFloat(point.latitude), parseFloat(point.longitude)],
            { icon: icons["çöp_noktası"] }
          ).addTo(mapRefs.mapRef.current!);
          marker.bindPopup(`${point.name}<br>Koordinatlar: ${point.latitude}, ${point.longitude}`);
          mapRefs.markersRef.current.push(marker);
        });

        // Tüm noktaları içeren bir sınır kutusu oluştur
        const allPoints = [
          ...(startPoint ? [[parseFloat(startPoint.latitude), parseFloat(startPoint.longitude)]] : []),
          ...(dumpPoint ? [[parseFloat(dumpPoint.latitude), parseFloat(dumpPoint.longitude)]] : []),
          ...wastePoints.map(p => [parseFloat(p.latitude), parseFloat(p.longitude)]),
        ] as [number, number][];

        if (allPoints.length > 0) {
          const bounds = L.latLngBounds(allPoints);
          mapRefs.mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (error) {
        console.error("Noktalar yüklenirken hata:", error);
      }
    };

    fetchAndDisplayPoints();
  }, [mapRefs, icons]);
} 