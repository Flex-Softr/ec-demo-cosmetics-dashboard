"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setBrand } from "@/redux/features/addProduct/addProductSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

type TBrand = {
  brands: {
    _id: string;
    name: string;
  }[];
};
const Brand = ({ brands }: TBrand) => {
  const dispatch = useAppDispatch();
  const selectedBrand = useAppSelector(({ addProduct }) => addProduct.brand);

  const handleChange = (v: string) => {
    if (v !== "Select brand") {
      dispatch(setBrand(v));
    } else {
      dispatch(setBrand(undefined));
    }
  };

  const defaultValue = brands.find(({ _id, name }) => {
    if (_id == selectedBrand) {
      return name;
    }
  });

  return (
    <SectionContentWrapper heading="Product brand">
      <Select onValueChange={(v) => handleChange(v)}>
        <SelectTrigger className="border-primary focus:ring-primary focus:ring-1">
          <SelectValue placeholder={defaultValue?.name || "Select brand"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="capitalized">
            <SelectItem value="Select brand">Select brand</SelectItem>
            {brands.map(({ _id, name }) => (
              <SelectItem key={_id} value={_id}>
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </SectionContentWrapper>
  );
};

export default Brand;

// <Select onValueChange={(v) => handleChange(v)}>
//   <SelectTrigger className=" border-primary focus:ring-0">
//     <SelectValue placeholder={defaultValue?.name || "Select brand"} />
//   </SelectTrigger>
//   <SelectContent>
//     <SelectGroup>
//       {brands.map(({ _id, name }) => (
//         <SelectItem key={_id} value={_id}>
//           {name}
//         </SelectItem>
//       ))}
//     </SelectGroup>
//   </SelectContent>
// </Select>;
