import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { ImageIcon } from "lucide-react";
import AddSlider from "./components/AddSlider";
import SliderMediaTable from "./components/SliderMediaTable";

const SliderSection = () => {
  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Slider Config"
        subtitle="Manage homepage slider banners"
        icon={ImageIcon}
        actions={<AddSlider />}
      />
      <ContentCard>
        <SliderMediaTable />
      </ContentCard>
    </div>
  );
};

export default SliderSection;
