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
  useUpdateAttributeMutation,
} from "@/redux/features/addAttributes/attributesApi";
import { PencilIcon, Settings, TrashIcon } from "lucide-react";
import { useState } from "react";
import { TAttribute } from "../lib/attribute.interface";
import AttributeValueUpdateModal from "./AttributeValueUpdateModal";
import { refetchData } from "@/utilities/fetchData";

const AddedAttributes = ({ attributes = [] }: { attributes: TAttribute[] }) => {
  const [attributeName, setAttributeName] = useState("");
  //handle delete an attributes
  const [deleteAttribute] = useDeleteAttributeMutation();
  const [updateAttribute] = useUpdateAttributeMutation();

  const handleDeleteAttributes = async (attributeId: string) => {
    const res = await deleteAttribute({ attributeIds: [attributeId] }).unwrap();
    if (res?.success) {
      refetchData("attributes");
      toast({
        className: "bg-success text-white text-2xl",
        title: res?.message,
      });
    } else {
      toast({
        className: "bg-success text-white text-2xl",
        title: res?.message,
      });
    }
  };

  // update Attribute Name
  const handleUpdateAttributes = async (attributeId: string) => {
    const data = { attributeId: attributeId, name: attributeName };
    const res = await updateAttribute(data).unwrap();

    if (res?.success) {
      refetchData("attributes");
      toast({
        className: "bg-success text-white text-2xl",
        title: res?.message,
      });
    } else {
      toast({
        className: "bg-success text-white text-2xl",
        title: res?.message,
      });
    }
  };

  return (
    <div className="w-full">
      <Card className="p-4 shadow-none rounded-xl space-y-5">
        <h2 className="text-xl font-bold">Configure Attribute Value</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Terms</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attributes?.map((singleAttribute) => (
              <TableRow key={singleAttribute?._id}>
                <TableCell className="font-medium">
                  <div>{singleAttribute?.name}</div>
                  <div className="flex gap-3">
                    {" "}
                    <Dialog>
                      <DialogTrigger>
                        {" "}
                        <TrashIcon
                          // onClick={() => handleAttributes(singleAttribute?._id)}
                          className="text-red-500 w-4 cursor-pointer"
                        />
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] h-fit">
                        <h1 className="text-3xl">Are you sure?</h1>
                        <div className="flex gap-4 items-center ">
                          <DialogClose asChild>
                            <Button className="bg-red-500 hover:bg-red-500">
                              Cancel
                            </Button>
                          </DialogClose>{" "}
                          <Button
                            onClick={() =>
                              handleDeleteAttributes(singleAttribute?._id)
                            }
                            className=""
                          >
                            Yes, Delete it!
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {/* update the attribute modal  */}
                    <Dialog>
                      <DialogTrigger>
                        {" "}
                        <PencilIcon className="text-red-500 w-4 cursor-pointer" />
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] h-fit">
                        <DialogHeader>
                          <DialogTitle>Edit Attribute Name </DialogTitle>
                        </DialogHeader>
                        <div className="">
                          <Input
                            defaultValue={singleAttribute?.name}
                            onChange={(e) => setAttributeName(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose>
                            <Button
                              onClick={() =>
                                handleUpdateAttributes(singleAttribute?._id)
                              }
                            >
                              Save changes
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>

                <TableCell className="flex items-center ">
                  <div className="flex flex-grow  items-center w-full gap-2 border rounded-md p-2">
                    {singleAttribute.values?.map((item) => (
                      <p key={item?._id}>{item?.name},</p>
                    ))}
                  </div>

                  <div className="p-1">
                    {/* configure the attribute items  */}
                    <Dialog>
                      <DialogTrigger>
                        {" "}
                        <Settings className="cursor-pointer" />
                      </DialogTrigger>
                      <DialogContent className="  h-fit">
                        <AttributeValueUpdateModal
                          attribute={singleAttribute}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AddedAttributes;
