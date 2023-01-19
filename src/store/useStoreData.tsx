import create from "zustand";

export interface IStorageData {
  hasBidding: boolean;
  isLoading: boolean;
  sessionList: any;
  updateHasBidding: (hasBidding: boolean) => void;
  updateSessionList: (sessionList: any) => void;

  detailRoom: any;
  updateDetailRoom: (detailRoom: any) => void;
}

const initialValues = {
  hasBidding: false,
  isLoading: false,
  sessionList: [],
  detailRoom: null,
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

  updateDetailRoom: (detailRoom: any) =>
    set({
      detailRoom,
    }),
}));
