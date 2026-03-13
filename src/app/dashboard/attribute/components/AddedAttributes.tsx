"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import {
  useDeleteAttributeMutation,
  useGetAttributesQuery,
  useUpdateAttributeMutation,
} from "@/redux/features/attributes/attributesApi";
import { PencilIcon, Settings, TrashIcon } from "lucide-react";
import { useState } from "react";
import { TAttribute } from "../lib/attribute.interface";
import AttributeValueUpdateModal from "./AttributeValueUpdateModal";
import UpdateAttributeActiveStatus from "./UpdateAttributeActiveStatus";

const AttributeRow = ({ singleAttribute }: { singleAttribute: TAttribute }) => {
  const [attributeName, setAttributeName] = useState(
    singleAttribute?.name || ""
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [deleteAttribute] = useDeleteAttributeMutation();
  const [updateAttribute] = useUpdateAttributeMutation();

  const handleDeleteAttributes = async () => {
    const res = await deleteAttribute({
      attributeIds: [singleAttribute._id],
    }).unwrap();
    if (res?.success) {
      toast({
        className: "bg-success text-white text-2xl",
        title: res?.message,
      });
      setDeleteOpen(false);
    } else {
      toast({
        className: "bg-danger text-white text-2xl",
        title: res?.message || "Failed to delete attribute",
      });
    }
  };

  const handleUpdateAttributes = async () => {
    const res = await updateAttribute({
      id: singleAttribute._id,
      data: { name: attributeName },
    }).unwrap();

    if (res?.success) {
      toast({
        className: "bg-success text-white text-2xl",
        title: res?.message,
      });
      setEditOpen(false);
    } else {
      toast({
        className: "bg-danger text-white text-2xl",
        title: res?.message || "Failed to update attribute",
      });
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div>{singleAttribute?.name}</div>
        <div className="flex gap-3">
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <TrashIcon className="text-red-500 w-4 cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] h-fit">
              <h1 className="text-3xl">Are you sure?</h1>
              <div className="flex gap-4 items-center ">
                <DialogClose asChild>
                  <Button className="bg-red-500 hover:bg-red-500">
                    Cancel
                  </Button>
                </DialogClose>
                <Button onClick={handleDeleteAttributes}>
                  Yes, Delete it!
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <PencilIcon className="text-red-500 w-4 cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] h-fit">
              <DialogHeader>
                <DialogTitle>Edit Attribute Name</DialogTitle>
              </DialogHeader>
              <div>
                <Input
                  defaultValue={singleAttribute?.name}
                  onChange={(e) => setAttributeName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <DialogFooter>
                <Button onClick={handleUpdateAttributes}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex flex-wrap gap-2 py-2">
          {singleAttribute.values?.map((item) => (
            <span
              key={item?._id}
              className="px-2 py-1 text-xs font-medium rounded-md bg-secondary text-secondary-foreground border border-border"
            >
              {item?.name}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell className="w-[100px]">
        <div className="flex justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Settings className="cursor-pointer text-muted-foreground hover:text-primary transition-colors h-5 w-5" />
            </DialogTrigger>
            <DialogContent className="h-fit">
              <AttributeValueUpdateModal attribute={singleAttribute} />
            </DialogContent>
          </Dialog>
        </div>
      </TableCell>
      <TableCell>
        <UpdateAttributeActiveStatus attribute={singleAttribute} />
      </TableCell>
    </TableRow>
  );
};

const AddedAttributes = () => {
  const { data, isLoading } = useGetAttributesQuery({});
  const attributes = data?.data || [];

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center h-40">
        <p className="text-xl font-semibold text-gray-900">
          Loading attributes...
        </p>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <Card className="space-y-5">
        <h2 className="text-xl font-bold">Configure Attribute Value</h2>
        <Table>
          <TableHeader className="bg-primary text-white hover:bg-primary/90">
            <TableRow className="hover:bg-primary/90">
              <TableHead className="w-[100px] text-white">Name</TableHead>
              <TableHead className="text-white">Terms</TableHead>
              <TableHead className="text-white">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attributes?.map((singleAttribute: TAttribute) => (
              <AttributeRow
                key={singleAttribute?._id}
                singleAttribute={singleAttribute}
              />
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AddedAttributes;
