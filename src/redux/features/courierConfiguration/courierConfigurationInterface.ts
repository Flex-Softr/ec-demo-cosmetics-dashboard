export type TCourierCredentials = {
  key: string;
  value: string;
  need_to_hash: boolean | undefined;
  is_optional: boolean | undefined;
};

export type TCourierConfig = {
  _id: string; /** Unique identifier */
  name: string; /** Name of the courier service (e.g., Pathao, Steadfast) */
  apiBaseUrl: string; /** API Base URL */
  apiKey: string; /** API Key */
  secretKey: string; /** Secret Key */
  description?: string | null; /** Description of the courier */
  thumb?: string | null; /** Thumbnail URL or ID */
  credentials?: TCourierCredentials[]; /** Dynamic credentials */
  isActive: boolean; /** Is this courier currently active? */
  createdAt?: string;
  updatedAt?: string;
};

export type TCourierConfigInitialState = {
  couriers: TCourierConfig[];
  isLoading: boolean;
  error: string | null;
  selectedCourier: TCourierConfig | null; // For editing
};
