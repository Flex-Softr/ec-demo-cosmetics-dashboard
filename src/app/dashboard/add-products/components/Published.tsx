"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { resetProduct } from "@/redux/features/addProduct/addProductSlice";
import { TPublishedStatus } from "@/redux/features/addProduct/interface";
import {
  setDefaultSelectedAttributeValue,
  setDefaultVariation,
  setGeneratedVariations,
  setSelectedAttribute,
} from "@/redux/features/addProduct/variation/variationSlice";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/redux/features/allProducts/allProductsApi";
import {
  setDeleteImage,
  setGallery,
  setThumbnail,
} from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import modifiedVariations from "../lib/modifiedVariations";
import ProductSchema from "../lib/productValidation";

const Published = ({ productId }: { productId: string }) => {
  const dispatch = useAppDispatch();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdateLoading }] =
    useUpdateProductMutation();
  const publishedStatus = useAppSelector(
    ({ addProduct }) => addProduct.publishedStatus
  );
  const product = useAppSelector(({ addProduct }) => addProduct);
  const productData = { ...product };
  const image = useAppSelector(({ imageSelector }) => imageSelector);
  const { variations, selectedAttributeValue, selectedAttribute } =
    useAppSelector(({ productVariation }) => productVariation);

  const { register, handleSubmit } = useForm<TPublishedStatus>();

  const onSubmit: SubmitHandler<TPublishedStatus> = async (data) => {
    productData.attributes = selectedAttributeValue.map(({ value, child }) => ({
      name: value as string,
      values: child.map(({ value }) => value as string),
    }));
    productData.image = image;
    productData.variations = modifiedVariations(variations, product);
    productData.publishedStatus = data;

    try {
      if (productId) {
        const validatedData = await ProductSchema.validate(productData, {
          abortEarly: false,
        });
        if (selectedAttribute.length !== selectedAttributeValue.length) {
          throw new Error("Attribute value is required");
        }

        const res = await updateProduct({
          id: productId,
          payload: validatedData,
        }).unwrap();

        // dispatch(resetProduct())
        toast({
          className: "bg-success text-white text-2xl",
          title: res.message,
        });
      } else {
        const validatedData = await ProductSchema.validate(productData, {
          abortEarly: false,
        });
        if (selectedAttribute.length !== selectedAttributeValue.length) {
          throw new Error("Attribute value is required");
        }

        const res = await createProduct(validatedData).unwrap();

        toast({
          className: "bg-success text-white text-2xl",
          title: res.message,
        });
        dispatch(resetProduct());
        dispatch(setThumbnail(""));
        dispatch(setGallery([]));
        dispatch(setDeleteImage([]));
        dispatch(setDefaultSelectedAttributeValue([]));
        dispatch(setDefaultVariation([]));
        dispatch(setGeneratedVariations([]));
        dispatch(setSelectedAttribute([]));
        // router.push("/dashboard/products")
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let errors = [];
      if (err.errors) {
        errors = err.errors;
      } else {
        const e =
          err?.data?.errorMessages && err?.data?.errorMessages[0]?.message;
        errors.push(err.message || e);
      }
      toast({
        className: "bg-red-600 text-white text-2xl",
        title: errors[0],
      });
    }
  };

  return (
    <>
      <SectionContentWrapper heading="Published" className="text-center">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex items-center justify-evenly gap-10">
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                defaultValue={publishedStatus.status}
                {...register("status")}
                id="status"
                className="border h-9 border-primary outline-primary rounded-md min-w-[100px] xl:w-[120px] px-2"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="visibility">Visibility</Label>
              <select
                defaultValue={publishedStatus.visibility}
                {...register("visibility")}
                id="visibility"
                className="border h-9 border-primary outline-primary w-[100px] px-2 rounded-md"
              >
                <option value="Public">Public</option>
                {/* <option value="Password protected">Password protected</option> */}
                <option value="Private">Private</option>
              </select>
            </div>
          </div>
          {/* <div className="flex items-center justify-evenly gap-4">
            <Label htmlFor="date">Published on :</Label>
            <input
              type="date"
              defaultValue={publishedStatus.date}
              {...register("date")}
              id="date"
              className="border h-9 border-gray-300  rounded-sm w-[125px]"
            />
          </div> */}
          <div className="flex gap-4 items-center justify-center">
            <Button disabled={isLoading || isUpdateLoading}>
              {productId ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </SectionContentWrapper>
    </>
  );
};

export default Published;
