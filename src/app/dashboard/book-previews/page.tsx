import { Card } from "@/components/ui/card";
import BookPreviewManager from "@/components/book-preview/BookPreviewManager";

export const metadata = {
  title: "Book Previews",
  description: "Book Previews",
};

const Page = () => {
  return (
    <Card className="flex flex-col gap-4 m-2 sm:m-4 p-4">
      <BookPreviewManager />
    </Card>
  );
};

export default Page;
