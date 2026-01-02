"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useFormContext } from "react-hook-form";

type TCategories = {
  _id: string;
  name: string;
  subcategories?: TCategories[];
};

const CategoryInput = () => {
  const { data, isLoading } = useGetCategoriesQuery({ isActive: true });
  const categories = data?.data || [];

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const categoryName = watch("category.name");
  const subCategoryName = watch("category.subCategory");

  // Toggle Category: Expects single category selection? Or multiple?
  // Previous code used setCategory/setSubcategory, seemingly single.

  const toggleCategory = (categoryId: string) => {
    if (categoryName === categoryId) {
      setValue("category.name", "");
    } else {
      setValue("category.name", categoryId, { shouldValidate: true });
    }
    setValue("category.subCategory", ""); // Reset sub on category change
  };

  const toggleSubcategory = (subCategoryId: string) => {
    if (subCategoryName === subCategoryId) {
      setValue("category.subCategory", "");
    } else {
      setValue("category.subCategory", subCategoryId, { shouldValidate: true });
    }
  };

  const renderCategory = (category: TCategories) => (
    <div key={category._id} className="flex items-center space-x-4">
      {category.subcategories && (
        <div
          onClick={() => toggleCategory(category._id)}
          className="cursor-pointer"
        ></div>
      )}
      <input
        type="checkbox"
        id={category._id as string}
        checked={categoryName == category._id}
        onChange={() => toggleCategory(category._id)}
        className="mr-1 size-4 "
      />
      <label
        htmlFor={category._id as string}
        className={`text-gray-800 ${categoryName == category._id ? "font-bold" : ""}`}
      >
        <span>{category.name}</span>
        {/* <PlusIcon /> */}
      </label>
    </div>
  );
  const renderSubCategory = (category: TCategories) => (
    <div key={category._id} className="flex items-center space-x-4">
      {category.subcategories && (
        <div
          onClick={() => toggleSubcategory(category._id)}
          className="cursor-pointer"
        ></div>
      )}
      <input
        type="checkbox"
        id={category._id as string}
        checked={subCategoryName === category._id}
        onChange={() => toggleSubcategory(category._id)}
        className="mr-1 size-4 "
      />
      <label
        htmlFor={category._id as string}
        className={`text-gray-800  ${subCategoryName === category._id ? "font-bold" : ""}`}
      >
        {category.name}
      </label>
    </div>
  );
  const renderSubcategories = (subcategories: TCategories[]) => (
    <ul className="ml-10 list-none pr-3 ">
      {subcategories?.map((subcategory) => (
        <li className="" key={subcategory._id}>
          {renderSubCategory(subcategory)}
        </li>
      ))}
    </ul>
  );

  const getError = (path: string) => {
    // Access nested errors safely
    const parts = path.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = errors;
    for (const p of parts) {
      if (current?.[p]) current = current[p];
      else return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (current as any)?.message as string | undefined;
  };

  return (
    <SectionContentWrapper heading="Select Category">
      <div className=" max-h-64  overflow-y-scroll ">
        {isLoading ? (
          <p className="p-4 text-center text-gray-500 italic">
            Loading categories...
          </p>
        ) : (
          <ul className="list-none">
            {categories.map((category: TCategories) => (
              <li className="p-2" key={category._id}>
                {renderCategory(category)}
                {categoryName == category._id &&
                  category.subcategories &&
                  renderSubcategories(category.subcategories)}
              </li>
            ))}
          </ul>
        )}
      </div>
      {getError("category.name") && (
        <p className="text-red-500 text-sm mt-2">{getError("category.name")}</p>
      )}
    </SectionContentWrapper>
  );
};

export default CategoryInput;
