import { Settings } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { TCategories } from "./CategoryTable";

const NavigateSubCategory = ({ category }: { category: TCategories }) => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <div className="lowercase ml-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{category?.subcategories?.length}</TooltipTrigger>
            <TooltipContent>
              <p className="text-white">
                {" "}
                <span className="">{category?.subcategories?.length}</span> Sub
                Categories
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Settings
        onClick={() =>
          router.push(
            `/dashboard/category/${category.name.replace(/ /g, "-")}/${category._id}`
          )
        }
        className="w-5 h-5 text-primary cursor-pointer"
      />
    </div>
  );
};

export default NavigateSubCategory;
