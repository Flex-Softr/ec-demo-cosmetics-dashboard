import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import config from "@/config/config";
import Actions from "./Actions";
import { TAllProducts } from "@/redux/features/allProducts/allProductsInterface";

export const columns: ColumnDef<TAllProducts>[] = [
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
        <div className="flex justify-start items-center gap-3 rounded">
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
      <span title={row.original.title}>
        {row.original.title.length > 20
          ? row.original.title.slice(0, 20) + "..."
          : row.original.title}
      </span>
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
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => <span>{row.original.sku}</span>,
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 justify-center items-center min-w-[90px]">
        <span>{row.original.stockAvailable}</span>
        {row.original.stockStatus === "In stock" ? (
          <span className="text-green-500">{row.original.stockStatus}</span>
        ) : row.original.stockStatus === "Out of stock" ? (
          <span className="text-red-700">{row.original.stockStatus}</span>
        ) : (
          <span className="text-yellow-700">{row.original.stockStatus}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row: { original } }) => (
      <span>৳ {original.salePrice || original.regularPrice}</span>
    ),
  },
  // {
  //   accessorKey: "sales",
  //   header: "Sales",
  //   cell: ({ row }) => <span>{row.original.sales}150</span>,
  // },
  // {
  //   accessorKey: "rating",
  //   header: "Rating",
  //   cell: ({ row }) => (
  //     <div className="flex flex-col gap-1">
  //       <span>{row.original.totalReview}</span>
  //       <span>{row.original.averageRating}55555</span>
  //     </div>
  //   ),
  // },
  {
    accessorKey: "published",
    header: "Published",
    cell: ({ row }) => <span>{row.original.published}</span>,
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => <Actions _id={row.original._id} />,
  },
];
