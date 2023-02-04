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

  isOpenJoinRoom: boolean;
  toggleOpenJoinRoom: () => void;

  isOpenBidding: boolean;
  toggleOpenBidding: () => void;
}

const initialValues = {
  isOpenCreate: false,
  isOpenAddWhiteList: false,
  isOpenUpdateDurationTime: false,
  isOpenRoom: false,
  isCloseRoom: false,
  isOpenJoinRoom: false,
  isOpenBidding: false,
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

  toggleOpenJoinRoom: () =>
    set((state) => ({
      ...state,
      isOpenJoinRoom: !state.isOpenJoinRoom,
    })),

  toggleOpenBidding: () =>
    set((state) => ({
      ...state,
      isOpenBidding: !state.isOpenBidding,
    })),
}));
