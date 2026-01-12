import { TOrderedProducts } from "@/types/order.interface";

const ProductInfo = ({ products = [] }: { products: TOrderedProducts[] }) => {
  const length = products?.length;
  const {
    title = "",
    unitPrice = "",
    quantity = "",
    attributes = {},
  } = length ? products[0] : {};
  // const variation =
  //   length &&
  //   products[0] &&
  //   products[0]?.variation;
  // const attributes =
  //   typeof variation === "object" &&
  //   variation !== null &&
  //   variation !== undefined
  //     ? variation.attributes
  //     : {};
  const variationProps = Object.keys(attributes || {})
    .map((key) => attributes[key])
    .join(" ");

  return (
    <div>
      <p className="flex flex-col gap-1" title={`${title}\n${variationProps}`}>
        {title.length > 18 ? title.slice(0, 18) + "..." : title}
      </p>
      <p>&#2547; {unitPrice || 0}</p>
      <p>Quantity : {quantity || 0}</p>
      {length > 1 && (
        <p className="text-primary">
          And {length - 1} more {length - 1 === 1 ? "item" : "items"}.
        </p>
      )}
    </div>
  );
};

export default ProductInfo;
