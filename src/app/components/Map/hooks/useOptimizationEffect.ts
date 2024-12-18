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
    mapRefs.routeLinesRef.current.forEach(line => line.remove());
    mapRefs.routeLinesRef.current = [];
    mapRefs.markersRef.current.forEach(marker => marker.remove());
    mapRefs.markersRef.current = [];

    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFA500', '#800080', '#008080'];
    const allRoutes = L.featureGroup();

    optimizationResult.routes.forEach(async (route: any, index: number) => {
      if (!route.steps || route.steps.length < 2) return;

      try {
        const coordinates = route.steps.map((step: any) => step.location);
        const color = colors[index % colors.length];

        // Sıra numaralarını ekle
        route.steps.forEach((step: any, stepIndex: number) => {
          if (step.type === 'waste_point') {
            const numberIcon = L.divIcon({
              className: 'custom-number-icon',
              html: `<div style="
                background-color: ${color};
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                border: 2px solid white;
                box-shadow: 0 0 4px rgba(0,0,0,0.4);
              ">${stepIndex}</div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });

            const marker = L.marker([step.location[0], step.location[1]], {
              icon: numberIcon
            }).addTo(mapRefs.mapRef.current!);

            mapRefs.markersRef.current.push(marker);
          }
        });

        const routeGroup = await createRoute(coordinates, color);
        routeGroup.addTo(mapRefs.mapRef.current!);
        routeGroup.bindPopup(`Araç ${route.vehicleId} Rotası`);
        mapRefs.routeLinesRef.current.push(routeGroup);
        allRoutes.addLayer(routeGroup);

        if (allRoutes.getLayers().length > 0) {
          mapRefs.mapRef.current.fitBounds(allRoutes.getBounds(), { padding: [50, 50] });
        }
      } catch (error) {
        console.error(`Araç ${route.vehicleId} rotası çizilirken hata:`, error);
      }
    });
  }, [optimizationResult, mapRefs]);
}