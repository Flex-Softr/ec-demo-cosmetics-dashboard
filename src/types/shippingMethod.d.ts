export type TCourierSlug = "steadfast" | "pathao" | "redx";

export type TCourierCredentials = {
  key: string;
  value: string;
  need_to_hash: boolean | undefined;
  is_optional: boolean | undefined;
};

export type TCourier = {
  id: string;
  name: string;
  slug: TCourierSlug;
  description: string | null;
  thumb: string | null;
  credentials: TCourierCredentials[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TRedXDeliveryArea = {
  id: number;
  name: string;
  post_code: number;
  district_name: string;
  division_name: string;
  zone_id: number;
};
