import { create } from "zustand";

export interface Images {
  [key: string]: { loading: boolean; blobUrl: string };
}

interface UseImageGalleryStoreProps {
  images: Images;
  setImages: (images: Images) => void;
}

const useImageGalleryStore = create<UseImageGalleryStoreProps>()((set) => ({
  images: {},

  setImages: (images) => {
    set((state) => ({
      ...state,
      images: images,
    }));
  },
}));

export default useImageGalleryStore;
