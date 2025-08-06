import React from "react";
import {
  FaRegArrowAltCircleRight,
  FaRegArrowAltCircleDown,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useProfile } from "./useProfile";
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../components/Toast";

const Profile: React.FC = () => {
    const { showToast } = useToast();
  
  const { name, email } = useAuth();
  const {
    isPasswordChangeVisible,
    togglePasswordChange,
    formValues,
    setFormValues,
    formErrors,
    handleChange,
    validate,
    togglePasswordVisibility,
    showPassword,
    changePassword,
    loading,
  } = useProfile();

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const message = await changePassword();
    if (message) {
      showToast(message, "info");
      setFormValues({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  };
  return (
    <>
      {/* Top Bar */}
      <div className="flex justify-between items-center mt-20 bg-light px-4 py-3 rounded-2xl shadow-md mx-4 font-poppins z-20 mb-4">
        <p className="text-lg font-semibold mb-0">My Profile</p>
      </div>

      {/* Form */}
      <form className="grid grid-cols-12 gap-6 bg-light px-4 py-6 rounded-2xl shadow-md mx-4 font-poppins z-20">
        {/* Full Name */}
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-2 font-semibold">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={name || ""}
            disabled
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-[13px] bg-light"
            placeholder="Enter full name"
          />
        </div>

        {/* Email */}
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email || ""}
            disabled
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-[13px] bg-light"
            placeholder="Enter Email"
          />
        </div>
      </form>

      {/* Change Password Section */}
      <div className="mt-6 mx-4">
        <div
          className="text-lg font-semibold flex items-center cursor-pointer"
          onClick={togglePasswordChange}
        >
          <span>Change Password</span>
          {isPasswordChangeVisible ? (
            <FaRegArrowAltCircleDown className="ml-2 text-xl" />
          ) : (
            <FaRegArrowAltCircleRight className="ml-2 text-xl" />
          )}
        </div>

        {/* Conditionally render password change form */}
        {isPasswordChangeVisible && (
          <div className="mt-4 p-4 bg-light border border-gray-300 rounded-lg shadow-md mb-4">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-12 gap-6">
                {/* Current Password */}
                <div className="col-span-12 md:col-span-6">
                  <label className="block mb-2 font-semibold">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.currentPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={formValues.currentPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-[13px] bg-light"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() =>
                        togglePasswordVisibility("currentPassword")
                      }
                    >
                      {showPassword.currentPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>
                  </div>
                  {formErrors.currentPassword && (
                    <p className="text-red-500 text-sm">
                      {formErrors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="col-span-12 md:col-span-6">
                  <label className="block mb-2 font-semibold">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.newPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={formValues.newPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-[13px] bg-light"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => togglePasswordVisibility("newPassword")}
                    >
                      {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {formErrors.newPassword && (
                    <p className="text-red-500 text-sm">
                      {formErrors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="col-span-12 md:col-span-6">
                  <label className="block mb-2 font-semibold">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={
                        showPassword.confirmNewPassword ? "text" : "password"
                      }
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      value={formValues.confirmNewPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-[13px] bg-light"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() =>
                        togglePasswordVisibility("confirmNewPassword")
                      }
                    >
                      {showPassword.confirmNewPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>
                  </div>
                  {formErrors.confirmNewPassword && (
                    <p className="text-red-500 text-sm">
                      {formErrors.confirmNewPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-center items-center mt-4">
                <button
                  type="submit"
                  className="bg-light text-black px-4 py-2 rounded-md transition-transform transform hover:scale-105"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;


