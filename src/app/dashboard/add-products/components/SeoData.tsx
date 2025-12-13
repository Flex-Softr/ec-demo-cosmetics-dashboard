// "use client";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { setSeoData } from "@/redux/features/addProduct/addProductSlice";
// import { Textarea } from "@/components/ui/textarea";
// import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// const schema = yup.object().shape({
//   focusKeyphrase: yup.string().default(""),
//   metaTitle: yup.string().default(""),
//   slug: yup.string().default(""),
//   metaDescription: yup.string().default(""),
// });

// type TFormInput = yup.InferType<typeof schema>;
// const SeoData = () => {
//   const dispatch = useAppDispatch();
//   const { focusKeyphrase, metaTitle, slug, metaDescription } = useAppSelector(
//     ({ addProduct }) => addProduct.seoData
//   );

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const onSubmit: SubmitHandler<TFormInput> = (data) => {
//     dispatch(setSeoData(data));
//   };

//   return (
//     <SectionContentWrapper heading={"SEO Data"} className="mt-10">
//       <form onChange={handleSubmit(onSubmit)} className="w-full">
//         <div className="flex items-center gap-3 mb-3 w-full">
//           <Label className="flex gap-3 w-56" htmlFor="focusKeyphrase">
//             Focus key phrase
//             <span title="Lorem Ipsum is simply dummy text.">
//               <i className="fa-solid fa-circle-question">i</i>
//             </span>
//           </Label>
//           <div className="space-y-2 w-full">
//             <Input
//               type="text"
//               defaultValue={focusKeyphrase}
//               {...register("focusKeyphrase")}
//               id="focusKeyphrase"
//               placeholder="Enter focus key phrase"
//             />
//             {errors.focusKeyphrase?.message && (
//               <p className="text-red-600">
//                 {errors.focusKeyphrase?.message as string}
//               </p>
//             )}
//           </div>
//         </div>
//         <div className="flex items-center gap-3 mb-3 w-full">
//           <Label className="flex gap-3 w-56" htmlFor="metaTitle">
//             Meta title
//             <span title="Lorem Ipsum is simply dummy text.">
//               <i className="fa-solid fa-circle-question">i</i>
//             </span>
//           </Label>
//           <div className="space-y-2 w-full">
//             <Input
//               type="text"
//               defaultValue={metaTitle}
//               {...register("metaTitle")}
//               id="metaTitle"
//               placeholder="Enter meta tile"
//             />
//             {errors.metaTitle?.message && (
//               <p className="text-red-600">
//                 {errors.metaTitle?.message as string}
//               </p>
//             )}
//           </div>
//         </div>
//         <div className="flex items-center gap-3 mb-3">
//           <Label className="flex gap-3 w-56" htmlFor="slug">
//             Slug
//             <span title="Lorem Ipsum is simply dummy text.">
//               <i className="fa-solid fa-circle-question">i</i>
//             </span>
//           </Label>
//           <div className="space-y-2 w-full">
//             <Input
//               type="text"
//               defaultValue={slug}
//               {...register("slug")}
//               id="slug"
//               placeholder="Enter meta tile"
//             />
//             {errors.slug?.message && (
//               <p className="text-red-600">{errors.slug?.message as string}</p>
//             )}
//           </div>
//         </div>
//         <div className="flex items-center gap-3 mb-3">
//           <Label className="flex gap-3 w-56" htmlFor="metaDescription">
//             Meta description
//             <span title="Lorem Ipsum is simply dummy text.">
//               <i className="fa-solid fa-circle-question">i</i>
//             </span>
//           </Label>
//           <div className="space-y-2 w-full">
//             <Textarea
//               defaultValue={metaDescription}
//               {...register("metaDescription")}
//               id="metaDescription"
//               placeholder="Enter meta description"
//             />
//             {errors.metaDescription?.message && (
//               <p className="text-red-600">
//                 {errors.metaDescription?.message as string}
//               </p>
//             )}
//           </div>
//         </div>
//       </form>
//     </SectionContentWrapper>
//   );
// };

// export default SeoData;
