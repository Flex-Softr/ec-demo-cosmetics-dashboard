/* eslint-disable @typescript-eslint/no-explicit-any */
import { TEditOrderFormInput } from "./EditOrder";

export const dirtyValues = (
  dirtyFields: any,
  data: any
): Partial<TEditOrderFormInput> => {
  const changedData = Object.keys(dirtyFields).reduce(
    (acc, field) => {
      if (dirtyFields[field] === true) {
        acc[field] = data[field];
      } else if (typeof dirtyFields[field] === "object") {
        if (field === "productDetails") {
          acc[field] = Object.keys(dirtyFields[field]).map((subField) => {
            return data[field][subField];
          });
        } else {
          acc[field] = Object.keys(dirtyFields[field]).reduce(
            (subAcc, subField) => {
              if (dirtyFields[field][subField]) {
                subAcc[subField] = data[field][subField];
              }
              return subAcc;
            },
            {} as { [key: string]: unknown }
          );
        }
      }
      return acc;
    },
    {} as { [key: string]: unknown }
  );

  return changedData;
};
