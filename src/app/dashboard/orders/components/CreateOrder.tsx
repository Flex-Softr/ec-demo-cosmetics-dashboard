"use client";
import CommonModal from "@/components/modal/CommonModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import { setIsOrderUpdate } from "@/redux/features/orders/ordersSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { TOrders } from "@/types/order/order.interface";
import { refetchData } from "@/utilities/fetchData";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import DivisionDistrictSelector from "./DivisionDistrictSelector";
import SelectProduct from "./SelectProduct";
import NameMobileAddress from "./NameMobileAddress";
import PaymentDiscountAdvance from "./PaymentDiscountAdvance";
import Notes from "./Notes";

const schema = yup.object().shape({
  shipping: yup.object().shape({
    fullName: yup.string().required("Customer name is required!"),
    phoneNumber: yup
      .string()
      .test("is-valid-phone", "Invalid phone number!", (value = "") =>
        /^01[0-9]{9}$/.test(value?.trim())
      )
      .required("Phone number is required!"),
    fullAddress: yup.string().required("Customer address is required!"),
    upazila: yup.string(),
    district: yup.string(),
    division: yup.string(),
  }),
  shippingCharge: yup.string().required("Shipping cost is required!"),
  payment: yup.object().shape({
    paymentMethod: yup.string().required("Payment is required!"),
  }),
  advance: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .min(0, "Advance must be a positive number")
    .optional(),
  discount: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .min(0, "Discount must be a positive number")
    .optional(),
  orderedProducts: yup.array(
    yup.object().shape({
      product: yup.string().required("Product name is required!"),
      quantity: yup
        .number()
        .min(1, "Stock quantity must be a positive number")
        .required("Stock quantity is required!")
        .typeError("Stock quantity is required!"),
      variation: yup.string().optional(),
    })
  ),
  orderSource: yup.object().shape({
    name: yup.string().required("Order source is required!"),
  }),
  orderNotes: yup.string().optional(),
  officialNotes: yup.string().optional(),
  invoiceNotes: yup.string().optional(),
  courierNotes: yup.string().optional(),
  custom: yup.boolean().default(true),
  eventId: yup.string().default("eventId"),
});

export type TFormInput = yup.InferType<typeof schema>;
type TProps = {
  order?: TOrders;
  text: string;
  className?: string;
  iconClassName?: string;
};

const CreateOrder = (props: TProps) => {
  const { order, text, className, iconClassName } = props;
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { iSOrderUpdate } = useAppSelector(({ orders }) => orders);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [open, setOpen] = useState(false);

  const { shipping, payment, shippingCharge } = order || {};

  const handleOpen = () => {
    setOpen(!open);
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<TFormInput> = async (data) => {
    try {
      await createOrder(data).unwrap();
      dispatch(setIsOrderUpdate(!iSOrderUpdate));
      await refetchData("allOrders");
      reset();
      handleOpen();
      toast({
        className: "bg-success text-white text-2xl",
        title: "Order created successfully!",
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
      <Button onClick={handleOpen} className={className}>
        <Plus className={iconClassName} /> <span>{text}</span>
      </Button>

      <CommonModal
        open={open}
        handleOpen={handleOpen}
        modalTitle="Create order"
        className="min-h-[550px] w-[980px]"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-3 gap-5">
            {/* customer name, mobile and address */}
            <NameMobileAddress
              register={register}
              reset={reset}
              control={control}
              shipping={shipping}
              errors={errors}
            />
          </div>
          {/* select district and division and shipping cost*/}
          <DivisionDistrictSelector<TFormInput>
            register={register}
            // reset={reset}
            setValue={setValue}
            control={control}
            shipping={shipping}
            shippingCharge={shippingCharge}
            errors={errors}
            // showDivision={false}
          />
          {/* payment method, discount and advance */}
          <PaymentDiscountAdvance
            register={register}
            payment={payment}
            errors={errors}
          />
          {/* select product */}
          <SelectProduct
            control={control}
            register={register}
            errors={errors}
          />
          {/* Orders notes */}
          <Notes register={register} order={undefined} errors={errors} />

          <div className="flex justify-between items-center mt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer font-medium rounded-full w-[400px] mx-auto"
            >
              Create Order
            </Button>
          </div>
        </form>
      </CommonModal>
    </>
  );
};

export default CreateOrder;
