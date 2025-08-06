import { supabase } from "./services/supabase";

export function generateOTP(): string {
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }
  
  // Store OTP function
  export async function storeOTP(otp: string, email: string): Promise<any> {
    try {
      const { data: existingOtp } = await supabase
        .from("otps")
        .select("*")
        .eq("email", email)
        .single();
  
      if (existingOtp) {
        const { error: expireError } = await supabase
          .from("otps")
          .update({ expires_at: new Date(Date.now() - 1).toISOString() })
          .eq("email", email);
  
        if (expireError) {
          console.error("Error expiring existing OTP:", expireError.message);
          return { success: false, error: expireError.message };
        }
      }


      
  
      const { data, error } = await supabase.from("otps").upsert([
        {
          otp,
          email,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        },
      ]);
  
      if (error) {
        console.error("Error storing OTP:", error.message);
        return { success: false, error: error.message };
      }
  
      return { success: true, data };
    } catch (err) {
      console.error("Unexpected error storing OTP:", err);
      return { success: false, error: "Unexpected error occurred" };
    }
  }
  

   export async function triggerOTP (email: string) {
    try {
      const { data, error } = await supabase.functions.invoke("trigger-email", {
        body: {
          email: email,
          type: "otp", 
        },
      });
  
      if (error) {
        console.error("Error storing OTP:", error.message);
        return { success: false, error: error.message };
      }
  
      return { success: true, data };
    } catch (err) {
      console.error("Unexpected error storing OTP:", err);
      return { success: false, error: "Unexpected error occurred" };
    }
  };
  export async function verifyOTP(
    email: string,
    inputOTP: string,
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("otps")
        .select("*")
        .eq("email", email)
        .single();
  
      if (error || !data) {
        console.error("OTP not found or user error:", error);
        return false;
      }
  
      const { otp, expires_at } = data;
  
      if (otp === inputOTP && new Date(expires_at) > new Date()) {
        return true;
      } else {
        console.error("Invalid OTP or OTP expired");
        return false;
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      return false;
    }
  }
  
  // Fetch OTP from the database based on email
  export const getOtpFromDb = async (email: string) => {
    const { data, error } = await supabase
      .from("otps")
      .select("*")
      .eq("email", email);
  
    if (error) {
      console.error("Error fetching OTP:", error);
      return [];
    }
    return data;
  };