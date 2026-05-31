/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type SeoValues = {
  metaTitle?: string;
  keywords?: string;
  canonicalUrl?: string;
  metaDescription?: string;
  schemaMarkup?: string;
};

type Props = {
  values: SeoValues;
  onChange: (key: keyof SeoValues | string, value: string) => void;
  errors?: any;
};

const SeoFields = ({ values, onChange, errors }: Props) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3 w-full">
        <Label className="flex gap-3 w-56">Meta title</Label>
        <div className="w-full">
          <Input
            placeholder="Meta title"
            value={values.metaTitle || ""}
            onChange={(e) => onChange("metaTitle", e.target.value)}
          />
          {errors?.metaTitle && (
            <p className="text-red-600">{(errors.metaTitle as any).message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 w-full">
        <Label className="flex gap-3 w-56">Keywords</Label>
        <div className="w-full">
          <Input
            placeholder="Keywords, comma separated"
            value={values.keywords || ""}
            onChange={(e) => onChange("keywords", e.target.value)}
          />
          {errors?.keywords && (
            <p className="text-red-600">{(errors.keywords as any).message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 w-full">
        <Label className="flex gap-3 w-56">Canonical URL</Label>
        <div className="w-full">
          <Input
            placeholder="Canonical URL (e.g. https://example.com/product-slug)"
            value={values.canonicalUrl || ""}
            onChange={(e) => onChange("canonicalUrl", e.target.value)}
          />
          {errors?.canonicalUrl && (
            <p className="text-red-600">
              {(errors.canonicalUrl as any).message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3 w-full">
        <Label className="flex gap-3 w-56">Meta description</Label>
        <div className="w-full">
          <Textarea
            placeholder="Meta description"
            value={values.metaDescription || ""}
            onChange={(e) => onChange("metaDescription", e.target.value)}
          />
          {errors?.metaDescription && (
            <p className="text-red-600">
              {(errors.metaDescription as any).message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3 w-full">
        <Label className="flex gap-3 w-56">Schema markup</Label>
        <div className="w-full">
          <Textarea
            placeholder="Schema markup"
            value={values.schemaMarkup || ""}
            onChange={(e) => onChange("schemaMarkup", e.target.value)}
          />
          {errors?.schemaMarkup && (
            <p className="text-red-600">
              {(errors.schemaMarkup as any).message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeoFields;
