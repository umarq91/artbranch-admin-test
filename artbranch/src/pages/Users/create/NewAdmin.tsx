import { FaEye, FaEyeSlash } from "react-icons/fa";
import useNewAdmin from "./useNewAdmin";
import { useNavigate } from "react-router-dom";

const NewAdmin = () => {
  const {
    values,
    errors,
    showPassword,
    togglePasswordVisibility,
    handleChange,
    validate,
  } = useNewAdmin();
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    console.log("Form submitte with values:", values);
    // LOGIC TO CERATE AN ADMIN
  };

  return (
    <>
      <div className="flex justify-between items-center mt-20 bg-light px-4 py-3 rounded-2xl shadow-md mx-4 font-poppins z-20 mb-4">
        <p className="text-lg font-semibold mb-0">Admin</p>
        <button
          onClick={() => navigate("/admins")}
          className="bg-light text-black px-4 py-1 rounded-md text-sm transition-transform transform hover:scale-105"
        >
          Back
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-12 gap-6 bg-light px-4 py-3 rounded-2xl shadow-md mx-4 font-poppins z-20"
      >
        {/* Full Name */}
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-2 font-semibold">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-[13px] bg-light"
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName}</p>
          )}
        </div>

        {/* Username */}
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-2 font-semibold">Username</label>
          <input
            type="text"
            name="username"
            value={values.username}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-[13px] bg-light"
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>

        {/* Password */}
        <div className="col-span-12 md:col-span-6 relative">
          <label className="block mb-2 font-semibold">Password</label>
          <div className="flex items-center">
            <input
              type={showPassword.password ? "text" : "password"}
              name="password"
              value={values.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-[13px] bg-light"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("password")}
              className="absolute right-3"
            >
              {showPassword.password ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <div className="col-span-12 md:col-span-6 relative">
          <label className="block mb-2 font-semibold">Confirm Password</label>
          <div className="flex items-center">
            <input
              type={showPassword.confirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-[13px] bg-light"
              placeholder="Enter your confirm password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirmPassword")}
              className="absolute right-3"
            >
              {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="col-span-12 justify-center flex items-center gap-3">
          <button
            type="submit"
            className="bg-light text-black px-4 py-2 rounded-md transition-transform transform hover:scale-105"
          >
            Add
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

export default NewAdmin;
