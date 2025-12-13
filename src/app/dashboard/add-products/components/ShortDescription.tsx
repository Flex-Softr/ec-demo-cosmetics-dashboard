"use client";
import dynamic from "next/dynamic";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { setShortDescription } from "@/redux/features/addProduct/addProductSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// Dynamically import JoditEditor without SSR
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false, // Disable SSR
});
const ShortDescription = () => {
  const dispatch = useAppDispatch();
  const shortDescription = useAppSelector(
    ({ addProduct }) => addProduct.shortDescription
  );

  const handleChange = (data: string) => {
    dispatch(setShortDescription(data));
  };

  return (
    <SectionContentWrapper heading={"Product Short Description"}>
      <JoditEditor
        value={shortDescription}
        onChange={(newContent: string) => handleChange(newContent)}
      />
    </SectionContentWrapper>
  );
};

export default ShortDescription;

// "use client";
// import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
// import { setShortDescription } from "@/redux/features/addProduct/addProductSlice";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { Textarea } from "@/components/ui/textarea";

// const ShortDescription = () => {
//   const dispatch = useAppDispatch();
//   const shortDescription = useAppSelector(
//     ({ addProduct }) => addProduct.shortDescription
//   );

//   const handleChange = (e: { target: { name: string; value: unknown } }) => {
//     const { value } = e.target;
//     dispatch(setShortDescription(value as string));
//   };

//   return (
//     <SectionContentWrapper heading={"Product Short Description"}>
//       <Textarea
//         placeholder="Type product short description..."
//         name="description"
//         onChange={handleChange}
//         value={shortDescription}
//         id="description"
//         className="min-h-10 border border-primary focus-visible:ring-primary"
//       />
//     </SectionContentWrapper>
//   );
// };

// export default ShortDescription;
