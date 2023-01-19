import create from "zustand";

export interface IStorageData {
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
}

const initialValues = {
  proof_id: "",
  bid_data: "",
  currentRoom: null,
};

export const useStoreDataRoom = create<IStorageData & {}>()((set) => ({
  ...initialValues,
  updateProofId: (proofId: any) => set({ proof_id: proofId }),
  updateBidData: (bid_data: any) => set({ bid_data: bid_data }),
  updateDetailRoom: (currentRoom: any) =>
    set({
      currentRoom,
    }),
}));
