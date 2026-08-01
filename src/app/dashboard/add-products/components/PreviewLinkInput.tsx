"use client";

import BookPreviewManager from "@/components/book-preview/BookPreviewManager";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FileTextIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const PreviewLinkInput = () => {
  const [open, setOpen] = useState(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="hidden">
      <SectionContentWrapper heading={"Product Preview Link (Optional)"}>
        <div>
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/preview"
              {...register("previewLink")}
              className="flex-1 rounded-lg"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg gap-1.5"
              onClick={() => setOpen(true)}
            >
              <FileTextIcon className="h-4 w-4" />
              Library
            </Button>
          </div>
          {errors.previewLink && (
            <p className="mt-1 text-sm text-destructive">
              {errors.previewLink.message as string}
            </p>
          )}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
            <DialogHeader>
              <DialogTitle>Book Preview Manager</DialogTitle>
              <DialogDescription>
                Choose or manage book preview files for this product.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto p-1">
              <BookPreviewManager />
            </div>
          </DialogContent>
        </Dialog>
      </SectionContentWrapper>
    </div>
  );
};

export default PreviewLinkInput;
