type Point = {
  latitude: string;
  longitude: string;
};

type WastePoint = Point & {
  id: number;
  name: string;
};

type Vehicle = {
  id: number;
  plate: string;
  brand: string | null;
  model: string | null;
};

type VroomStep = {
  type: string;
  location: [number, number]; // [lng, lat]
  setup: number;
  service: number;
  waiting_time: number;
  arrival: number;
  duration: number;
  violations: any[];
};

type VroomRoute = {
  vehicle: number;
  cost: number;
  setup: number;
  service: number;
  duration: number;
  waiting_time: number;
  priority: number;
  steps: VroomStep[];
  violations: any[];
};

type VroomResponse = {
  routes: VroomRoute[];
};

export class RouteOptimizationService {
  private vroomUrl = 'http://localhost:3000';

  async optimizeRoutes(
    vehicles: Vehicle[],
    wastePoints: WastePoint[],
    startPoint: Point,
    dumpPoint: Point
  ) {
    try {
      // VROOM için veriyi hazırla
      const jobs = wastePoints.map((point, index) => ({
        id: index + 1,
        location: [parseFloat(point.longitude), parseFloat(point.latitude)],
        name: point.name
      }));

      const vroomVehicles = vehicles.map(vehicle => ({
        id: vehicle.id,
        start: [parseFloat(startPoint.longitude), parseFloat(startPoint.latitude)],
        end: [parseFloat(dumpPoint.longitude), parseFloat(dumpPoint.latitude)]
      }));

      const response = await fetch(`${this.vroomUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobs, vehicles: vroomVehicles })
      });

      if (!response.ok) {
        throw new Error('Rota optimizasyonu başarısız oldu');
      }

      const result: VroomResponse = await response.json();

      // VROOM yanıtını işle ve formatlı rotaları döndür
      return {
        routes: result.routes.map(route => ({
          vehicleId: route.vehicle,
          duration: route.duration,
          steps: route.steps.map(step => ({
            location: [step.location[1], step.location[0]], // [lat, lng] formatına çevir
            type: step.type,
            arrival: step.arrival,
            duration: step.duration
          }))
        }))
      };

    } catch (error) {
      console.error('Rota optimizasyonu hatası:', error);
      throw new Error('Rota optimizasyonu sırasında bir hata oluştu');
    }
  }
}

export const routeOptimizationService = new RouteOptimizationService(); 