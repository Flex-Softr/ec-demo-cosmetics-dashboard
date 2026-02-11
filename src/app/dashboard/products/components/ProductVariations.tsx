import { formatStockStatus, getStockStatusColor } from "@/lib/utils";
import { IAdminProduct } from "@/types/products";
import { Minus } from "lucide-react";

export type Variation = NonNullable<IAdminProduct["variations"]>[number];

export const VariationAttributes = ({
  attributes,
}: {
  attributes: Variation["attributes"];
}) => (
  <div className="flex flex-wrap gap-x-2 gap-y-1 justify-start ml-8">
    {Object.entries(attributes).map(([key, value]) => (
      <span
        key={key}
        className="text-muted-foreground whitespace-nowrap px-1.5 py-0.5 rounded-sm bg-slate-100 border border-slate-200"
      >
        {key}: {value}
      </span>
    ))}
  </div>
);

export const VariationSKU = ({ sku }: { sku?: string }) => (
  <span className="text-muted-foreground text-nowrap text-sm">
    {sku ? sku : <Minus className="h-4 w-4 mx-auto text-gray-500" />}
  </span>
);

export const VariationPrice = ({ price }: { price: Variation["price"] }) => (
  <div className="flex gap-2 leading-tight items-baseline justify-center">
    <span
      className={
        price.salePrice
          ? "line-through text-muted-foreground text-xs whitespace-nowrap"
          : "text-xs whitespace-nowrap"
      }
    >
      &#2547; {price.regularPrice}
    </span>
    {price.salePrice && (
      <span className="whitespace-nowrap">&#2547; {price.salePrice}</span>
    )}
  </div>
);

export const VariationStock = ({ status }: { status: string }) => (
  <span className={`${getStockStatusColor(status)} whitespace-nowrap`}>
    {formatStockStatus(status)}
  </span>
);

export const VariationQty = ({
  manageStock,
  stockAvailable,
}: {
  manageStock: boolean;
  stockAvailable: number;
}) => (
  <>
    {!manageStock && stockAvailable === 0 ? (
      <Minus className="h-4 w-4 mx-auto text-gray-500" />
    ) : (
      <span className="font-medium">{stockAvailable}</span>
    )}
  </>
);

export const VariationActiveStatus = ({ isActive }: { isActive: boolean }) => (
  <div className="flex justify-center">
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        isActive ? "text-green-700" : "text-gray-500"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  </div>
);

type ProductVariationsProps = {
  variations: Variation[];
  type: "attributes" | "sku" | "price" | "stock" | "qty";
};

// Keep deprecated component for backward compatibility if needed,
// but it's better to use the exported components directly in the table row
const ProductVariations = ({ variations, type }: ProductVariationsProps) => {
  if (!variations || variations.length === 0)
    return <Minus className="mx-auto" />;

  return (
    <div className="flex flex-col w-full divide-y divide-border/50">
      {variations.map((v, index) => (
        <div
          key={v._id || index}
          className="text-sm min-h-[32px] py-1 flex items-center"
        >
          {type === "attributes" && (
            <VariationAttributes attributes={v.attributes} />
          )}
          {type === "sku" && <VariationSKU sku={v.inventory.sku} />}
          {type === "price" && <VariationPrice price={v.price} />}
          {type === "stock" && (
            <VariationStock status={v.inventory.stockStatus} />
          )}
          {type === "qty" && (
            <VariationQty
              manageStock={v.inventory.manageStock}
              stockAvailable={v.inventory.stockAvailable}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductVariations;
