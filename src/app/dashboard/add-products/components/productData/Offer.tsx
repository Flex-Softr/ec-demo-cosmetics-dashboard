// "use client";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { setOffer } from "@/redux/features/addProduct/addProductSlice";
// import { setVariationOffer } from "@/redux/features/addProduct/variation/variationSlice";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { SubmitHandler, useForm } from "react-hook-form";
// import * as yup from "yup";

// const schema = yup.object().shape({
//   flash: yup.boolean().default(false),
//   today: yup.boolean().default(false),
//   featured: yup.boolean().default(false),
// });

// type TFormInput = yup.InferType<typeof schema>;
// type TProps = {
//   isVariation?: boolean;
//   index?: number;
// };

// const Offer = ({ isVariation, index }: TProps) => {
//   const dispatch = useAppDispatch();
//   const { flash, today, featured } = useAppSelector(
//     ({ addProduct, productVariation }) =>
//       isVariation
//         ? productVariation.variations[index || 0]?.offer || {}
//         : addProduct.offer
//   );

//   const { register, handleSubmit } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const onSubmit: SubmitHandler<TFormInput> = (data) => {
//     dispatch(
//       isVariation ? setVariationOffer({ index, ...data }) : setOffer(data)
//     );
//   };

//   return (
//     <form onChange={handleSubmit(onSubmit)}>
//       <div className="flex items-center gap-3 mb-3">
//         <Label className="flex gap-3 w-40" htmlFor="flash">
//           Flash Deal
//           <span title="Lorem Ipsum is simply dummy text.">
//             <i className="fa-solid fa-circle-question">i</i>
//           </span>
//         </Label>
//         <div className="space-y-2">
//           <Input
//             type="checkbox"
//             defaultChecked={flash}
//             {...register("flash")}
//             id="flash"
//           />
//         </div>
//       </div>
//       <div className="flex items-center gap-3 mb-3">
//         <Label className="flex gap-3 w-40" htmlFor="today">
//           Today&apos;s Deal
//           <span title="Lorem Ipsum is simply dummy text.">
//             <i className="fa-solid fa-circle-question">i</i>
//           </span>
//         </Label>
//         <div className="space-y-2">
//           <Input
//             type="checkbox"
//             defaultChecked={today}
//             {...register("today")}
//             id="today"
//           />
//         </div>
//       </div>
//       <div className="flex items-center gap-3 mb-3">
//         <Label className="flex gap-3 w-40" htmlFor="featured">
//           Featured
//           <span title="Lorem Ipsum is simply dummy text.">
//             <i className="fa-solid fa-circle-question">i</i>
//           </span>
//         </Label>
//         <div className="space-y-2">
//           <Input
//             type="checkbox"
//             defaultChecked={featured}
//             {...register("featured")}
//             id="featured"
//           />
//         </div>
//       </div>
//     </form>
//   );
// };

// export default Offer;
