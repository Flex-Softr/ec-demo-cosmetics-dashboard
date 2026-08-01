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
    <div className="flex flex-col gap-1 min-w-0 text-left max-w-[200px]">
      <span
        className="text-sm text-foreground line-clamp-2 leading-snug"
        title={titleLabel}
      >
        {title}
      </span>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
          &#2547;{unitPrice || 0} × {quantity || 0}
        </span>
        {extra > 0 && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary whitespace-nowrap">
            +{extra} more
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
