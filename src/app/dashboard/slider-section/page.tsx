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
    <div className="flex gap-4 mb-16">
      <div className="flex-1 m-4 mr-0">
        <Card className="w-full">
          <SectionTitle>Slider Banner Set Up</SectionTitle>
          <AddSlider />
        </Card>
      </div>

      <div className="flex-1 m-4 ml-0">
        <Card className="w-full">
          <SectionTitle>Slider Banner Set Up</SectionTitle>
          <SliderMediaTable slider={data} />
        </Card>
      </div>
    </div>
  );
};

export default SliderSection;
