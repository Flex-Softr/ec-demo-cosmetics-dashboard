export type TResponseMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type TResponseData<T> = T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TSuccessResponse<T = any> = {
  success: true;
  statusCode: number;
  message: string;
  meta?: TResponseMeta;
  data?: TResponseData<T>;
};

export type TErrorMessages = {
  message: string;
  path: string;
};

export type TErrorResponse = {
  success: false;
  message: string;
  errorMessages: TErrorMessages[];
};
