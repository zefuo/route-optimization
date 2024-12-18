import L from "leaflet";

export type SelectionType = "başlangıç" | "döküm_noktası" | "çöp_noktası" | null;

export type MapProps = {
  optimizationResult: {
    routes: Array<{
      vehicleId: number;
      duration: number;
      steps: Array<{
        location: [number, number];
        type: string;
        arrival: number;
        duration: number;
      }>;
    }>;
  } | null;
};

export type RouteGroup = L.LayerGroup;
export type MapRefs = {
  mapRef: React.RefObject<L.Map>;
  routeLinesRef: React.RefObject<L.LayerGroup[]>;
  markersRef: React.RefObject<L.Marker[]>;
}; 