"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAdvanced } from "@/redux/features/addProduct/addProductSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Textarea } from "@/components/ui/textarea";

const Advanced = () => {
  const dispatch = useAppDispatch();
  const {
    featured,
    warranty,
    warrantyInfo: { duration, terms },
  } = useAppSelector(({ addProduct }) => addProduct);

  const handleCheckedChange = (event: {
    target: { name: string; checked: boolean };
  }) => {
    const { name, checked } = event.target;
    dispatch(setAdvanced({ [name]: checked }));
  };

  const handleChange = (e: { target: { name: string; value: unknown } }) => {
    const { name, value } = e.target;
    dispatch(setAdvanced({ [name]: value }));
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <Label className="w-40" htmlFor="featured">
          Flash sales
        </Label>
        <div>
          <Input
            type="checkbox"
            defaultChecked={featured}
            onChange={handleCheckedChange}
            name="featured"
            id="featured"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <Label className="w-40" htmlFor="warranty">
          Warranty
        </Label>
        <div>
          <Input
            type="checkbox"
            defaultChecked={warranty}
            onChange={handleCheckedChange}
            name="warranty"
            id="warranty"
          />
        </div>
      </div>
      {warranty && (
        <>
          <div className="flex items-center gap-3 mb-3">
            <Label className="w-40" htmlFor="warrantyDuration">
              Warranty duration
            </Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                // {...register("duration")}
                onChange={handleChange}
                defaultValue={duration.quantity}
                name="quantity"
                id="warrantyDuration"
                className="w-14 px-1 text-center"
              />
              <Select
                onValueChange={(v) => {
                  if (v !== "select") {
                    handleChange({ target: { name: "unit", value: v } });
                  }
                }}
                defaultValue={duration.unit}
              >
                <SelectTrigger className="w-[120px] border-primary focus:ring-0">
                  <SelectValue placeholder={"select"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-3">
            <Label className="w-40" htmlFor="terms">
              Terms
            </Label>
            <Textarea
              placeholder="Type warranty terms here."
              name="terms"
              onChange={handleChange}
              defaultValue={terms}
              id="terms"
              className="min-h-10 border border-primary focus-visible:ring-primary"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Advanced;
