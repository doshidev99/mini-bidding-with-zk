import create from "zustand";

export interface IStorageData {
  isLoadingDetailInRoom: boolean;
  detailInRoom: any;
  updateIsLoadingInRoom: (isLoadingDetailInRoom: boolean) => void;
  updateDetailInRoom: (newDetailRoom: any) => void;

  proof_id: any;
  updateProofId: (proofId: any) => void;
  bid_data: any;
  updateBidData: (bidData: any) => void;
  currentRoom: any;
  updateDetailRoom: (currentRoom: {
    id: number;
    name: string;
    status: string;
    visibility: string;
    duration_time: number;
    start_time: number;
    tree_id: number;
    result: any[];
    tree_name: string;
    whitelist: any[];
  }) => void;

  roomList: any[];
  updateRoomList: (roomList: any[]) => void;
  myRoom: any[];
  updateMyRoom: (roomList: any[]) => void;
}

const initialValues = {
  isLoadingDetailInRoom: false,
  detailInRoom: null,
  proof_id: "",
  bid_data: "",
  currentRoom: null,
  roomList: [],
  myRoom: [],
};

export const useStoreDataRoom = create<IStorageData & {}>()((set) => ({
  ...initialValues,
  updateIsLoadingInRoom: (isLoadingDetailInRoom: boolean) =>
    set({ isLoadingDetailInRoom }),
  updateDetailInRoom: (detailInRoom: any) => set({ detailInRoom }),
  updateProofId: (proofId: any) => set({ proof_id: proofId }),
  updateBidData: (bid_data: any) => set({ bid_data: bid_data }),
  updateDetailRoom: (currentRoom: any) =>
    set({
      currentRoom,
    }),

  updateRoomList: (roomList: any[]) =>
    set({
      roomList,
    }),

  updateMyRoom: (myRoom: any[]) =>
    set({
      myRoom,
    }),
}));
