import create from "zustand";
import { keyBy } from "lodash-es";

type TDataList = {
  key: string;
  address: string | unknown;
  bidHash: string | number | unknown;
  bidValue: string | number | unknown;
  tags: string[];
};

export interface IStorageData {
  storageLoading: boolean;
  owner: string;
  verifier: string;
  sender: string;
  biddingOpen: boolean;
  biddingEnd: boolean;
  bidHashes: number;
  bidValue: number;
  totalBids: number;
  totalRevealed: number;
  dataList: Array<TDataList> | null;
}

const initialValues = {
  storageLoading: false,
  owner: "",
  verifier: "",
  sender: "",
  bidHashes: 0,
  bidValue: 0,
  biddingOpen: false,
  biddingEnd: false,
  totalBids: 0,
  totalRevealed: 0,
  dataList: null,
};

export const useStorageData = create<
  IStorageData & {
    updateStorageLoad: (isLoading: boolean) => void;
    updateOwner: (owner: string) => void;
    updateVerifier: (verifier: string) => void;
    updateStatusBidding: (newStatus: boolean) => void;
    updateBiddingEnd: (newStatus: boolean) => void;
    updateBidHashes: (hash: number) => void;
    updateDataList: (dataList: Array<TDataList>) => void;
    updateTotalRevealed: (length: number) => void;
    updateBidValue: (value: number) => void;
    reset: () => void;
  }
>()((set) => ({
  ...initialValues,
  updateDataList: (dataList) =>
    set((state) => {
      const oldData = keyBy(dataList, "key");
      return {
        ...state,
        dataList: dataList.map((data) => {
          const _oldData = oldData ? { ...oldData[data.key] } : {};
          return { ...data, ..._oldData };
        }),
      };
    }),
  updateStorageLoad: (storageLoading) =>
    set((state) => ({ ...state, storageLoading })),
  updateBidValue: (value) => set((state) => ({ ...state, bidValue: +value })),
  updateTotalRevealed: (totalRevealed) =>
    set((state) => ({ ...state, totalRevealed: +totalRevealed })),
  updateBidHashes: (hash) => set((state) => ({ ...state, bidHashes: hash })),
  updateOwner: (owner) => set((state) => ({ ...state, owner })),
  updateVerifier: (verifier) => set((state) => ({ ...state, verifier })),
  updateStatusBidding: (newStatus) =>
    set((state) => ({ ...state, biddingOpen: newStatus })),
  updateBiddingEnd: (newStatus) =>
    set((state) => ({ ...state, biddingEnd: newStatus })),
  reset: () => set(() => ({ ...initialValues })),
}));
