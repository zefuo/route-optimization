import { startEndPointService } from "@/services/startEndPointService";
import { wastePointService } from "@/services/wastePointService";
import L from "leaflet";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { MapRefs, SelectionType } from "../types";

export function useMapEvents(
  mapRefs: MapRefs,
  activeSelection: SelectionType,
  icons: Record<string, L.Icon>
) {
  useEffect(() => {
    if (!mapRefs.mapRef.current) return;

    const handleMapClick = async (e: L.LeafletMouseEvent) => {
      if (activeSelection) {
        const { lat, lng } = e.latlng;
        const point = { latitude: lat.toString(), longitude: lng.toString() };

        try {
          switch (activeSelection) {
            case "başlangıç":
              await startEndPointService.saveStartPoint(point);
              const startMarker = L.marker([lat, lng], {
                icon: icons[activeSelection],
              }).addTo(mapRefs.mapRef.current!);
              startMarker.bindPopup("Başlangıç Noktası");
              mapRefs.markersRef.current.push(startMarker);
              break;

            case "döküm_noktası":
              await startEndPointService.saveDumpPoint(point);
              const dumpMarker = L.marker([lat, lng], {
                icon: icons[activeSelection],
              }).addTo(mapRefs.mapRef.current!);
              dumpMarker.bindPopup("Boşaltım Noktası");
              mapRefs.markersRef.current.push(dumpMarker);
              break;

            case "çöp_noktası":
              const wastePoint = { ...point, name: `Çöp Noktası` };
              await wastePointService.addWastePoint(wastePoint);
              const wasteMarker = L.marker([lat, lng], {
                icon: icons[activeSelection],
              }).addTo(mapRefs.mapRef.current!);
              wasteMarker.bindPopup(`${wastePoint.name}<br>Koordinatlar: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
              mapRefs.markersRef.current.push(wasteMarker);
              break;
          }
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
        }
      }
    };

    mapRefs.mapRef.current.on("click", handleMapClick);
    return () => {
      mapRefs.mapRef.current?.off("click", handleMapClick);
    };
  }, [activeSelection, mapRefs, icons]);
} 