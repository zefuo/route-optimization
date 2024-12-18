"use client";

import { startEndPointService } from "@/services/startEndPointService";
import { wastePointService } from "@/services/wastePointService";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type SelectionType = "başlangıç" | "döküm_noktası" | "çöp_noktası" | null;

type MapProps = {
  optimizationResult: {
    routes: Array<{
      vehicleId: number;
      duration: number;
      steps: Array<{
        location: [number, number]; // [lat, lng]
        type: string;
        arrival: number;
        duration: number;
      }>;
    }>;
  } | null;
};

// Polyline decoder fonksiyonunu ekleyelim
function decodePolyline(str: string, precision = 5) {
  let index = 0,
      lat = 0,
      lng = 0,
      coordinates = [],
      shift = 0,
      result = 0,
      byte = null,
      latitude_change,
      longitude_change,
      factor = Math.pow(10, precision);

  while (index < str.length) {
    byte = null;
    shift = 0;
    result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
    shift = result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

    lat += latitude_change;
    lng += longitude_change;

    coordinates.push([lat / factor, lng / factor]);
  }

  return coordinates;
}

// OSRM ile rota oluşturma fonksiyonu
async function createRoute(waypoints: [number, number][], color: string): Promise<L.LayerGroup> {
  try {
    // Tüm noktaları OSRM formatına çevir (lng,lat)
    const points = waypoints.map(coord => {
      return `${coord[1]},${coord[0]}`; // OSRM formatı: lng,lat
    }).join(';');

    const url = `http://localhost:5000/route/v1/driving/${points}?overview=full&geometries=geojson`;
    console.log('OSRM Request URL:', url); // URL'i kontrol etmek için

    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || !data.routes[0]) {
      throw new Error('Rota bulunamadı');
    }

    // GeoJSON koordinatlarını Leaflet formatına çevir ([lat, lng])
    const routeCoordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
    
    // Rota çizgisini oluştur
    const routeLine = L.polyline(routeCoordinates, {
      color,
      weight: 3,
      opacity: 0.8
    });

    // Rota grubu oluştur
    const group = L.layerGroup([routeLine]);
    
    // Popup bilgisi ekle
    group.bindPopup(`
      Mesafe: ${(data.routes[0].distance/1000).toFixed(1)} km<br>
      Süre: ${Math.round(data.routes[0].duration/60)} dakika
    `);

    return group;

  } catch (error) {
    console.error('OSRM hatası:', error);
    console.log('Hatalı koordinatlar:', waypoints);
    
    // Hata durumunda düz çizgi çiz
    const routeLine = L.polyline(waypoints, {
      color,
      weight: 3,
      opacity: 0.8,
      dashArray: '5, 10' // Kesikli çizgi
    });
    return L.layerGroup([routeLine]);
  }
}

