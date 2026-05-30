import { Card } from "@/components/ui/card";
import { requireBlogAccess } from "../_components/blog-qna/BlogAccessGate";
import QnaManager from "../_components/blog-qna/QnaManager";

export default async function QnaPage() {
  await requireBlogAccess();

  return (
    <Card className="m-2 sm:m-4">
      <QnaManager />
    </Card>
  );
}
