import { useState } from "react";

type ShowPassword = {
  password: boolean;
  confirmPassword: boolean;
};

type FormValues = {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = {
  fullName?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
};

const useNewAdmin = () => {
  const [showPassword, setShowPassword] = useState<ShowPassword>({
    password: false,
    confirmPassword: false,
  });

  const [values, setValues] = useState<FormValues>({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const togglePasswordVisibility = (field: keyof ShowPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const validationErrors: FormErrors = {};

    if (!values.fullName) {
      validationErrors.fullName = "Full Name is required.";
    }

    if (!values.username) {
      validationErrors.username = "Username is required.";
    }

    if (!values.password) {
      validationErrors.password = "Password is required.";
    } else if (values.password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters.";
    }

    if (values.password !== values.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  return {
    values,
    errors,
    showPassword,
    togglePasswordVisibility,
    handleChange,
    validate,
    setValues,
    setErrors,
  };
};

export default useNewAdmin;