export default function Map({ optimizationResult }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const controlRef = useRef<L.Control | null>(null);
  const routeLinesRef = useRef<L.LayerGroup[]>([]);
  const [activeSelection, setActiveSelection] = useState<SelectionType>(null);

  // İkon tanımlamalarını useEffect dışında, en üstte yapalım
  const icons = {
    başlangıç: L.icon({
      iconUrl: "/icons/start-icon.png", // Bu ikonu eklemelisiniz
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    }),
    döküm_noktası: L.icon({
      iconUrl: "/icons/drop-icon.png", // Bu ikonu eklemelisiniz
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    }),
    çöp_noktası: L.icon({
      iconUrl: "/icons/red-marker.png", // Bu ikonu eklemelisiniz
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    }),
  };

  // Marker referansını tutmak için yeni bir state ekleyelim
  const [markers, setMarkers] = useState<L.Marker[]>([]);

  // Harita başlatma - sadece bir kez çalışır
  useEffect(() => {
    if (typeof window !== "undefined" && !mapRef.current) {
      mapRef.current = L.map("map").setView([41.0082, 28.9784], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);

      // Temizlik fonksiyonu
       // Temizlik fonksiyonu
    return () => {
      // Rota çizgilerini temizle
      routeLinesRef.current.forEach(line => line.remove());
      routeLinesRef.current = [];

      // Haritayı temizle
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    }
  }, []); // Boş bağımlılık dizisi

  // Kontrol oluşturma ve güncelleme
  useEffect(() => {
    if (!mapRef.current) return;

    // Önceki kontrolü kaldır
    if (controlRef.current) {
      controlRef.current.remove();
    }

    // Özel kontrol oluştur
    const SelectionControl = L.Control.extend({
      onAdd: function () {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control"
        );
        container.style.backgroundColor = "white";
        container.style.padding = "6px";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "4px";

        const buttons = [
          {
            type: "başlangıç",
            title: "Başlangıç Noktası",
            icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
          },
          {
            type: "döküm_noktası",
            title: "Döküm Noktası",
            icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
          },
          {
            type: "çöp_noktası",
            title: "Çöp Noktası",
            icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
          },
        ];

        buttons.forEach(({ type, title, icon }) => {
          const button = L.DomUtil.create("button", "", container);
          button.style.display = "flex";
          button.style.alignItems = "center";
          button.style.gap = "8px";
          button.style.padding = "8px 16px";
          button.style.borderRadius = "8px";
          button.style.border = "none";
          button.style.cursor = "pointer";
          button.style.transition = "all 0.2s";
          button.style.width = "100%";
          button.title = title;

          button.innerHTML = `
            <svg class="w-5 h-5" style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icon}"></path>
            </svg>
            <span>${title}</span>
          `;

          const updateStyle = () => {
            if (activeSelection === type) {
              button.style.backgroundColor = "#2563eb";
              button.style.color = "white";
            } else {
              button.style.backgroundColor = "white";
              button.style.color = "#1e40af";
            }
          };
          updateStyle();

          L.DomEvent.on(button, "click", (e) => {
            L.DomEvent.stopPropagation(e);
            if (activeSelection === (type as SelectionType))
              setActiveSelection(null);
            else setActiveSelection(type as SelectionType);
          });

          L.DomEvent.on(button, "mouseover", () => {
            if (activeSelection !== type) {
              button.style.backgroundColor = "#eff6ff";
            }
          });

          L.DomEvent.on(button, "mouseout", () => {
            updateStyle();
          });
        });

        return container;
      },
    });

    controlRef.current = new SelectionControl({ position: "topright" }).addTo(
      mapRef.current
    );
  }, [activeSelection]); // Sadece gerekli bağımlılıklar

  // Tıklama olayı dinleyicisi
  useEffect(() => {
    if (!mapRef.current) return;

    const handleMapClick = async (e: L.LeafletMouseEvent) => {
      if (activeSelection) {
        const { lat, lng } = e.latlng;
        const point = {
          latitude: lat.toString(),
          longitude: lng.toString(),
        };

        try {
          switch (activeSelection) {
            case "başlangıç":
              await startEndPointService.saveStartPoint(point);
              // Marker oluştur
              const startMarker = L.marker([lat, lng], {
                icon: icons[activeSelection],
              }).addTo(mapRef.current!);

              startMarker.bindPopup("Başlangıç Noktası");
              setMarkers((prev) => [...prev, startMarker]);
              setActiveSelection(null);

              break;

            case "döküm_noktası":
              await startEndPointService.saveDumpPoint(point);
              // Marker oluştur
              const dumpMarker = L.marker([lat, lng], {
                icon: icons[activeSelection],
              }).addTo(mapRef.current!);

              dumpMarker.bindPopup("Döküm Noktası");
              setMarkers((prev) => [...prev, dumpMarker]);
              setActiveSelection(null);

              break;

            case "çöp_noktası":
              const wastePoint = {
                ...point,
                name: `Çöp Noktası`,
              };

              await wastePointService.addWastePoint(wastePoint);
              // Marker oluştur
              const wasteMarker = L.marker([lat, lng], {
                icon: icons[activeSelection],
              }).addTo(mapRef.current!);

              // Popup içeriği oluştur
              const popupContent = document.createElement("div");
              popupContent.innerHTML = `
                <div class="flex flex-col gap-2">
                  <div>${wastePoint.name}</div>
                  <div class="text-sm text-gray-600">Koordinatlar: ${lat.toFixed(
                    6
                  )}, ${lng.toFixed(6)}</div>
                </div>
              `;
              wasteMarker.bindPopup(popupContent);
              setMarkers((prev) => [...prev, wasteMarker]);
              break;
          }

          // Seçimi sıfırla
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
        }
      }
    };

    mapRef.current.on("click", handleMapClick);

    return () => {
      mapRef.current?.off("click", handleMapClick);
    };
  }, [activeSelection]);

  // Optimizasyon sonucu değiştiğinde rotaları güncelle
  useEffect(() => {
    if (optimizationResult && mapRef.current) {
      // Mevcut rotaları temizle
      routeLinesRef.current.forEach(line => line.remove());
      routeLinesRef.current = [];

      // Her araç için farklı renkler
      const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFA500', '#800080', '#008080'];

      // Tüm rotaları içerecek bir FeatureGroup oluştur
      const allRoutes = L.featureGroup();

      optimizationResult.routes.forEach(async (route, index) => {
        if (!route.steps || route.steps.length < 2) return;

        try {
          // Rota noktalarını hazırla
          const coordinates = route.steps.map(step => step.location);
          const color = colors[index % colors.length];

          // OSRM ile rota oluştur
          const routeGroup = await createRoute(coordinates, color);
          
          // Rotayı haritaya ekle
          routeGroup.addTo(mapRef.current!);
          
          // Popup bilgisi ekle
          routeGroup.bindPopup(`Araç ${route.vehicleId} Rotası`);
          
          // Referansa ekle
          routeLinesRef.current.push(routeGroup);
          allRoutes.addLayer(routeGroup);

          // Her rota eklendiğinde harita görünümünü güncelle
          if (allRoutes.getLayers().length > 0) {
            mapRef.current.fitBounds(allRoutes.getBounds(), { padding: [50, 50] });
          }

        } catch (error) {
          console.error(`Araç ${route.vehicleId} rotası çizilirken hata:`, error);
          console.log('Hatalı koordinatlar:', coordinates);
        }
      });
    }
  }, [optimizationResult]);

  return <div id="map" className="w-full h-[calc(100vh-80px)]"></div>;
}
