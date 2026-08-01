"use client";

import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ICollection } from "@/types/collection";
import BrandInput from "./BrandInput";
import { CategoryField } from "./CategoryField";
import CollectionInput from "./CollectionInput";
import Featured from "./Featured";

type ProductOrganizationPanelProps = {
  collectionsData: ICollection[] | undefined;
  isLoading: boolean;
};

const ProductOrganizationPanel = ({
  collectionsData,
  isLoading,
}: ProductOrganizationPanelProps) => {
  return (
    <SectionContentWrapper heading="Organization">
      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Brand
          </Label>
          <BrandInput embedded />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Featured
          </Label>
          <Featured embedded />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Category
          </Label>
          <CategoryField embedded />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Collection
          </Label>
          <CollectionInput
            embedded
            collectionsData={collectionsData}
            isLoading={isLoading}
          />
        </div>
      </div>
    </SectionContentWrapper>
  );
};

export default ProductOrganizationPanel;
