import { Checkbox } from "@/components/ui/checkbox";
import config from "@/config/config";
import { IAdminProduct } from "@/types/products";
import { ColumnDef } from "@tanstack/react-table";
// import { ChevronDown, ChevronRight } from "lucide-react";
import { Minus } from "lucide-react";
import Image from "next/image";
import Actions from "./Actions";
import ProductVariations from "./ProductVariations";

export const ProductColumns: ColumnDef<IAdminProduct>[] = [
  {
    id: "select",
    // header: ({ table }) => (
    //   <div className="flex justify-center items-center py-2 px-2">
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   </div>
    // ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center py-2 px-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "",
  //   header: "SL",
  //   cell: ({ row }) => (
  //     <div className="flex flex-col justify-center items-center">
  //       <span className="">{row.index + 1}</span>
  //     </div>
  //   ),
  // },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const { thumbnail } = row.original;
      return (
        <div className="flex justify-start items-center gap-3 rounded py-2 px-4">
          <Image
            width={80}
            height={80}
            src={`${config.base_url}/${thumbnail.src}`}
            alt={thumbnail.alt}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="flex flex-col items-start gap-1 py-2 px-4">
        <div className="flex items-center gap-2">
          {/* {row.getCanExpand() ? (
            <button
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: "pointer" },
              }}
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <span className="w-4" />
          )} */}
          <span title={row.original.title} className="font-semibold text-left">
            {row.original.title.length > 70
              ? `${row.original.title.substring(0, 70)}...`
              : row.original.title}
          </span>
        </div>
        {row.original.type === "variable" && (
          <div className="mt-0.5">
            <ProductVariations
              variations={row.original.variations!}
              type="attributes"
            />
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "sku",
    header: () => <div className="text-center">SKU</div>,
    cell: ({ row }) =>
      row.original.type === "simple" ? (
        <div className="flex justify-center px-4 py-2 text-nowrap w-[1%] mx-auto">
          <span>{row.original.sku}</span>
        </div>
      ) : (
        <div className="flex flex-col justify-start items-center gap-1 px-4 py-2 text-nowrap w-[1%] mx-auto whitespace-nowrap">
          <p className="h-5 flex items-center shrink-0">
            <Minus className="h-4 w-4" />
          </p>
          <div className="mt-0.5">
            <ProductVariations
              variations={row.original.variations!}
              type="sku"
            />
          </div>
        </div>
      ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center">Price</div>,
    cell: ({ row: { original } }) =>
      original.type === "simple" ? (
        <div className="flex gap-2 items-baseline justify-center px-4 py-2 text-nowrap w-[1%] mx-auto">
          <span
            className={
              original.salePrice
                ? "line-through text-muted-foreground text-xs"
                : ""
            }
          >
            ৳ {original.regularPrice}
          </span>
          {original.salePrice && <span>৳ {original.salePrice}</span>}
        </div>
      ) : (
        <div className="flex flex-col justify-start items-center gap-1 px-4 py-2 text-nowrap w-[1%] mx-auto whitespace-nowrap">
          <p className="h-5 flex items-center shrink-0">
            <Minus className="h-4 w-4" />
          </p>
          <div className="mt-0.5">
            <ProductVariations variations={original.variations!} type="price" />
          </div>
        </div>
      ),
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-center">Stock</div>,
    cell: ({ row }) =>
      row.original.type === "simple" ? (
        <div className="flex flex-col gap-1 justify-center items-center min-w-[90px] px-4 py-2 whitespace-nowrap w-[1%] mx-auto">
          {row.original.stockStatus === "In stock" ? (
            <span className="text-green-500">{row.original.stockStatus}</span>
          ) : row.original.stockStatus === "Out of stock" ? (
            <span className="text-red-700">{row.original.stockStatus}</span>
          ) : (
            <span className="text-yellow-700">{row.original.stockStatus}</span>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-start items-center gap-1 px-4 py-2 w-[1%] mx-auto whitespace-nowrap">
          <p className="h-5 flex items-center shrink-0">
            <Minus className="h-4 w-4" />
          </p>
          <div className="mt-0.5">
            <ProductVariations
              variations={row.original.variations!}
              type="stock"
            />
          </div>
        </div>
      ),
  },
  {
    accessorKey: "stockAvailable",
    header: () => <div className="text-center">Qty</div>,
    cell: ({ row: { original } }) =>
      original.type === "simple" ? (
        <div className="flex justify-center px-4 py-2 whitespace-nowrap w-[1%] mx-auto">
          <span>{original.stockAvailable}</span>
        </div>
      ) : (
        <div className="flex flex-col justify-start items-center gap-1 px-4 py-2 w-[1%] mx-auto whitespace-nowrap">
          <p className="h-5 flex items-center shrink-0">
            <Minus className="h-4 w-4" />
          </p>
          <div className="mt-0.5">
            <ProductVariations variations={original.variations!} type="qty" />
          </div>
        </div>
      ),
  },
  {
    accessorKey: "category",
    header: () => <div className="text-center">Category</div>,
    cell: ({ row }) => {
      const { category } = row.original;
      return (
        <div className="flex justify-center w-[1%] mx-auto">
          <span title={category.name} className="whitespace-nowrap">
            {category.name.length > 10
              ? category.name.slice(0, 10) + "..."
              : category.name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "publishedStatus",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const statusValue = row.original.publishedStatus;
      let colorClass = "";

      if (statusValue === "published") {
        colorClass = "text-green-500";
      } else if (statusValue === "draft") {
        colorClass = "text-yellow-700";
      } else if (statusValue === "private") {
        colorClass = "text-red-600";
      }

      return (
        <div className="flex justify-center w-[1%] mx-auto">
          <span className={`capitalize ${colorClass} whitespace-nowrap`}>
            {statusValue}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Action</div>,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex justify-center w-[1%] mx-auto">
        <Actions _id={row.original._id} />
      </div>
    ),
  },
];
