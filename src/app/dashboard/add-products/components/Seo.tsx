"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { SeoHook } from "@/components/Seo";

const Seo = () => {
  return (
    <SectionContentWrapper heading={"SEO Data"}>
      <SeoHook />
    </SectionContentWrapper>
  );
};

export default Seo;
