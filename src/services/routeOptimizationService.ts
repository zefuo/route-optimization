type Location = {
  id: number;
  name?: string;
  latitude: string;
  longitude: string;
};

type Vehicle = {
  id: number;
  plate: string;
  brand: string | null;
  model: string | null;
};

type VroomJob = {
  id: number;
  location: [number, number]; // [lng, lat]
};

type VroomVehicle = {
  id: number;
  start: [number, number]; // [lng, lat]
  end: [number, number]; // [lng, lat]
};

type VroomRequest = {
  jobs: VroomJob[];
  vehicles: VroomVehicle[];
};

class RouteOptimizationService {
  private vroomUrl = 'http://localhost:3000';

  async optimizeRoutes(
    vehicles: Vehicle[], 
    wastePoints: Location[], 
    startPoint: Location, 
    dumpPoint: Location
  ) {
    try {
      // VROOM API'si için veriyi hazırla
      const jobs: VroomJob[] = wastePoints.map(point => ({
        id: point.id,
        location: [parseFloat(point.longitude), parseFloat(point.latitude)]
      }));

      const vroomVehicles: VroomVehicle[] = vehicles.map(vehicle => ({
        id: vehicle.id,
        start: [parseFloat(startPoint.longitude), parseFloat(startPoint.latitude)],
        end: [parseFloat(dumpPoint.longitude), parseFloat(dumpPoint.latitude)]
      }));

      const requestData: VroomRequest = {
        jobs,
        vehicles: vroomVehicles
      };

      // VROOM API'sine istek at
      const response = await fetch(`${this.vroomUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Rota optimizasyonu başarısız oldu');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Rota optimizasyonu sırasında bir hata oluştu');
    }
  }
}

export const routeOptimizationService = new RouteOptimizationService(); 