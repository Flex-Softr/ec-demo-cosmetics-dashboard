import { Checkbox } from "@/components/ui/checkbox";
import config from "@/config/config";
import { IAdminProduct } from "@/types/products";
import { ColumnDef } from "@tanstack/react-table";
// import { ChevronDown, ChevronRight } from "lucide-react";
import { Minus } from "lucide-react";
import Image from "next/image";
import Actions from "./Actions";
import ProductVariations from "./ProductVariations";

export const columns: ColumnDef<IAdminProduct>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "",
    header: "SL",
    cell: ({ row }) => (
      <div className="flex flex-col justify-center items-center">
        <span className="">{row.index + 1}</span>
      </div>
    ),
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const { thumbnail } = row.original;
      return (
        <div className="flex justify-start items-center gap-3 rounded py-2 px-2">
          <Image
            width={50}
            height={50}
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
      <div className="flex flex-col items-start gap-1 py-2 px-2">
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
            {row.original.title}
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
    header: "SKU",
    cell: ({ row }) =>
      row.original.type === "simple" ? (
        <div className="flex justify-start px-2">
          <span>{row.original.sku}</span>
        </div>
      ) : (
        <div className="flex flex-col justify-start px-2">
          <p className="min-h-[32px] flex items-center">
            <Minus className="h-4 w-4" />
          </p>
          <ProductVariations variations={row.original.variations!} type="sku" />
        </div>
      ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row: { original } }) =>
      original.type === "simple" ? (
        <div className="flex flex-col items-start px-2">
          <span
            className={
              original.salePrice
                ? "line-through text-muted-foreground text-[10px]"
                : ""
            }
          >
            ৳ {original.regularPrice}
          </span>
          {original.salePrice && <span>৳ {original.salePrice}</span>}
        </div>
      ) : (
        <div className="flex flex-col justify-start px-2">
          <p className="min-h-[32px] flex items-center">
            <Minus className="h-4 w-4" />
          </p>
          <ProductVariations variations={original.variations!} type="price" />
        </div>
      ),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) =>
      row.original.type === "simple" ? (
        <div className="flex flex-col gap-1 justify-start items-start min-w-[90px] px-2">
          {row.original.stockStatus === "In stock" ? (
            <span className="text-green-500">{row.original.stockStatus}</span>
          ) : row.original.stockStatus === "Out of stock" ? (
            <span className="text-red-700">{row.original.stockStatus}</span>
          ) : (
            <span className="text-yellow-700">{row.original.stockStatus}</span>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-start px-2">
          <p className="min-h-[32px] flex items-center">
            <Minus className="h-4 w-4" />
          </p>
          <ProductVariations
            variations={row.original.variations!}
            type="stock"
          />
        </div>
      ),
  },
  {
    accessorKey: "stockAvailable",
    header: "Qty",
    cell: ({ row: { original } }) =>
      original.type === "simple" ? (
        <div className="flex justify-start px-2">
          <span>{original.stockAvailable}</span>
        </div>
      ) : (
        <div className="flex flex-col justify-start px-2">
          <p className="min-h-[32px] flex items-center">
            <Minus className="h-4 w-4" />
          </p>
          <ProductVariations variations={original.variations!} type="qty" />
        </div>
      ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const { category } = row.original;
      return (
        <span title={category.name}>
          {category.name.length > 10
            ? category.name.slice(0, 10) + "..."
            : category.name}
        </span>
      );
    },
  },
  {
    accessorKey: "publishedStatus",
    header: "Status",
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

      return <span className={`capitalize ${colorClass}`}>{statusValue}</span>;
    },
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => <Actions _id={row.original._id} />,
  },
];
