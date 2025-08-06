import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Slider from "react-slick";
import VerificationService from "../../../utils/repositories/verificationRepository";
import Spinner from "../../../components/Spinner";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VerifyConfirmationModal from "../../../components/VerifyConfirmationModal";
import ImageModal from "../../../components/ImageModal";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { useToast } from "../../../components/Toast";

interface VerificationDetail {
  user_id: string;
  name: string;
  req_status: string;
  social_platforms: Record<string, string>;
  proof_images: string[];
  is_verified: boolean;
}
interface FetchError {
  message: string;
}

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      className="absolute right-1 top-1/2 transform -translate-y-1/2 hover:scale-105 transition bg-white text-black p-1 rounded-full z-10"
      onClick={onClick}
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
      className="absolute left-1 top-1/2 transform -translate-y-1/2 hover:scale-105 transition bg-white text-black p-1 rounded-full z-10"
      onClick={onClick}
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
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
};

const DetailsPage: React.FC = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [details, setDetails] = useState<VerificationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const userName = location.state?.name || "User";

  useEffect(() => {
    const fetchDetails = async () => {
      if (!user_id) {
        setError("User ID is undefined");
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error: fetchError } =
        await VerificationService.getVerificationRequestById(user_id);

      if (fetchError) {
        setError(
          typeof fetchError === "string"
            ? fetchError
            : (fetchError as FetchError).message || "An error occurred",
        );
      } else {
        setDetails({
          ...data,
          proof_images: Array.isArray(data.proof_images)
            ? data.proof_images
            : JSON.parse(data.proof_images || "[]"),
        });
      }
      setLoading(false);
    };

    fetchDetails();
  }, [user_id]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleVerificationConfirm = async (isVerified: boolean) => {
    if (details && user_id) {
      const { error } = await VerificationService.updateVerificationStatus(
        user_id,
        isVerified,
      );

      if (error) {
        setError(
          typeof error === "string"
            ? error
            : (error as FetchError).message ||
                "An error occurred while verifying.",
        );
      } else {
        setDetails((prevDetails) =>
          prevDetails ? { ...prevDetails, is_verified: isVerified } : null,
        );
      }
    }
    setIsConfirmationModalOpen(false);
    showToast("Artist Verified successfully", "info");
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    autoplay: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (next: number) => setSelectedImageIndex(next),
  };

  const getButtonClass = (platform: string) => {
    const isActive =
      Object.keys(details?.social_platforms || [])[selectedImageIndex] ===
      platform;
    const baseClasses =
      "w-full flex items-center gap-2 text-start px-4 py-2 rounded capitalize transition-transform transform hover:scale-95";
    if (isActive) {
      if (platform.toLowerCase() === "linkedin") {
        return `${baseClasses} bg-light text-black border border-blue-800`;
      }
      if (platform.toLowerCase() === "instagram") {
        return `${baseClasses} bg-light text-black border border-purple-700`;
      }
    }
    return `${baseClasses} bg-light text-black`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 bg-light mt-20 rounded-lg mx-6 p-2">
        <h1 className="text-lg font-bold">Verification Details</h1>
        <button
          onClick={() => navigate("/verifications")}
          className="bg-light text-black py-1 px-6 rounded transition-transform transform hover:scale-105"
        >
          Back
        </button>
      </div>
      <div className="mx-6 p-2 bg-light rounded-lg shadow-lg mt-4 mb-8">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <Slider {...sliderSettings}>
              {details?.proof_images.map((image, index) => (
                <div key={index} onClick={() => handleImageClick(index)}>
                  <img
                    src={image}
                    alt={`Proof ${index + 1}`}
                    className="w-full h-80 cursor-pointer"
                  />
                </div>
              ))}
            </Slider>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="mt-2">
              <label className="font-semibold">Social Media Platforms:</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {details?.social_platforms &&
                  Object.entries(details.social_platforms).map(
                    ([platform, url]) => (
                      <button
                        key={platform}
                        onClick={() => window.open(url, "_blank")}
                        className={getButtonClass(platform)}
                      >
                        {/* Display icon based on the platform */}
                        {platform.toLowerCase() === "instagram" && (
                          <FaInstagram />
                        )}
                        {platform.toLowerCase() === "linkedin" && (
                          <FaLinkedin />
                        )}
                        <span>{platform}</span>
                      </button>
                    ),
                  )}
              </div>
            </div>

            <div className="mt-2 flex justify-between">
              <label className="font-semibold">Verification:</label>
            </div>
            <div className="flex gap-2 mt-2 w-full">
              <button
                className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group flex-1"
                onClick={() => {
                  setIsConfirmationModalOpen(true);
                  setIsVerifying(true);
                }}
              >
                <span className="relative text-base font-semibold">Verify</span>
              </button>

              <button
                className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group flex-1"
                onClick={() => {
                  setIsConfirmationModalOpen(true);
                  setIsVerifying(false);
                }}
              >
                <span className="relative text-base font-semibold">Reject</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        images={details?.proof_images || []}
        selectedImageIndex={selectedImageIndex}
        onClose={() => setIsModalOpen(false)}
      />

      <VerifyConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={() => handleVerificationConfirm(isVerifying)}
        userName={userName}
      />
    </div>
  );
};

export default DetailsPage;
