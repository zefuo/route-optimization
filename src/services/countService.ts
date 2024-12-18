type CountData = {
  vehicles: number;
  wastePoints: number;
  routes: number;
};

class CountService {
  private baseUrl = "http://127.0.0.1:5000/counts";

  async getCounts(): Promise<CountData> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error("Sayılar getirilemedi");
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Beklenmeyen bir hata oluştu");
    }
  }
}

export const countService = new CountService(); 