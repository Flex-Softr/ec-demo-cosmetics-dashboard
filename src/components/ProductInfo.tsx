import { TOrderedProducts } from "@/types/order.interface";

const ProductInfo = ({ products = [] }: { products: TOrderedProducts[] }) => {
  const first = products?.[0];
  const extra = (products?.length || 0) - 1;

  if (!first) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const { title = "", unitPrice = 0, quantity = 0, attributes = {} } = first;
  const variationProps = Object.values(attributes || {}).join(" ");
  const titleLabel = [title, variationProps].filter(Boolean).join(" · ");

  return (
    <div className="flex min-w-[140px] max-w-[180px] flex-col gap-1 text-left">
      <span
        className="block truncate text-sm leading-snug text-foreground"
        title={titleLabel}
      >
        {title}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <span className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">
          ৳{unitPrice || 0} × {quantity || 0}
        </span>
        {extra > 0 && (
          <span className="inline-flex items-center whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary">
            +{extra} more
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
