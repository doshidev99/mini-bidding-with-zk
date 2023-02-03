import create from "zustand";

export interface IStorageData {
  isOpenCreate: boolean;
  toggleOpenCreate: () => void;

  isOpenAddWhiteList: boolean;
  toggleOpenAddWhiteList: () => void;

  isOpenUpdateDurationTime: boolean;
  toggleOpenUpdateDurationTime: () => void;

  isOpenRoom: boolean;
  toggleOpenRoom: () => void;

  isCloseRoom: boolean;
  toggleCloseRoom: () => void;
}

const initialValues = {
  isOpenCreate: false,
  isOpenAddWhiteList: false,
  isOpenUpdateDurationTime: false,
  isOpenRoom: false,
  isCloseRoom: false,
};

export const useStoreModal = create<IStorageData & {}>()((set) => ({
  ...initialValues,
  toggleOpenCreate: () =>
    set((state) => ({
      ...state,
      isOpenCreate: !state.isOpenCreate,
    })),

  toggleOpenAddWhiteList: () =>
    set((state) => ({
      ...state,
      isOpenAddWhiteList: !state.isOpenAddWhiteList,
    })),

  toggleOpenUpdateDurationTime: () =>
    set((state) => ({
      ...state,
      isOpenUpdateDurationTime: !state.isOpenUpdateDurationTime,
    })),

  toggleOpenRoom: () =>
    set((state) => ({
      ...state,
      isOpenRoom: !state.isOpenRoom,
    })),

  toggleCloseRoom: () =>
    set((state) => ({
      ...state,
      isCloseRoom: !state.isCloseRoom,
    })),
}));
