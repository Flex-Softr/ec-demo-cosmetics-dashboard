"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { useGetCollectionsQuery } from "@/redux/features/collection/collectionApi";
import { ICollection } from "@/types/collection";
import { useFormContext } from "react-hook-form";

const CollectionInput = () => {
  const { data: response, isLoading } = useGetCollectionsQuery({
    isActive: true,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collectionsData = (response?.data as any)?.data;
  const collections = Array.isArray(collectionsData) ? collectionsData : [];

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selectedCollection = watch("productCollection");

  const toggleCollection = (collectionId: string) => {
    if (selectedCollection === collectionId) {
      setValue("productCollection", undefined);
    } else {
      setValue("productCollection", collectionId, { shouldValidate: true });
    }
  };

  const getError = (path: string) => {
    const parts = path.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = errors;
    for (const p of parts) {
      if (current?.[p]) current = current[p];
      else return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (current as any)?.message as string | undefined;
  };

  return (
    <SectionContentWrapper heading="Select Collection">
      <div className="max-h-64 overflow-y-scroll">
        {isLoading ? (
          <p className="p-4 text-center text-gray-500 italic">
            Loading collections...
          </p>
        ) : (
          <ul className="list-none">
            {collections?.map((collection: ICollection) => (
              <li
                className="p-2 flex items-center space-x-4"
                key={collection._id}
              >
                <div
                  onClick={() => toggleCollection(collection._id)}
                  className="cursor-pointer"
                ></div>
                <input
                  type="checkbox"
                  id={`collection-${collection._id}`}
                  checked={selectedCollection === collection._id}
                  onChange={() => toggleCollection(collection._id)}
                  className="mr-1 size-4"
                />
                <label
                  htmlFor={`collection-${collection._id}`}
                  className={`text-gray-800 ${selectedCollection === collection._id ? "font-bold" : ""}`}
                >
                  {collection.title}
                </label>
              </li>
            ))}
            {collections.length === 0 && (
              <li className="p-2 text-gray-500">
                No active collections found.
              </li>
            )}
          </ul>
        )}
      </div>
      {getError("productCollection") && (
        <p className="text-red-500 text-sm mt-2">
          {getError("productCollection")}
        </p>
      )}
    </SectionContentWrapper>
  );
};

export default CollectionInput;
