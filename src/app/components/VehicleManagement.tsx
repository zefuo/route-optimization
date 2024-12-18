"use client";

import { vehicleService } from "@/services/vehicleService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Vehicle = {
  id: number;
  plate: string;
  brand: string | null;
  model: string | null;
};

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, "id">>({
    plate: "",
    brand: null,
    model: null,
  });

  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.getAllVehicles();
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async () => {
    if (!newVehicle.plate.trim()) {
      toast.error("Lütfen plaka giriniz");
      return;
    }

    try {
      const addedVehicle = await vehicleService.addVehicle(newVehicle);
      setVehicles([...vehicles, addedVehicle]);
      setNewVehicle({ plate: "", brand: null, model: null });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Araç eklenirken bir hata oluştu"
      );
    }
  };

  const deleteVehicle = async (id: number) => {
    try {
      await vehicleService.deleteVehicle(id);
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Araç silinirken bir hata oluştu"
      );
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        <p>{error}</p>
        <button
          onClick={fetchVehicles}
          className="mt-2 text-blue-500 hover:text-blue-600"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-2 mb-3">
        <div className="grid grid-cols-1 gap-2">
          <input
            type="text"
            placeholder="* Plaka"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={newVehicle.plate}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, plate: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Marka"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={newVehicle.brand || ""}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, brand: e.target.value || null })
            }
          />
          <input
            type="text"
            placeholder="Model"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={newVehicle.model || ""}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, model: e.target.value || null })
            }
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
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

      <div>
        {vehicles.length > 0 ? (
          <div className="grid gap-2">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center gap-2">
                <div className="flex-1 bg-white border rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{vehicle.plate}</span>
                        {(vehicle.brand || vehicle.model) && (
                          <span className="text-sm text-gray-500">
                            {[vehicle.brand, vehicle.model]
                              .filter(Boolean)
                              .join(" ")}
                          </span>
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
          <div className="text-center py-4 text-gray-500">
            <svg
              className="w-10 h-10 mx-auto text-gray-400 mb-2"
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
