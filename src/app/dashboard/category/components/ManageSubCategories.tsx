import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import config from "@/config/config";
import {
  useAddSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetSubCategoriesQuery,
} from "@/redux/features/category/subCategoryApi";
import { setThumbnail } from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { refetchData } from "@/utilities/fetchData";
import { zodResolver } from "@hookform/resolvers/zod";
import { Archive, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AddCategoryMedia from "./AddCategoryMedia";
import { TCategories } from "./CategoryTable";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Subcategory Name must be at least 2 characters.",
  }),
  image: z.string().optional(),
});

type TSubCategoryForm = {
  name: string;
  image?: string;
};

const ManageSubCategories = ({ category }: { category: TCategories }) => {
  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useAppDispatch();
  const { thumbnail } = useAppSelector(({ imageSelector }) => imageSelector);

  const { data: subCategories, isLoading } = useGetSubCategoriesQuery(
    open ? { category: category._id } : undefined, // Only fetch if modal is open
    { skip: !open }
  );

  const [deleteSubCategory] = useDeleteSubCategoryMutation();
  const [addSubCategory] = useAddSubCategoryMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", image: "" },
  });

  useEffect(() => {
    if (!open) {
      setIsAdding(false);
      form.reset();
      dispatch(setThumbnail(""));
    }
  }, [open, dispatch, form]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this subcategory?")) {
      const res = await deleteSubCategory([id]).unwrap();
      if (res?.success) {
        toast({ title: "Subcategory deleted" });
      }
    }
  };

  const onSubmit = async (data: TSubCategoryForm) => {
    const payload = {
      ...data,
      category: category._id,
      image: thumbnail || undefined,
    };
    const res = await addSubCategory(payload).unwrap();
    if (res?.success) {
      await refetchData("categories");
      form.reset();
      dispatch(setThumbnail(""));
      setIsAdding(false);
      toast({ title: "Subcategory added", className: "bg-success text-white" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Archive className="w-4 h-4 mr-2" /> Sub Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Sub Categories - {category.name}</DialogTitle>
          <DialogDescription>
            View and manage subcategories for this category.
          </DialogDescription>
        </DialogHeader>

        {isAdding ? (
          <div className="space-y-4 border p-4 rounded-md bg-slate-50">
            <h3 className="font-semibold">Add New Subcategory</h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <Input placeholder="Subcategory Name" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AddCategoryMedia />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsAdding(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <Button
            className="w-full"
            variant="outline"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Add New Subcategory
          </Button>
        )}

        <div className="mt-4">
          <Table>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell>Loading...</TableCell>
                </TableRow>
              ) : subCategories?.data?.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                subCategories?.data?.map((sub: any) => (
                  <TableRow key={sub._id}>
                    <TableCell>
                      {sub.image?.src && (
                        <Image
                          src={`${config.base_url}/${sub.image.src}`}
                          alt={sub.name}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{sub.name}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(sub._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">
                    No subcategories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageSubCategories;
