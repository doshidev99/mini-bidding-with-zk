import create from "zustand";

export interface IStorageData {
  proof_id: any;
  updateProofId: (proofId: any) => void;
  bid_data: any;
  updateBidData: (bidData: any) => void;
}

const initialValues = {
  proof_id: "",
  bid_data: "",
};

export const useStoreDataRoom = create<IStorageData & {}>()((set) => ({
  ...initialValues,
  updateProofId: (proofId: any) => set({ proof_id: proofId }),
  updateBidData: (bid_data: any) => set({ bid_data: bid_data }),
}));
