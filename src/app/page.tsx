import { Toaster } from "react-hot-toast";
import Accordion from "./components/Accordion";
import Map from "./components/Map";
import Navbar from "./components/Navbar";
import RouteOptimization from "./components/RouteOptimization";
import StartEndPointManagement from "./components/StartEndPointManagement";
import VehicleManagement from "./components/VehicleManagement";
import WastePointManagement from "./components/WastePointManagement";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <div><Toaster/></div>
      <Navbar />
      <div className="flex flex-col md:flex-row flex-1">
        <div
          className="w-full md:w-1/4 p-4 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 64px)" }}
        >
          <Accordion title="Araç Yönetimi" id="vehicles">
            <VehicleManagement />
          </Accordion>
          <Accordion title="Çöp Noktaları" id="wastepoints">
            <WastePointManagement />
          </Accordion>
          <Accordion title="Başlangıç ve Döküm Noktaları" id="startend">
            <StartEndPointManagement />
          </Accordion>
          <Accordion title="Rota Optimizasyonu" id="routes">
            <RouteOptimization />
          </Accordion>
        </div>
        <div className="w-full md:w-3/4 p-4">
          <Map />
        </div>
      </div>
    </main>
  );
}
