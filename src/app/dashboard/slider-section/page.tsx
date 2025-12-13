// Import necessary components
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/sectionTitle";
import fetchData from "@/utilities/fetchData";
import AddSlider from "./components/AddSlider";
import SliderMediaTable from "./components/SliderMediaTable";

const SliderSection = async () => {
  const { data } = await fetchData({
    endPoint: "/slider-banner/",
    tags: ["sliders"],
  });

  return (
    <div className=" w-full flex gap-5 h-screen">
      <div className="flex-1 p-3">
        <Card className="p-4 w-full">
          <SectionTitle>Slider Banner Set Up</SectionTitle>
          <AddSlider />
        </Card>
      </div>
      <div className="flex-1">
        <div className="flex-1 p-3">
          <Card className="p-4 w-full">
            <SectionTitle>Slider Banner Set Up</SectionTitle>

            <SliderMediaTable slider={data} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SliderSection;
