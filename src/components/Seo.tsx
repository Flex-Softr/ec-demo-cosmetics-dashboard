/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import SeoFields from "./SeoFields";
import { useFormContext } from "react-hook-form";

// Hook-based SEO component for react-hook-form
export const SeoHook = () => {
  const { watch, setValue, formState } = useFormContext();
  const { errors } = formState;

  const values = {
    metaTitle: watch("metaTitle"),
    keywords: watch("keywords"),
    canonicalUrl: watch("canonicalUrl"),
    metaDescription: watch("metaDescription"),
    schemaMarkup: watch("schemaMarkup"),
  };

  const handleChange = (key: string | any, value: string) => {
    setValue(key, value, { shouldValidate: true });
  };

  return <SeoFields values={values} onChange={handleChange} errors={errors} />;
};

// Controlled SEO component for local state forms (Blog/QnA)
export const SeoControlled = ({
  values,
  onChange,
}: {
  values: any;
  onChange: any;
}) => {
  return <SeoFields values={values} onChange={onChange} />;
};

export default SeoFields;
