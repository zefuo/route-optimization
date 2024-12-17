"use client";

import { useEffect, useState } from "react";

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
  id: string;
};

export default function Accordion({
  title,
  children,
  defaultOpen = false,
  count,
  id,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [currentCount, setCurrentCount] = useState(count);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-count"
        ) {
          const target = mutation.target as HTMLElement;
          const newCount = Number(target.getAttribute("data-count"));
          setCurrentCount(newCount);
        }
      });
    });

    const element = document.querySelector(`[data-accordion="${id}"]`);
    if (element) {
      observer.observe(element, { attributes: true });
    }

    return () => observer.disconnect();
  }, [id]);

  return (
    <div className="bg-white rounded-lg shadow mb-4" data-accordion={id}>
      <button
        className="w-full p-4 text-left font-semibold flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span>{title}</span>
          {count !== undefined && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
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
