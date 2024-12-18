import L from "leaflet";

export async function createRoute(waypoints: [number, number][], color: string): Promise<L.LayerGroup> {
  try {
    const points = waypoints.map(coord => `${coord[1]},${coord[0]}`).join(';');
    const url = `http://localhost:5000/route/v1/driving/${points}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || !data.routes[0]) {
      throw new Error('Rota bulunamadı');
    }

    const routeCoordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
    const routeLine = L.polyline(routeCoordinates, {
      color,
      weight: 5,
      opacity: 1
    });

    const group = L.layerGroup([routeLine]);
    group.bindPopup(`
      Mesafe: ${(data.routes[0].distance/1000).toFixed(1)} km<br>
      Süre: ${Math.round(data.routes[0].duration/60)} dakika
    `);

    return group;

  } catch (error) {
    console.error('OSRM hatası:', error);
    return L.layerGroup([L.polyline(waypoints, {
      color,
      weight: 3,
      opacity: 0.8,
      dashArray: '5, 10'
    })]);
  }
} 