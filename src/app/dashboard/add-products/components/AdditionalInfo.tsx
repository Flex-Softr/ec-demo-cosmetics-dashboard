"use client";
import dynamic from "next/dynamic";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { setAdditionalInfo } from "@/redux/features/addProduct/addProductSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// Dynamically import JoditEditor without SSR
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false, // Disable SSR
});

const AdditionalInfo = () => {
  const dispatch = useAppDispatch();
  const additionalInfo = useAppSelector(
    ({ addProduct }) => addProduct.additionalInfo
  );

  const handleChange = (data: string) => {
    dispatch(setAdditionalInfo(data));
  };

  return (
    <SectionContentWrapper heading={"Product Additional Info"}>
      <JoditEditor
        value={additionalInfo}
        onChange={(newContent: string) => handleChange(newContent)}
      />
    </SectionContentWrapper>
  );
};

export default AdditionalInfo;
