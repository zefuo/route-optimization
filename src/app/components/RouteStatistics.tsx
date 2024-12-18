import { useMemo } from "react";

type RouteStatisticsProps = {
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
  vehicles: Array<{
    id: number;
    plate: string;
    brand: string | null;
    model: string | null;
  }>;
};

export function RouteStatistics({ routes, vehicles }: RouteStatisticsProps) {
  const statistics = useMemo(() => {
    return routes.map((route) => {
      console.log("f", route);

      const vehicle = vehicles.find((v) => v.id === route.vehicleId);
      const wastePoints = route.steps.filter(
        (step) => step.type === "job"
      ).length;
      const durationInMinutes = Math.round(route.duration / 60);

      return {
        vehicleId: route.vehicleId,
        plate: vehicle?.plate || "Bilinmiyor",
        brand: vehicle?.brand || "Bilinmiyor",
        model: vehicle?.model || "Bilinmiyor",
        wastePoints,
        duration: durationInMinutes,
        distance: (route.distance / 1000).toFixed(1),
      };
    });
  }, [routes, vehicles]);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Rota İstatistikleri</h3>
      <div className="space-y-2">
        {statistics.map((stat) => (
          <div
            key={stat.vehicleId}
            className="border rounded p-3 bg-white shadow-sm"
          >
            <h4 className="font-medium mb-1">Araç: {stat.plate}</h4>
            <div className="text-sm text-gray-600 space-y-0.5">
              <p>Toplam Durak: {stat.wastePoints}</p>
              <p>Toplam Mesafe: {stat.distance} km</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
