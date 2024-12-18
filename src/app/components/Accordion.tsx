"use client";

import { countService } from "@/services/countService";
import { useEffect, useState } from "react";

type AccordionProps = {
  id: string;
  title: string;
  children: React.ReactNode;
};

export default function Accordion({ id, title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCount, setCurrentCount] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const counts = await countService.getCounts();
        switch (id) {
          case "vehicles":
            setCurrentCount(counts.vehicles);
            break;
          case "wastepoints":
            setCurrentCount(counts.wastePoints);
            break;
          case "routes":
            setCurrentCount(counts.routes);
            break;
          default:
            setCurrentCount(0);
        }
      } catch (error) {
        console.error("Count bilgisi alınamadı:", error);
        setCurrentCount(0);
      }
    };

    fetchCount();

    // Periyodik güncelleme için interval
    const interval = setInterval(fetchCount, 30000); // Her 30 saniyede bir güncelle

    return () => clearInterval(interval);
  }, [id]);

  return (
    <div className="bg-white rounded-lg shadow mb-4" data-accordion={id}>
      <button
        className="w-full p-4 text-left font-semibold flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span>{title}</span>
          {currentCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {currentCount}
            </span>
          )}
        </div>
        <span className="transform transition-transform duration-200">
          {isOpen ? "▼" : "▶"}
        </span>
      </button>
      {isOpen && <div className="p-4 border-t">{children}</div>}
    </div>
  );
}
