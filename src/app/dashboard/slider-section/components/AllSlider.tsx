import Image from "next/image";

type TSlider = {
  name: string;
  bannerLink: string;
  image: string;
};

type AllSliderProps = {
  sliders: TSlider[];
};

const AllSlider: React.FC<AllSliderProps> = ({ sliders }) => {
  return (
    <div>
      {sliders?.map((slider: TSlider, index: number) => (
        <div key={index}>
          <h3>{slider.name}</h3>
          <Image src={slider.image} alt={slider.name} priority={true} />
          <a href={slider.bannerLink}>Go to banner</a>
        </div>
      ))}
    </div>
  );
};

export default AllSlider;
