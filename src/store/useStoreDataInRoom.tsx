import create from "zustand";

export interface IStorageData {
  isLoadingDetailInRoom: boolean;
  currentRoom: any;
  updateIsLoadingInRoom: (isLoadingDetailInRoom: boolean) => void;
  updateDetailInRoom: (currentRoom: any) => void;

  isOwner: boolean;
  updateIsOwner: (isOwner: boolean) => void;
}

const initialValues = {
  isLoadingDetailInRoom: false,
  currentRoom: null,
  isOwner: false,
};

export const useStoreDataInRoom = create<IStorageData & {}>()((set) => ({
  ...initialValues,
  updateIsLoadingInRoom: (isLoadingDetailInRoom: boolean) =>
    set({ isLoadingDetailInRoom }),
  updateDetailInRoom: (currentRoom: any) => set({ currentRoom }),
  updateIsOwner: (isOwner: boolean) => set({ isOwner }),
}));
