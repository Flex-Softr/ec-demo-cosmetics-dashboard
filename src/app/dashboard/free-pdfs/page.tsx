import BookPreviewManager from "@/components/book-preview/BookPreviewManager";
import { SectionTitle } from "@/components/ui/sectionTitle";

const FreePdfsPage = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="mb-4">
        <SectionTitle title="Manage your free PDF files here.">
          Free PDFs
        </SectionTitle>
      </div>
      <div className="flex-1 bg-white p-5 rounded-md shadow-sm h-full overflow-hidden">
        <BookPreviewManager fixedType="free" />
      </div>
    </div>
  );
};

export default FreePdfsPage;
