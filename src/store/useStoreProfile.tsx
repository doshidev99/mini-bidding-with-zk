import create from "zustand";

export interface IStorageData {
  profile: any;
  updateProfile: (profile) => void;
}

const initialValues = {
  profile: null,
};

export const useStoreProfile = create<IStorageData & {}>()((set) => ({
  ...initialValues,
  updateProfile: (profile) =>
    set({
      profile,
    }),
}));
