import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { TAttribute } from "../lib/attribute.interface";
import AddNewAttributeValue from "./AddNewAttributeValue";
import UpdateAttributeValue from "./UpdateAttributeValue";

const AttributeValueUpdate = ({ attribute }: { attribute: TAttribute }) => {
  return (
    <div>
      <DialogHeader>
        <DialogTitle>
          Add Attribute Value for{" "}
          <span className="text-primary font-semibold">{attribute?.name}</span>{" "}
        </DialogTitle>
      </DialogHeader>
      <div className="py-4 space-y-3">
        <AddNewAttributeValue attributeId={attribute?._id} />

        <p className="font-semibold">Update Attribute Value</p>
        <div className="grid grid-cols-2 gap-3">
          {attribute?.values?.map((item) => (
            <UpdateAttributeValue
              key={item._id}
              item={item}
              attributeId={attribute?._id}
            />
          ))}
        </div>
      </div>
      <DialogFooter>
        <DialogClose>
          <Button>Done</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
};

export default AttributeValueUpdate;
