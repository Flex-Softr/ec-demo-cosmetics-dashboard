import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/sectionTitle";
import { Pagination } from "@/components/ui/pagination";
import AddSubCategoryForm from "./components/AddSubCategoryForm";
import { CategoryTable } from "./components/SubCategoryTable";
import fetchData from "@/utilities/fetchData";

const SubCategory = async ({
  params,
}: {
  params: { subcategory: string[] };
}) => {
  const categoryName = params?.subcategory[0].replace(/-/g, " ");
  const category = params?.subcategory[1];

  const { data } = await fetchData({
    endPoint: `/sub-categories/${category}`,
    tags: ["subcategories"],
  });

  return (
    <div className="flex gap-4 justify-between items-start h-screen ">
      <Card className="p-4 flex-1 space-y-4">
        <SectionTitle>
          {" "}
          Add New Sub Category for{" "}
          <span className="text-primary">{categoryName}</span>{" "}
        </SectionTitle>
        <AddSubCategoryForm category={category} />
      </Card>
      <Card className="p-4 flex-1">
        <SectionTitle>
          {" "}
          Sub Categories of <span className="text-primary">
            {categoryName}
          </span>{" "}
        </SectionTitle>

        <div>
          <CategoryTable categories={data} />
          <Pagination />
        </div>
      </Card>
    </div>
  );
};

export default SubCategory;
