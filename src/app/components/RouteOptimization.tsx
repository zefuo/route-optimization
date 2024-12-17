"use client"

import { useState } from 'react';

type Route = {
  id: number;
  date: string;
  status: 'devam_ediyor' | 'tamamlandı' | 'iptal_edildi';
  vehicleCount: number;
  wastePointCount: number;
};

export default function RouteOptimization() {
  const [routes, setRoutes] = useState<Route[]>([]);

  const startOptimization = async () => {
    try {
      const newRoute: Route = {
        id: Date.now(),
        date: new Date().toLocaleDateString('tr-TR'),
        status: 'devam_ediyor',
        vehicleCount: 3, // Bu değerler API'den gelecek
        wastePointCount: 8, // Bu değerler API'den gelecek
      };

      setRoutes(prev => [newRoute, ...prev]);

      const response = await fetch('http://localhost:5000/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Optimizasyon için gerekli verileri buraya ekleyin
        }),
      });

      if (!response.ok) {
        throw new Error('Rota optimizasyonu başarısız oldu');
      }

      //const result = await response.json();
      //setOptimizationResult(JSON.stringify(result, null, 2));
      
      // Rotayı güncelle
      setRoutes(prev => prev.map(route => 
        route.id === newRoute.id 
          ? { ...route, status: 'tamamlandı' } 
          : route
      ));
    } catch (error) {
      console.error('Rota optimizasyonu hatası:', error);
      //setOptimizationResult('Rota optimizasyonu sırasında bir hata oluştu.');
      
      // Rotayı iptal edildi olarak işaretle
      setRoutes(prev => prev.map(route => 
        route.id === routes[0]?.id 
          ? { ...route, status: 'iptal_edildi' } 
          : route
      ));
    }
  };

  return (
    <div>
      <button
        className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2 mb-4"
        onClick={startOptimization}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Rota Optimizasyonunu Başlat
      </button>

      <div className="grid gap-2">
        {routes.map(route => (
          <div key={route.id} className="bg-white border rounded-lg p-3 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{route.date}</span>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${
                    route.status === 'devam_ediyor' ? 'bg-yellow-100 text-yellow-800' :
                    route.status === 'tamamlandı' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {route.status === 'devam_ediyor' ? 'Devam Ediyor' :
                     route.status === 'tamamlandı' ? 'Tamamlandı' :
                     'İptal Edildi'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="mr-3">{route.vehicleCount} Araç</span>
                  <span>{route.wastePointCount} Çöp Noktası</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {routes.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Henüz rota optimizasyonu yapılmamış
          </div>
        )}
      </div>
    </div>
  );
}

