// Import necessary components
import { Card } from "@/components/ui/card";
import AddSlider from "./components/AddSlider";
import SliderMediaTable from "./components/SliderMediaTable";

const SliderSection = () => {
  return (
    <Card className="m-4">
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Slider Banner Set Up</h1>
        <AddSlider />
      </div>
      <hr className="my-4" />
      <div className="w-full">
        <SliderMediaTable />
      </div>
    </Card>
  );
};

export default SliderSection;
