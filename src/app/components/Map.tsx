"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

type SelectionType = "başlangıç" | "döküm_noktası" | "çöp_noktası" | null;

export default function Map() {
  const mapRef = useRef<L.Map | null>(null);
  const controlRef = useRef<L.Control | null>(null);
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
      iconSize: [17, 20],
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
      return () => {
        markers.forEach((marker) => marker.remove());
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

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (activeSelection) {
        const { lat, lng } = e.latlng;

        // Yeni marker oluştur
        const marker = L.marker([lat, lng], {
          icon: icons[activeSelection],
        }).addTo(mapRef.current!);

        // Popup içeriği oluştur
        const popupContent = document.createElement("div");
        const baseContent = `
          <div class="flex flex-col gap-2">
            <div>${
              activeSelection.charAt(0).toUpperCase() + activeSelection.slice(1)
            } Noktası</div>
            <div class="text-sm text-gray-600">Koordinatlar: ${lat.toFixed(
              6
            )}, ${lng.toFixed(6)}</div>
            ${
              activeSelection === "çöp_noktası"
                ? `
              <button class="delete-marker bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm transition-colors duration-200 flex items-center justify-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Noktayı Kaldır
              </button>
            `
                : ""
            }
          </div>
        `;

        popupContent.innerHTML = baseContent;

        // Sadece çöp noktası ise silme butonu olayını ekle
        if (activeSelection === "çöp_noktası") {
          const deleteButton = popupContent.querySelector(".delete-marker");
          if (deleteButton) {
            deleteButton.addEventListener("click", () => {
              marker.remove();
              setMarkers((prev) => prev.filter((m) => m !== marker));
            });
          }
        }

        marker.bindPopup(popupContent);

        // Markers state'ini güncelle
        setMarkers((prev) => [...prev, marker]);

        // Seçimi sıfırla
        if (activeSelection !== "çöp_noktası") {
          setActiveSelection(null);
        }
      }
    };

    mapRef.current.on("click", handleMapClick);

    return () => {
      mapRef.current?.off("click", handleMapClick);
    };
  }, [activeSelection]);

  return <div id="map" className="w-full h-[calc(100vh-80px)]"></div>;
}
