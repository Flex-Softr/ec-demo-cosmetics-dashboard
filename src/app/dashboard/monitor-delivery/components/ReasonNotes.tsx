import CommonModal from "@/components/modal/CommonModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateOrderMutation } from "@/redux/features/orders/ordersApi";
import { TOrders } from "@/types/order/order.interface";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

const ReasonNotes = ({ order }: { order: TOrders }) => {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  const [updateOrder, { isLoading }] = useUpdateOrderMutation();
  const { register, handleSubmit } = useForm();

  const { reasonNotes, _id } = order;
  const onSubmit: SubmitHandler<FieldValues> = async (payload) => {
    try {
      await updateOrder({ payload, _id }).unwrap();
      // await refetchData("allOrders");
      // dispatch(setIsOrderUpdate(!iSOrderUpdate));
      handleOpen();
      toast({
        className: "bg-success text-white text-2xl",
        title: "Reason notes added successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.data?.message,
      });
    }
  };

  return (
    <>
      {reasonNotes ? (
        <button onClick={handleOpen} title={reasonNotes} className="relative">
          <span>
            {reasonNotes.length > 10
              ? reasonNotes.slice(0, 10) + "..."
              : reasonNotes}
          </span>
        </button>
      ) : (
        <Button
          onClick={handleOpen}
          className="bg-inherit text-inherit hover:bg-inherit"
        >
          Add note
        </Button>
      )}

      <CommonModal
        open={open}
        handleOpen={handleOpen}
        modalTitle="Add reason notes"
        className="h-[300px] w-[400px]"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs
            defaultValue="reasonNote"
            // onChange={(e) => handleTabClick(e.target)}
          >
            <TabsContent value="reasonNote">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="reasonNote">Note</Label>
                <Textarea
                  placeholder="Type note here."
                  id="reasonNote"
                  className="min-h-20 border border-primary focus-visible:ring-primary"
                  {...register("reasonNotes")}
                  defaultValue={order?.reasonNotes}
                />
              </div>
            </TabsContent>
            <div className="flex items-center justify-center mt-6">
              <Button type="submit" className="w-[200px]" disabled={isLoading}>
                Save
              </Button>
            </div>
          </Tabs>
        </form>
      </CommonModal>
    </>
  );
};

export default ReasonNotes;
