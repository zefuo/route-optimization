type Point = {
  latitude: string;
  longitude: string;
};

type StartPoint = Point;
type DumpPoint = Point;

class StartEndPointService {
  private baseUrl = "http://18.195.26.79:5000/start-end-points";

  // Başlangıç noktasını getir
  async getStartPoint(): Promise<StartPoint | null> {
    try {
      const response = await fetch(`${this.baseUrl}/start`);
      if (!response.ok) {
        throw new Error("Başlangıç noktası getirilemedi");
      }
      return await response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Döküm noktasını getir
  async getDumpPoint(): Promise<DumpPoint | null> {
    try {
      const response = await fetch(`${this.baseUrl}/dump`);
      if (!response.ok) {
        throw new Error("Döküm noktası getirilemedi");
      }
      return await response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Başlangıç noktasını kaydet/güncelle
  async saveStartPoint(point: StartPoint): Promise<StartPoint> {
    try {
      const response = await fetch(`${this.baseUrl}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(point),
      });

      if (!response.ok) {
        throw new Error("Başlangıç noktası kaydedilemedi");
      }

      return await response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Döküm noktasını kaydet/güncelle
  async saveDumpPoint(point: DumpPoint): Promise<DumpPoint> {
    try {
      const response = await fetch(`${this.baseUrl}/dump`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(point),
      });

      if (!response.ok) {
        throw new Error("Döküm noktası kaydedilemedi");
      }

      return await response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Hata yönetimi
  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error("Beklenmeyen bir hata oluştu");
  }
}

export const startEndPointService = new StartEndPointService(); 