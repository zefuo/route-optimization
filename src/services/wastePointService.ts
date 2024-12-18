type WastePoint = {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
};

type NewWastePoint = Omit<WastePoint, "id">;

class WastePointService {
  private baseUrl = "http://127.0.0.1:5000/waste-points";

  // Tüm çöp noktalarını getir
  async getAllWastePoints(): Promise<WastePoint[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error("Çöp noktaları getirilemedi");
      }
      return await response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Yeni çöp noktası ekle
  async addWastePoint(wastePoint: NewWastePoint): Promise<WastePoint> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wastePoint),
      });

      if (!response.ok) {
        throw new Error("Çöp noktası eklenemedi");
      }

      return await response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Çöp noktası sil
  async deleteWastePoint(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Çöp noktası silinemedi");
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Çöp noktası güncelle
  async updateWastePoint(id: number, wastePoint: NewWastePoint): Promise<WastePoint> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wastePoint),
      });

      if (!response.ok) {
        throw new Error("Çöp noktası güncellenemedi");
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

export const wastePointService = new WastePointService(); 