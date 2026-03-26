import { supabase } from "./supabase";

// Admin authentication functions
export const adminAuth = {
  async login(email: string, password: string) {
    try {
      // Get admin user from database
      const { data: admin, error: fetchError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .eq("is_active", true)
        .single();

      if (fetchError || !admin) {
        throw new Error("Admin user not found or inactive");
      }

      // Simple password comparison (in production, use bcrypt)
      if (admin.password_hash !== btoa(password)) {
        throw new Error("Invalid password");
      }

      return {
        success: true,
        admin: {
          id: admin.id,
          email: admin.email,
          full_name: admin.full_name,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }
  },

  async createAdmin(email: string, password: string, fullName: string) {
    try {
      const { data, error } = await supabase.from("admin_users").insert({
        email,
        password_hash: btoa(password), // Simple encoding (use bcrypt in production)
        full_name: fullName,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getAdminByEmail(email: string) {
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};
