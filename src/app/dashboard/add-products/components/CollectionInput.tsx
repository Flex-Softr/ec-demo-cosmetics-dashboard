"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { ICollection } from "@/types/collection";
import { useFormContext } from "react-hook-form";

const CollectionInput = ({
  collectionsData,
  isLoading,
}: {
  collectionsData: ICollection[] | undefined;
  isLoading: boolean;
}) => {
  const collections = Array.isArray(collectionsData) ? collectionsData : [];

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selectedCollections = watch("productCollection");

  const toggleCollection = (collectionId: string) => {
    let newCollections = [...(selectedCollections || [])];

    if (newCollections.includes(collectionId)) {
      newCollections = newCollections.filter((id) => id !== collectionId);
    } else {
      newCollections.push(collectionId);
    }
    setValue("productCollection", newCollections, { shouldValidate: true });
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
                  checked={selectedCollections?.includes(collection._id)}
                  onChange={() => toggleCollection(collection._id)}
                  className="mr-1 size-4 cursor-pointer"
                />
                <label
                  htmlFor={`collection-${collection._id}`}
                  className={`text-gray-800 ${
                    selectedCollections?.includes(collection._id)
                      ? "font-bold"
                      : ""
                  }`}
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
