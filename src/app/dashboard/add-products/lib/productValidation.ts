import * as Yup from "yup";

const PriceValidationSchema = Yup.object().shape({
  regularPrice: Yup.number()
    .min(1, "Price is required")
    .typeError("Price is required")
    .required(),
  salePrice: Yup.number().min(0, "Sale price cannot be negative"),
  discountPercent: Yup.number().min(0, "Discount percent cannot be negative"),
});

const ImageValidationSchema = Yup.object().shape({
  thumbnail: Yup.string().required("Thumbnail image is required"),
  gallery: Yup.array().min(1, "Gallery images is required").required(),
});

const InventoryValidationSchema = Yup.object().shape({
  stockStatus: Yup.string().required("Stock status is required"),
  // stockQuantity: Yup.number()
  //   .min(1, "Stock quantity is required")
  //   .typeError("Stock quantity is required")
  //   .required(),
  // stockQuantity: Yup.number()
  //   .transform((value, originalValue) => (originalValue === "" ? 0 : value))
  //   .default(0)
  //   .test(
  //     "is-less-than-quantity",
  //     "Stock quantity cannot less than existing quantity!",
  //     function (value) {
  //       const { preStockQuantity } = this.parent;
  //       return value >= preStockQuantity;
  //     }
  //   ),
  stockQuantity: Yup.number().default(0),
  stockAvailable: Yup.number().optional(),
  preStockQuantity: Yup.number().optional(),
  sku: Yup.string().trim().required("SKU is required"),
  // productCode: Yup.string().trim().optional(),
  manageStock: Yup.boolean().optional(),
  lowStockWarning: Yup.number().when("manageStock", {
    is: true,
    then: () =>
      Yup.number()
        .min(1, "Low stock warning is required")
        .typeError("Low stock warning is required")
        .required()
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
  name: Yup.string().optional(),
  values: Yup.string().when("name", {
    is: true,
    then: () => Yup.array().min(1, "Attribute value is required").required(),
    otherwise: () => Yup.array().notRequired(),
  }),
});

const VariationSchema = Yup.object().shape({
  attributes: Yup.object().required("Attributes are required"),
  price: PriceValidationSchema.required(),
  inventory: InventoryValidationSchema.required(),
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

const PublishedStatusSchema = Yup.object().shape({
  status: Yup.string().required("Status is required"),
  visibility: Yup.string().required("Visibility is required"),
  // date: Yup.string().required("Published date is required!"),
});

const ProductSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().trim().optional(),
  image: ImageValidationSchema.required(),
  price: PriceValidationSchema.required(),
  inventory: InventoryValidationSchema.required(),
  attributes: Yup.array().of(AttributeSchema).optional(),
  variations: Yup.array().of(VariationSchema).optional(),
  brand: Yup.string().optional(),
  category: CategorySchema.required(),
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
