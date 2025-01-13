import bcrypt from "bcryptjs";
import { supabase, User } from "../config/supabase";

export interface IUser {
  id: string;
  email: string;
  password: string;
  is_admin: boolean;
  comparePassword?: (candidatePassword: string) => Promise<boolean>;
}

export class UserModel {
  static async findByEmail(email: string): Promise<IUser | null> {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      is_admin: user.is_admin,
      comparePassword: async (candidatePassword: string) => {
        return bcrypt.compare(candidatePassword, user.password);
      },
    };
  }

  static async findById(id: string): Promise<IUser | null> {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      ...data,
      comparePassword: async (candidatePassword: string) => {
        return bcrypt.compare(candidatePassword, data.password);
      },
    };
  }

  static async create(userData: {
    email: string;
    password: string;
    is_admin?: boolean;
  }): Promise<IUser> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const { data: result, error } = await supabase
      .from("users")
      .insert([
        {
          email: userData.email.toLowerCase(),
          password: hashedPassword,
          is_admin: userData.is_admin || false,
        },
      ])
      .select()
      .single();

    if (error || !result) {
      throw new Error(error?.message || "Failed to create user");
    }

    return {
      ...result,
      comparePassword: async (candidatePassword: string) => {
        return bcrypt.compare(candidatePassword, result.password);
      },
    };
  }

  static async find(): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async findOne(query: Partial<IUser>): Promise<IUser | null> {
    const { data, error } = await supabase
      .from("users")
      .select()
      .match(query)
      .single();

    if (error || !data) return null;

    return {
      ...data,
      comparePassword: async (candidatePassword: string) => {
        return bcrypt.compare(candidatePassword, data.password);
      },
    };
  }
}
