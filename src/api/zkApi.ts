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
    const res = await axiosInstance.post("/room/join", payload);
    console.log(JSON.stringify(res));
    return res;
  },

  async importWhiteList(payload: {
    contents: Array<{ user: string; code: string }>;
    name: string;
    room: number;
  }): Promise<any> {
    const res = await axiosInstance.post("/room/merkle", payload);
    return res;
  },

  async joinBidding(payload: {
    email: string;
    private_code: string;
    room_id: number;
  }): Promise<any> {
    const res = await axiosInstance.post("/bidding/join", payload);
    return res;
  },
  async bidding(payload: {
    room_id: number;
    proof_id: any;
    bid_data: any;
  }): Promise<any> {
    const res = await axiosInstance.post("/bidding", payload);
    return res;
  },
};
