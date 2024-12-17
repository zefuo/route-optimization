"use client";

import { useEffect, useState } from "react";

type Vehicle = {
  id: number;
  brand?: string;
  model?: string;
  plate: string;
  capacity?: number;
};

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, "id">>({
    brand: "",
    model: "",
    plate: "",
    capacity: undefined,
  });

  useEffect(() => {
    const accordion = document.querySelector('[data-accordion="vehicles"]');
    if (accordion) {
      accordion.setAttribute("data-count", vehicles.length.toString());
    }
  }, [vehicles]);

  const addVehicle = () => {
    if (!newVehicle.plate.trim()) {
      alert("Lütfen plaka giriniz");
      return;
    }
    setVehicles([...vehicles, { ...newVehicle, id: Date.now() }]);
    setNewVehicle({ brand: "", model: "", plate: "", capacity: undefined });
  };

  const deleteVehicle = (id: number) => {
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
  };

  return (
    <div>
      <div className="grid gap-3 mb-4">
        <input
          type="text"
          placeholder="* Plaka (34 ABC 123)"
          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={newVehicle.plate}
          onChange={(e) =>
            setNewVehicle({
              ...newVehicle,
              plate: e.target.value.toUpperCase(),
            })
          }
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Marka"
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={newVehicle.brand}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, brand: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Model"
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={newVehicle.model}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, model: e.target.value })
            }
          />
        </div>

        <input
          type="number"
          placeholder="Kapasite (ton)"
          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={newVehicle.capacity || ""}
          onChange={(e) =>
            setNewVehicle({
              ...newVehicle,
              capacity: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
        <button
          className="w-full bg-blue-500 text-white p-2.5 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
          onClick={addVehicle}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Araç Ekle
        </button>
      </div>

      <div className="mt-4">
        {vehicles.length > 0 ? (
          <div className="grid gap-3">
            {vehicles.map((vehicle, index) => (
              <div key={vehicle.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">
                          {vehicle.plate}
                        </span>
                      </div>
                      <div className="text-gray-500 text-sm mt-1">
                        {vehicle.brand && vehicle.model && (
                          <div>
                            {vehicle.brand} {vehicle.model}
                          </div>
                        )}
                        {vehicle.capacity && (
                          <div>Kapasite: {vehicle.capacity} ton</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteVehicle(vehicle.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 7h18m-3-3v3m-6-3v3m-6-3v3M3 7v13a2 2 0 002 2h14a2 2 0 002-2V7"
              />
            </svg>
            Henüz araç eklenmemiş
          </div>
        )}
      </div>
    </div>
  );
}
