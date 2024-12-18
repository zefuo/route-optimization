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

type OptimizationResult = {
  routes: Array<{
    vehicleId: number;
    duration: number;
    distance: number;
    steps: Array<{
      location: [number, number];
      type: string;
      arrival: number;
      duration: number;
    }>;
  }>;
};

export class RouteOptimizationService {
  private vroomUrl = 'http://18.195.26.79:3000';

  async optimizeRoutes(
    vehicles: Vehicle[],
    wastePoints: WastePoint[],
    startPoint: Point,
    dumpPoint: Point
  ): Promise<OptimizationResult> {
    try {
      // Her iş için varsayılan kapasite kullanımı (örneğin her çöp noktası 1 birim)
      const jobs = wastePoints.map((point, index) => ({
        id: index + 1,
        location: [parseFloat(point.longitude), parseFloat(point.latitude)],
        name: point.name,
        amount: [1] // Her çöp noktası 1 birimlik kapasite kullanıyor
      }));
      const jobsPerVehicle = Math.ceil(wastePoints.length / vehicles.length);
      const vroomVehicles = vehicles.map(vehicle => ({
        id: vehicle.id,
        start: [parseFloat(startPoint.longitude), parseFloat(startPoint.latitude)],
        end: [parseFloat(dumpPoint.longitude), parseFloat(dumpPoint.latitude)],
        capacity: [jobsPerVehicle], // Araç kapasitesi, tanımlanmamışsa varsayılan 10
        skills: [1], // Tüm araçlar aynı yeteneklere sahip
        profile: "car" // Araç profili
      }));

      const requestBody = {
        jobs,
        vehicles: vroomVehicles,
        options: {
          g: true, // Mesafe matrisini otomatik hesapla
          minimize_vehicles: true // Minimum araç kullanımını optimize et
        }
      };

      console.log("VROOM isteği:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${this.vroomUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("VROOM yanıt hatası:", errorData);
        throw new Error('Rota optimizasyonu başarısız oldu');
      }

      const result = await response.json();
      console.log("VROOM yanıtı:", JSON.stringify(result, null, 2));

      return {
        routes: result.routes.map(route => ({
          vehicleId: route.vehicle,
          duration: route.duration,
          distance: route.distance,
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