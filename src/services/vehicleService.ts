type Vehicle = {
  id: number;
  plate: string;
  brand: string | null;
  model: string | null;
};

type NewVehicle = Omit<Vehicle, "id">;

class VehicleService {
  private baseUrl = "http://18.195.26.79:5001/vehicles";

  async getAllVehicles(): Promise<Vehicle[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error("Araçlar getirilemedi");
      }
      return await response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addVehicle(vehicle: NewVehicle): Promise<Vehicle> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicle),
      });

      if (!response.ok) {
        throw new Error("Araç eklenemedi");
      }

      return await response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteVehicle(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Araç silinemedi");
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error("Beklenmeyen bir hata oluştu");
  }
}

export const vehicleService = new VehicleService(); 