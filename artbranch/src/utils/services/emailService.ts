import { supabase } from "./supabase";

export async function triggerArtistMessage(email: string, message: string) {
  try {
    const { data, error } = await supabase.functions.invoke("trigger-email", {
      body: {
        email: email,
        message: message,
        type: "general",
      },
    });

    if (error) {
      console.error("Error sending message:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error sending message:", err);
    return { success: false, error: "Unexpected error occurred" };
  }
}
