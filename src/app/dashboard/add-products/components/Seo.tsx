"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { SeoHook } from "@/components/Seo";

const Seo = () => {
  return (
    <SectionContentWrapper heading={"SEO Data"} className="mt-6">
      <SeoHook />
    </SectionContentWrapper>
  );
};

export default Seo;
