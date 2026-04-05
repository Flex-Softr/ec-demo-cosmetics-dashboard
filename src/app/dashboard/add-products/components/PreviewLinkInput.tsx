"use client";
import { useState } from "react";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FileTextIcon } from "@radix-ui/react-icons";
import CommonModal from "@/components/modal/CommonModal";
import BookPreviewManager from "@/components/book-preview/BookPreviewManager";

const PreviewLinkInput = () => {
  const [open, setOpen] = useState(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <SectionContentWrapper heading={"Product Preview Link (Optional)"}>
      <div>
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com/preview"
            {...register("previewLink")}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            className="flex gap-2"
            onClick={() => setOpen(true)}
          >
            <FileTextIcon className="h-4 w-4" />
            Library
          </Button>
        </div>
        {errors.previewLink && (
          <p className="text-red-500 text-sm mt-1">
            {errors.previewLink.message as string}
          </p>
        )}
      </div>

      <CommonModal
        open={open}
        handleOpen={setOpen}
        modalTitle="Book Preview Manager"
        className="w-[95%] h-[90%]"
      >
        <div className="p-1 max-h-[75vh] overflow-y-auto">
          <BookPreviewManager />
        </div>
      </CommonModal>
    </SectionContentWrapper>
  );
};

export default PreviewLinkInput;
