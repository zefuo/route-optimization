/* eslint-disable @typescript-eslint/no-explicit-any */
import L from "leaflet";
import { useEffect } from "react";
import { MapRefs } from "../types";
import { createRoute } from "../utils/osrm";

export function useOptimizationEffect(
  optimizationResult: any,
  mapRefs: MapRefs
) {
  useEffect(() => {
    if (!optimizationResult || !mapRefs.mapRef.current) return;

    // Mevcut rotaları ve markerları temizle
    mapRefs.routeLinesRef.current.forEach((line) => line.remove());
    mapRefs.routeLinesRef.current = [];
    mapRefs.markersRef.current.forEach((marker) => marker.remove());
    mapRefs.markersRef.current = [];

    const colors = [
      "#FF3B30", // Kırmızı
      "#34C759", // Yeşil
      "#007AFF", // Mavi
      "#FF9500", // Turuncu
      "#AF52DE", // Mor
      "#5856D6", // İndigo
      "#FF2D55", // Pembe
      "#5AC8FA", // Açık Mavi
      "#FFCC00", // Sarı
      "#4CD964", // Açık Yeşil
    ];

    let completedRoutes = 0;
    const totalRoutes = optimizationResult.routes.length;
    const allCoordinates: [number, number][] = [];

    // Global sıra numarası için sayaç
    let globalStepCounter = 1;

    optimizationResult.routes.forEach(async (route: any, index: number) => {
      if (!route.steps || route.steps.length < 2) return;

      try {
        const coordinates = route.steps.map((step: any) => step.location);
        const color = colors[index % colors.length];

        coordinates.forEach((coord: [number, number]) => {
          allCoordinates.push(coord);
        });

        // Sadece çöp noktaları için sıra numarası ekle
        route.steps.forEach((step: any) => {
          if (step.type === "waste_point") {
            const numberIcon = L.divIcon({
              className: "custom-number-icon",
              html: `<div style="
                background-color: ${color};
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                border: 2px solid white;
                box-shadow: 0 0 4px rgba(0,0,0,0.4);
              ">${globalStepCounter}</div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            });

            const marker = L.marker([step.location[0], step.location[1]], {
              icon: numberIcon,
            }).addTo(mapRefs.mapRef.current!);

            // Popup içeriğini zenginleştir
            marker.bindPopup(`
              <div style="font-family: Arial, sans-serif;">
                <strong>Durak ${globalStepCounter}</strong><br>
                Araç: ${route.vehicleId}<br>
                Varış: ${new Date(step.arrival * 1000).toLocaleTimeString('tr-TR')}
              </div>
            `);

            mapRefs.markersRef.current.push(marker);
            globalStepCounter++;
          }
        });

        const routeGroup = await createRoute(coordinates, color);
        routeGroup.addTo(mapRefs.mapRef.current!);
        
        // Rota popup içeriğini zenginleştir
        const routeDuration = Math.round(route.duration / 60);
        const wastePointCount = route.steps.filter((step: any) => step.type === "waste_point").length;
        routeGroup.bindPopup(`
          <div style="font-family: Arial, sans-serif;">
            <strong>Araç ${route.vehicleId}</strong><br>
            Süre: ${routeDuration} dakika<br>
            Durak Sayısı: ${wastePointCount}
          </div>
        `);
        
        mapRefs.routeLinesRef.current.push(routeGroup);

        completedRoutes++;

        if (completedRoutes === totalRoutes && allCoordinates.length > 0) {
          const bounds = L.latLngBounds(allCoordinates);
          mapRefs.mapRef.current?.fitBounds(bounds, {
            padding: [50, 50],
          });
        }
      } catch (error) {
        console.error(`Araç ${route.vehicleId} rotası çizilirken hata:`, error);
        completedRoutes++;
      }
    });
  }, [optimizationResult, mapRefs]);
}
