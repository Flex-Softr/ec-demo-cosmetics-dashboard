export type TCourierConfig = {
  _id: string; /** Unique identifier */
  name: string; /** Name of the courier service (e.g., Pathao, Steadfast) */
  apiBaseUrl: string; /** API Base URL */
  apiKey: string; /** API Key */
  secretKey: string; /** Secret Key */
  credentials?: string[]; /** Dynamic credentials */
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
