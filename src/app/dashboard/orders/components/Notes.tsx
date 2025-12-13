"use client";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { TFormInput } from "./CreateOrder";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { TOrders } from "@/types/order/order.interface";

type TProps = {
  order: TOrders | undefined;
  register: UseFormRegister<TFormInput>;
  errors: FieldErrors<TFormInput>;
};

const Notes = ({ register }: TProps) => {
  return (
    <Tabs defaultValue="orderNote">
      <TabsList className="grid w-full grid-cols-3 gap-4 bg-cyan-50">
        <TabsTrigger
          value="orderNote"
          className="border border-cyan-400 data-[state=active]:bg-primary data-[state=active]:text-white"
        >
          Official Note
        </TabsTrigger>
        <TabsTrigger
          value="invoiceNote"
          className="border border-cyan-400 data-[state=active]:bg-primary data-[state=active]:text-white"
        >
          Invoice Note
        </TabsTrigger>
        <TabsTrigger
          value="courierNote"
          className="border border-cyan-400 data-[state=active]:bg-primary data-[state=active]:text-white"
        >
          Courier Note
        </TabsTrigger>
      </TabsList>
      <TabsContent value="orderNote">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="orderNote">Note</Label>
          <Textarea
            placeholder="Type note here."
            id="orderNote"
            className="min-h-20 border border-primary focus-visible:ring-primary"
            {...register("officialNotes")}
            // defaultValue={order?.officialNotes}
          />
        </div>
      </TabsContent>
      <TabsContent value="invoiceNote">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="invoiceNote">Note</Label>
          <Textarea
            placeholder="Type note here."
            id="invoiceNote"
            className="min-h-20 border border-primary focus-visible:ring-primary"
            {...register("invoiceNotes")}
            // defaultValue={order?.invoiceNotes}
          />
        </div>
      </TabsContent>
      <TabsContent value="courierNote">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="courierNote">Note</Label>
          <Textarea
            placeholder="Type note here."
            id="courierNote"
            className="min-h-20 border border-primary focus-visible:ring-primary"
            {...register("courierNotes")}
            // defaultValue={order?.courierNotes}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default Notes;
