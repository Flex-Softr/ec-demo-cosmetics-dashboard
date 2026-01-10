import { formatStockStatus, getStockStatusColor } from "@/lib/utils";
import { IAdminProduct } from "@/types/products";
import { Minus } from "lucide-react";

type Variation = NonNullable<IAdminProduct["variations"]>[number];

type ProductVariationsProps = {
  variations: Variation[];
  type: "attributes" | "sku" | "price" | "stock" | "qty";
};

const ProductVariations = ({ variations, type }: ProductVariationsProps) => {
  if (!variations || variations.length === 0)
    return <Minus className="mx-auto" />;

  return (
    <div className="flex flex-col w-full divide-y divide-border/50">
      {variations.map((v, index) => (
        <div
          key={v._id || index}
          className="text-sm min-h-[32px] py-2 flex items-center justify-center"
        >
          {type === "attributes" && (
            <div className="flex flex-wrap gap-1 justify-center">
              {Object.entries(v.attributes).map(([key, value]) => (
                <span
                  key={key}
                  className="text-muted-foreground whitespace-nowrap"
                >
                  {key}: {value}
                </span>
              ))}
            </div>
          )}
          {type === "sku" && <span>{v.inventory.sku}</span>}
          {type === "price" && (
            <div className="flex gap-2 leading-tight items-baseline py-[1px]">
              <span
                className={
                  v.price.salePrice
                    ? "line-through text-muted-foreground text-xs text-red-600"
                    : ""
                }
              >
                ৳ {v.price.regularPrice}
              </span>
              {v.price.salePrice && <span>৳ {v.price.salePrice}</span>}
            </div>
          )}

          {type === "stock" && (
            <span
              className={`${getStockStatusColor(v.inventory.stockStatus)} whitespace-nowrap`}
            >
              {formatStockStatus(v.inventory.stockStatus)}
            </span>
          )}
          {type === "qty" && <span>{v.inventory.stockAvailable}</span>}
        </div>
      ))}
    </div>
  );
};

export default ProductVariations;
