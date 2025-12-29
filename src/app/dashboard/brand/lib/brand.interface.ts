export type TBrand = {
  _id: string;
  name: string;
  slug: string;
  logo: { src: string; alt: string };
  isActive: boolean;
  description: string;
};

export type TBrandForm = {
  name: string;
  description?: string;
  logo?: string;
};

export type TBrandPayload = Partial<Omit<TBrand, "logo">> & { logo?: string };
