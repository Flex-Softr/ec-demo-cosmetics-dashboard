import { productStatus, stockStatus } from "@/const/products";
import * as Yup from "yup";

const PriceValidationSchema = Yup.object().shape({
  regularPrice: Yup.number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .min(1, "Price is required")
    .typeError("Price must be a valid number")
    .required("Price is required"),
  salePrice: Yup.number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .min(0, "Sale price cannot be negative")
    .typeError("Must be a valid number"),
  discountPercent: Yup.number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .min(0, "Discount percent cannot be negative")
    .typeError("Must be a valid number"),
});

const ImageValidationSchema = Yup.object().shape({
  thumbnail: Yup.string().required("Thumbnail image is required"),
  gallery: Yup.array()
    .min(1, "Image gallery is required")
    .required("Image gallery is required"),
});

const InventoryValidationSchema = Yup.object().shape({
  stockStatus: Yup.string()
    .oneOf(stockStatus, "Invalid stock status")
    .required("Stock status is required"),
  stockQuantity: Yup.number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .typeError("Must be a valid number")
    .optional(),
  stockAvailable: Yup.number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .typeError("Must be a valid number")
    .optional(),
  preStockQuantity: Yup.number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .typeError("Must be a valid number")
    .optional(),
  sku: Yup.string().trim().required("SKU is required"),
  // productCode: Yup.string().trim().optional(),
  manageStock: Yup.boolean().optional(),
  lowStockWarning: Yup.number().when("manageStock", {
    is: true,
    then: () =>
      Yup.number()
        .transform((value) => (Number.isNaN(value) ? undefined : value))
        .min(1, "Low stock warning is required")
        .typeError("Low stock warning is required")
        .required("Low stock warning is required")
        .test(
          "is-less-than-stock",
          "Low stock warning cannot be equal or greater than stock quantity",
          function (value) {
            const { stockQuantity } = this.parent;
            return value < stockQuantity;
          }
        ),
    otherwise: () => Yup.number().notRequired(),
  }),
  hideStock: Yup.boolean().optional(),
});

const AttributeSchema = Yup.object().shape({
  label: Yup.string().required("Attribute name is required"),
  value: Yup.string().required("Attribute ID is required"),
  // values: Yup.array().of(Yup.string()), // We handle values in a separate field 'attributeValues' in form state
});

const VariationSchema = Yup.object().shape({
  attributes: Yup.object()
    .test(
      "is-not-empty",
      "Attributes are required",
      (value) => value && Object.keys(value).length > 0
    )
    .required("Attributes are required"),
  price: PriceValidationSchema.required(),
  inventory: InventoryValidationSchema.required(),
  image: Yup.string().optional(), // Is optional in modification but required in payload. Letting it be optional for now to avoid breaking if image missing in state? No, payload says required.
});

const CategorySchema = Yup.object().shape({
  name: Yup.string().required("Category is required"),
  subCategory: Yup.string().optional(),
});

const WarrantyInfoSchema = Yup.object().shape({
  duration: Yup.object()
    .shape({
      quantity: Yup.string().required("Enter and select Warranty duration!"),
      unit: Yup.string().required("Enter and select Warranty duration!"),
    })
    .required(),
  terms: Yup.string().optional(),
});

const PublishedStatusSchema = Yup.string()
  .oneOf(Object.values(productStatus), "Invalid status")
  .required("Status is required");

const ProductSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  slug: Yup.string().trim().required("Slug is required"),
  description: Yup.string().trim().optional(),
  type: Yup.string().optional(),
  image: ImageValidationSchema.required(),
  price: Yup.object().when("type", {
    is: "variable",
    then: () => Yup.object().optional(),
    otherwise: () => PriceValidationSchema.required(),
  }),
  inventory: Yup.object().when("type", {
    is: "variable",
    then: () => Yup.object().optional(),
    otherwise: () => InventoryValidationSchema.required(),
  }),
  attributes: Yup.array().of(AttributeSchema).optional(),
  variations: Yup.array().when("type", {
    is: "variable",
    then: () =>
      Yup.array()
        .of(VariationSchema)
        .required("Variations are required for variable products"),
    otherwise: () => Yup.array().of(VariationSchema).optional(),
  }),
  brand: Yup.string().optional(),
  category: CategorySchema.required(),
  productCollection: Yup.string().trim().optional(),
  featured: Yup.boolean().optional(),
  warranty: Yup.boolean().required(),
  warrantyInfo: Yup.object().when("warranty", {
    is: true,
    then: () => WarrantyInfoSchema.required(),
    otherwise: (schema) => schema.optional(),
  }),
  publishedStatus: PublishedStatusSchema.required(),
});

export default ProductSchema;
