import { useState, useEffect } from "react";
import { useToast } from "../../components/Toast";
import { verifyOTP, triggerOTP } from "../../utils/otpService";
import { supabase } from "../../utils/services/supabase";

const useLogin = () => {
  const { showToast } = useToast();
  const [values, setValues] = useState({ email: "", password: "", otp: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; otp?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"LOGIN" | "OTP">("LOGIN");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpExpiresIn, setOtpExpiresIn] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
  
    if (otpExpiresIn && otpExpiresIn > 0) {
      interval = setInterval(() => {
        setOtpExpiresIn((prev) => {
          const updatedValue = prev ? prev - 1 : 0;
          if (updatedValue === 0) {
            setGeneratedOtp(null); 
          }
          return updatedValue;
        });
      }, 1000);
    }
  
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpExpiresIn]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const validateLogin = () => {
    const validationErrors: { email?: string; password?: string } = {};
    if (!values.email) validationErrors.email = "Email is required.";
    if (!values.password) validationErrors.password = "Password is required.";
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const validateOTP = () => {
    if (!values.otp) {
      setErrors({ otp: "OTP is required." });
      return false;
    }
    return true;
  };

  const generateOTP = async () => {
    try {
      const triggerOtpResponse = await triggerOTP( values.email);

      if (triggerOtpResponse.success) {
        setOtpExpiresIn(180); 
        showToast("OTP generated successfully.", "success");
      } else {
        showToast("Failed to generate OTP. Please try again.", "error");
      }
    } catch (err) {
      console.error("Error generating OTP:", err);
      showToast("An error occurred while generating OTP.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === "LOGIN") {
      if (!validateLogin()) return;

      setLoading(true);
      try {
        const { data: user, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          console.error("Authentication error:", error.message);
          showToast("Invalid email or password. Please try again.", "error");
        } else if (user) {
          await generateOTP();
          setStep("OTP");
        }
      } catch (err) {
        console.error("Login error:", err);
        showToast("An error occurred. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    } else if (step === "OTP") {
      if (!validateOTP()) return;

      setLoading(true);
      try {
        const isValidOtp = await verifyOTP(values.email, values.otp);

        if (isValidOtp) {
          showToast("Login successful!", "success");
          setTimeout(() => (window.location.href = "/overview"), 500);
        } else {
          showToast("Invalid OTP. Please try again.", "error");
        }
      } catch (err) {
        console.error("OTP verification error:", err);
        showToast("An error occurred. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    showPassword,
    togglePasswordVisibility: () => setShowPassword((prev) => !prev),
    loading,
    step,
    setStep,
    otpExpiresIn,
    generatedOtp,
    regenerateOTP: generateOTP, 
  };
};


export default useLogin;
