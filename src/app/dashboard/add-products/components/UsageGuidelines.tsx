"use client";
import dynamic from "next/dynamic";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { setUsageGuidelines } from "@/redux/features/addProduct/addProductSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// Dynamically import JoditEditor without SSR
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false, // Disable SSR
});

const UsageGuidelines = () => {
  const dispatch = useAppDispatch();
  const usageGuidelines = useAppSelector(
    ({ addProduct }) => addProduct.usageGuidelines
  );

  const handleChange = (data: string) => {
    dispatch(setUsageGuidelines(data));
  };

  return (
    <SectionContentWrapper heading={"Product Usage Guidelines"}>
      <JoditEditor
        value={usageGuidelines}
        onChange={(newContent: string) => handleChange(newContent)}
      />
    </SectionContentWrapper>
  );
};

export default UsageGuidelines;
