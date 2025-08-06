import { Link } from "react-router-dom"; 
import PictureLayout from "../../components/PictureLayout/PictureLayout";
import useLogin from "./useLogin";
import Leaf from "../../../public/assets/leaf.png";
import Background from "../../../public/assets/background.png";
import Button from "../../components/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignIn = () => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    showPassword,
    togglePasswordVisibility,
    loading,
    step,
    // generatedOtp,
    otpExpiresIn,
    regenerateOTP,
    setStep, 
  } = useLogin();

  const handleGoBack = () => {
    setStep("LOGIN");
  };
  const formatTime = (seconds:any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  return (
    <PictureLayout
      title="Find your place in Australia's largest network of creators"
      backgroundImage={Background}
      decorationImage={Leaf}
    >
      <div>
        <h2 className="mb-8 text-3xl font-bold  ">
          {step === "LOGIN"
            ? "Sign in to access your dashboard"
            : "Enter the OTP"}
        </h2>
        <form onSubmit={handleSubmit}>
          {step === "LOGIN" && (
            <>
              <div className="mb-4">
                <input
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-6"
                  style={{
                    borderColor: "#E6E2DC",
                    height: "84px",
                    padding: "30px 20px",
                  }}
                  placeholder="Email Address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="relative mb-4">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-6"
                  style={{
                    borderColor: "#E6E2DC",
                    height: "84px",
                    padding: "30px 20px",
                  }}
                  placeholder="Password"
                />
                <div
                  className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-6"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEye className="text-gray-600" />
                  ) : (
                    <FaEyeSlash className="text-gray-600" />
                  )}
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
            </>
          )}
         {step === "OTP" && (
  <>
    <Link to="#" onClick={handleGoBack} className="text-black underline">
      Go Back
    </Link>
    <div className="mb-4">
      <label htmlFor="otp" className="block mb-2">One Time Verification</label>
      <input
        id="otp"
        type="text"
        value={values.otp}
        onChange={handleChange}
        className="w-full rounded-lg border p-6"
        style={{
          borderColor: "#E6E2DC",
          height: "84px",
          padding: "30px 20px",
        }}
        placeholder="Enter Your OTP"
      />
      {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
    </div>
    {otpExpiresIn !== null && otpExpiresIn > 0 ? (
  <p className="text-red-500 text-sm mt-2">
    OTP expires in: {formatTime(otpExpiresIn)}
  </p>
) : (
  <p
    onClick={regenerateOTP}
    className="text-blue-500 text-sm mt-2 cursor-pointer underline"
  >
    Resend OTP
  </p>
)}
  </>
)}



          <Button
            title={loading ? "Loading..." : step === "LOGIN" ? "Next" : "Log In"}
            className="mt-4 font-syne w-full rounded-lg bg-[#131114] p-[10px_30px] text-[20px] font-bold leading-[24px] text-[#F5F3EE] hover:bg-gray-800"
            type="submit"
            loading={loading}
            withTransition={true}
          />
        </form>
      </div>
    </PictureLayout>
  );
};

export default SignIn;
