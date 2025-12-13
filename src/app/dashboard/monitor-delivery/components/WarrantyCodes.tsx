"use client";
import CommonModal from "@/components/modal/CommonModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TOrders } from "@/types/order/order.interface";
import { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { TEditOrderFormInput } from "../../orders/[orderId]/components/EditOrder";

const WarrantyCodes = ({
  order,
  register,
}: {
  order: TOrders;
  register: UseFormRegister<TEditOrderFormInput>;
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  const warranty = order?.products?.find(({ warranty }) => {
    if (warranty?.warrantyCodes) {
      return true;
    }
  });

  return (
    <>
      {warranty ? (
        <Button
          onClick={handleOpen}
          type="button"
          className="bg-inherit text-inherit hover:bg-inherit"
        >
          View code
        </Button>
      ) : (
        <Button
          onClick={handleOpen}
          type="button"
          className="bg-inherit text-inherit hover:bg-inherit"
        >
          No warranty
        </Button>
      )}

      <CommonModal
        open={open}
        handleOpen={handleOpen}
        modalTitle="Add product code"
        className="h-[400px] w-[500px]"
      >
        <p className="text-center border-b border-primary -my-3 pb-1">
          <strong>Order Id : </strong> {order?.orderId}
        </p>
        <div className="space-y-5">
          {order.products.map(
            (
              {
                _id,
                title,
                quantity,
                isProductWarrantyAvailable,
                warranty,
                attributes = {},
              },
              productIndex
            ) => {
              const totalCodes = warranty?.warrantyCodes?.length || 0;
              const variationProps = Object.keys(attributes)
                .map((key) => attributes[key])
                .join(" ");
              return (
                <div key={productIndex}>
                  <h1 className="text-lg">
                    {title}{" "}
                    {variationProps && (
                      <span className="italic font-semibold text-secondary">
                        {""} ({variationProps})
                      </span>
                    )}
                  </h1>
                  <p>
                    <strong>Quantity : </strong> <span>{quantity}</span>
                  </p>
                  {isProductWarrantyAvailable ? (
                    <>
                      <input
                        type="text"
                        defaultValue={_id}
                        {...register(
                          `productDetails.${productIndex}.warrantyCodes`
                        )}
                        className="hidden"
                      />{" "}
                      <div className="grid grid-cols-2 gap-5 mt-2">
                        {Array.from({
                          length: totalCodes < quantity ? quantity : totalCodes,
                        }).map((_, index) => (
                          <div
                            className="space-y-2 flex-1"
                            key={`product-${productIndex}-quantity-${index}`}
                          >
                            <Label
                              htmlFor={`quantity-${productIndex}-${index}`}
                            >
                              Product {index + 1} code
                              <span className="text-red-600">*</span>
                            </Label>
                            <div className="space-y-2">
                              <Input
                                type="text"
                                {...register(
                                  `productDetails.${productIndex}.warrantyCodes.${index}.code`
                                )}
                                defaultValue={
                                  (warranty?.warrantyCodes?.length &&
                                    warranty?.warrantyCodes[index]?.code) ||
                                  ""
                                }
                                id={`quantity-${productIndex}-${index}`}
                                placeholder="Enter code"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p>This product has not warranty!</p>
                  )}
                </div>
              );
            }
          )}
          <div className="flex items-center justify-center mt-6">
            <Button onClick={handleOpen} className="w-[200px]">
              Done
            </Button>
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default WarrantyCodes;
