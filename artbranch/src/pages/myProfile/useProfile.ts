import { useState } from "react";
import { supabase } from "../../utils/services/supabase";

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

export const useProfile = () => {
  const [isPasswordChangeVisible, setIsPasswordChangeVisible] = useState(false);
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
  const [loading, setLoading] = useState(false);

  const togglePasswordChange = () => {
    setIsPasswordChangeVisible((prev) => !prev);
  };

  const togglePasswordVisibility = (field: keyof ShowPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
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

    return Object.keys(errors).length === 0;
  };

  const changePassword = async (): Promise<string | null> => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: formValues.newPassword,
      });

      if (error) {
        setFormErrors({ currentPassword: error.message });
        return null;
      }

      return "Password changed successfully!";
    } catch (err) {
      console.error("Error changing password:", err);
      setFormErrors({ currentPassword: "An unexpected error occurred." });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
