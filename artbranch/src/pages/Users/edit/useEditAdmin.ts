import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../../utils/repositories/adminsRepository";
import { useToast } from "../../../components/Toast";

type ShowPassword = {
  currentPassword: boolean;
  newPassword: boolean;
  confirmNewPassword: boolean;
};

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

type FormErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
};

const useEditAdmin = (id: string) => {
  const { showToast } = useToast();
  const [adminData, setAdminData] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<ShowPassword>({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [formValues, setFormValues] = useState<FormValues>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data: adminData, error: adminError } =
          await adminService.fetchAdminById(id);
        if (adminError) {
          setError(adminError);
          return;
        }
        const admin = Array.isArray(adminData) ? adminData[0] : adminData;
        setAdminData({ email: admin?.email || "" });
      } catch (error) {
        setError("Error fetching admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const togglePasswordVisibility = (field: keyof ShowPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validate = (): boolean => {
    const errors: FormErrors = {};

    if (!formValues.currentPassword) {
      errors.currentPassword = "Current password is required.";
    }

    if (!formValues.newPassword) {
      errors.newPassword = "New password is required.";
    } else if (formValues.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters.";
    }

    if (formValues.newPassword !== formValues.confirmNewPassword) {
      errors.confirmNewPassword =
        "New password and confirm password must match.";
    }

    setFormErrors(errors);

    // If there are errors, return false
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the form before submission
    if (!validate()) {
      return;
    }

    try {
      await adminService.editAdmin(id, { email: adminData?.email });
      navigate("/admin");
      showToast("Admin email updated successfully", "info");
    } catch (error) {
      setError("Error updating admin email");
    }
  };

  return {
    adminData,
    loading,
    error,
    formValues,
    formErrors,
    handleChange,
    handleSubmit,
    showPassword,
    togglePasswordVisibility,
  };
};

export default useEditAdmin;
