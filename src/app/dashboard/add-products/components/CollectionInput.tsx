"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ICollection } from "@/types/collection";
import { useFormContext } from "react-hook-form";

const CollectionInput = ({
  collectionsData,
  isLoading,
  embedded = false,
}: {
  collectionsData: ICollection[] | undefined;
  isLoading: boolean;
  embedded?: boolean;
}) => {
  const collections = Array.isArray(collectionsData) ? collectionsData : [];

  const {
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const selectedCollections: string[] = watch("productCollection") || [];

  const toggleCollection = (collectionId: string, checked: boolean) => {
    let newCollections = [...selectedCollections];

    if (checked) {
      newCollections.push(collectionId);
    } else {
      newCollections = newCollections.filter((id) => id !== collectionId);
    }
    setValue("productCollection", newCollections, { shouldValidate: true });
    clearErrors("productCollection");
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

  const content = (
    <>
      <div className="max-h-[220px] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-5 w-full animate-pulse rounded bg-muted"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {collections?.map((collection: ICollection) => {
              const isChecked = selectedCollections.includes(collection._id);

              return (
                <div key={collection._id} className="flex items-center gap-2">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      toggleCollection(collection._id, Boolean(checked));
                    }}
                  />
                  <span className={cn("text-sm", isChecked && "font-medium")}>
                    {collection.name}
                  </span>
                </div>
              );
            })}
            {collections.length === 0 && (
              <p className="p-2 text-sm text-muted-foreground">
                No active collections found.
              </p>
            )}
          </div>
        )}
      </div>
      {getError("productCollection") && (
        <p className="mt-2 text-sm text-destructive">
          {getError("productCollection")}
        </p>
      )}
    </>
  );

  if (embedded) return content;

  return (
    <SectionContentWrapper
      heading="Select Collection"
      height="max-h-[450px] overflow-y-auto"
    >
      {content}
    </SectionContentWrapper>
  );
};

export default CollectionInput;
