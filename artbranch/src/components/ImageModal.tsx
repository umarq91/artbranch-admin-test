import React from "react";
import Slider from "react-slick";

interface ImageModalProps {
  isOpen: boolean;
  images: string[];
  selectedImageIndex: number;
  onClose: () => void;
}

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 right-4 p-2 text-black bg-white bg-opacity-50 rounded-full z-10 transform -translate-y-1/2 hover:scale-105 transition"
      style={{ right: "20px" }}
      aria-label="Next"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 left-4 p-2 text-bold text-black bg-white rounded-full z-10 transform -translate-y-1/2 hover:scale-105 transition"
      style={{ left: "20px" }}
      aria-label="Previous"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
};

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  images,
  selectedImageIndex,
  onClose,
}) => {
  if (!isOpen) return null;

  const sliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    initialSlide: selectedImageIndex,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 pointer-events-auto">
      <div className="rounded-lg overflow-hidden w-full max-w-2xl mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-4 p-2 text-black transform -translate-y-1/2 hover:scale-105 transition focus:outline-none bg-white rounded-lg z-10"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <Slider {...sliderSettings}>
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Proof ${index + 1}`}
                className="w-full h-96 object-cover"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ImageModal;
