export type TSlider = {
  _id: string;
  name: string;
  image: {
    _id: string;
    src: string;
  };
  isActive: boolean;
  bannerLink?: string;
  sortOrder: number;
};
