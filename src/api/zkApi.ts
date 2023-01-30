import axiosInstance from "./axiosClient";

export const zkApi = {
  async getBiddingUserInRoom(room_id): Promise<any> {
    const res = await axiosInstance.get("/bidding/user-in-room", {
      params: {
        room_id,
      },
    });
    return res;
  },

  async getRoom(): Promise<any> {
    const res = await axiosInstance.get("/rooms", {
      params: {
        limit: 100,
      },
    });
    return res;
  },

  async getRoomById(id): Promise<any> {
    console.log("id", id);

    const res = await axiosInstance.get(`/room`, {
      params: {
        id,
      },
    });
    return res;
  },

  async createRoom(payload): Promise<any> {
    const res = await axiosInstance.post("/room", payload);
    return res;
  },
  async getResultByRoom(payload: { room_id: number }): Promise<any> {
    const res = await axiosInstance.post("/room/result", payload);
    return res;
  },

  async openRoom(payload: {
    start_after: number;
    room_id: number;
  }): Promise<any> {
    const res = await axiosInstance.post("/room/open", payload);
    return res;
  },

  async closeRoom(payload: { room_id: number }): Promise<any> {
    const res = await axiosInstance.post("/room/close", payload);
    return res;
  },
  async updateDuration(payload: {
    room_id: number;
    duration_time: number;
  }): Promise<any> {
    const res = await axiosInstance.post("/room/duration", payload);
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
    bid_value: number;
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
