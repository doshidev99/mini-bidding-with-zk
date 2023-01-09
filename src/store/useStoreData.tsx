import create from "zustand";

export interface IStorageData {
  hasBidding: boolean;
  isLoading: boolean;
  sessionList: any;
  updateHasBidding: (hasBidding: boolean) => void;
  updateSessionList: (sessionList: any) => void;
}

const initialValues = {
  hasBidding: false,
  isLoading: false,
  sessionList: [],
};

export const useStoreData = create<IStorageData & {}>()((set) => ({
  ...initialValues,
  updateHasBidding: (hasBidding: boolean) => set({ hasBidding }),
  updateSessionList: (sessionList: any) =>
    set((state) => {
      return {
        ...state,
        sessionList,
      };
    }),
}));
