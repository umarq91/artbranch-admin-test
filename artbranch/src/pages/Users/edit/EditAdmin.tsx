import { useParams, useNavigate } from "react-router-dom";
import useEditAdmin from "./useEditAdmin";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const EditAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    adminData,
    loading,
    error,
    formValues,
    formErrors,
    handleChange,
    handleSubmit,
    showPassword,
    togglePasswordVisibility,
  } = useEditAdmin(id || "");

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      {/* Top Bar */}
      <div className="flex justify-between items-center mt-20 bg-light px-4 py-3 rounded-2xl shadow-md mx-4 font-poppins z-20 mb-4">
        <p className="text-lg font-semibold mb-0">Edit Admin</p>
        <button
          onClick={() => navigate("/admins")}
          className="bg-light text-black px-4 py-1 rounded-md text-sm transition-transform transform hover:scale-105"
        >
          Back
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-12 gap-6 bg-light px-4 py-3 rounded-2xl shadow-md mx-4 font-poppins z-20"
      >
        {/* Email */}
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            disabled
            value={adminData?.email || ""}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-[13px] bg-light"
            placeholder="Enter your email"
          />
        </div>

        {/* Current Password */}
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-2 font-semibold">Current Password</label>
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
              onClick={() => togglePasswordVisibility("currentPassword")}
            >
              {showPassword.currentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {formErrors.currentPassword && (
            <p className="text-red-500 text-sm">{formErrors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-2 font-semibold">New Password</label>
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
            <p className="text-red-500 text-sm">{formErrors.newPassword}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-2 font-semibold">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPassword.confirmNewPassword ? "text" : "password"}
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
              onClick={() => togglePasswordVisibility("confirmNewPassword")}
            >
              {showPassword.confirmNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {formErrors.confirmNewPassword && (
            <p className="text-red-500 text-sm">
              {formErrors.confirmNewPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="col-span-12 justify-center flex items-center gap-3">
          <button
            type="submit"
            className="bg-light text-black px-4 py-2 rounded-md transition-transform transform hover:scale-105"
          >
            Submit
          </button>
          <button
            type="button"
            className="bg-light text-black px-4 py-2 rounded-md transition-transform transform hover:scale-105"
            onClick={() => navigate("/admins")}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default EditAdmin;
