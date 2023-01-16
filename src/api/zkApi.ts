import axiosInstance from "./axiosClient";

export const zkApi = {
  async getRoom(): Promise<any> {
    const res = await axiosInstance.get("/rooms");
    return res;
  },
  async createRoom(payload): Promise<any> {
    const res = await axiosInstance.post("/room", payload);
    return res;
  },

  async joinRoom(payload: {
    room_id: string;
    email: string;
    private_code: string;
  }): Promise<any> {
    const res = await axiosInstance.post("/join-room", payload);
    return res;
  },
};
