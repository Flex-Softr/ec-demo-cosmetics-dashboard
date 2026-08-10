import { Settings } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TCategories } from "./CategoryTable";
import Link from "next/link";

const NavigateSubCategory = ({ category }: { category: TCategories }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="lowercase ml-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{category?.children?.length}</TooltipTrigger>
            <TooltipContent>
              <p className="text-white">
                {" "}
                <span className="">{category?.children?.length}</span> Sub
                Categories
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Link href={`/dashboard/category/${category._id}`}>
        <Settings className="w-5 h-5 text-primary cursor-pointer" />
      </Link>
    </div>
  );
};

export default NavigateSubCategory;
