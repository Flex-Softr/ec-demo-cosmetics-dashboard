import { useUploadImageMutation } from "@/redux/features/imageSelector/imageApi";
import { useToast } from "@/components/ui/use-toast";
import { Cross2Icon } from "@radix-ui/react-icons";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Button } from "../ui/button";

const UploadFile = () => {
  const { toast } = useToast();
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  // const [images, setImages] = useState(""); // for single
  const [images, setImages] = useState<File[]>([]);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // const files = e.target.files[0]; // for single image
      const fileList = Array.from(files);
      setImages([...images, ...fileList]);
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setImages([...images, ...files]);
  };

  const removeImage = (index: number) => {
    const updatedFiles = [...images];
    updatedFiles.splice(index, 1);
    setImages(updatedFiles);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      // formData.append(`images`, images); // for single
      images.forEach((image) => {
        formData.append(`images`, image);
      });
      const res = await uploadImage(formData).unwrap();
      if (!res.error) {
        setImages([]);
      }
      toast({
        className: "bg-success text-white text-2xl",
        title: "Images uploaded successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: err?.data?.message || "Images upload is failed!",
        description: "There was a problem with your request.",
      });
    }
  };

  return (
    <div className="h-full relative">
      {images.length > 0 ? (
        <div className="h-full flex flex-col gap-4">
          <div
            className="h-full border-2 border-dashed border-gray-300 cursor-pointer p-2"
            onClick={() => document.getElementById("fileInput")?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="flex flex-wrap gap-4">
              {images.map((image, index) => (
                <div key={index} className="w-[150px] h-[150px] relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      removeImage(index);
                    }}
                    className="bg-white absolute right-1 top-1 p-1 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
                  >
                    <Cross2Icon className="h-5 w-5" />
                  </button>
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`Image ${index}`}
                    fill={true}
                    className="object-cover rounded-sm"
                    sizes="(max-width: 208px) 100vw,"
                  />
                </div>
              ))}
            </div>
            <input
              type="file"
              accept="*/*"
              className="hidden"
              onChange={handleFileInputChange}
              id="fileInput"
              multiple
            />
            {/* <Button
              className={`absolute top-2 ${hover ? "block" : "hidden"}`} // Show/hide based on hover state
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                document.getElementById("fileInput")?.click();
              }}
            >
              Select Files
            </Button> */}
          </div>
          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={isLoading}>
              Upload Files
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-col justify-center items-center h-full w-full border-2 border-dashed border-gray-300
         rounded-md cursor-pointer`}
          onClick={() => document.getElementById("fileInput")?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-gray-500">Drag and drop files here</p>
            <input
              type="file"
              accept="*/*"
              className="hidden"
              onChange={handleFileInputChange}
              id="fileInput"
              multiple
            />
            <Button size={"sm"}>Select Files</Button>
            <p>Maximum upload file size: 1 MB.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
