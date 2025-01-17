import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from server/.env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase configuration. Please check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions for our database tables
export type User = {
  id: string;
  email: string;
  password: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type TestDetails = {
  wpm: number;
  accuracy: number;
  time_in_seconds: number;
  input_text?: string;
};

export type TimeSavedDetails = {
  seconds: number;
  percentage: number;
};

export interface TestData {
  id: string;
  created_at: string;
  updated_at: string;
  timestamp: string;
  job_category: string;
  shorthand_test: TestDetails;
  normal_test: TestDetails;
  time_saved: TimeSavedDetails;
  user_id?: string | null;
  feedback?: string;
}

export type ShorthandRule = {
  shorthand: string;
  expansion: string;
};

export type ShorthandCategory = {
  id: string;
  category: string;
  test_text: string;
  rules: ShorthandRule[];
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<User, "id">>;
      };
      test_data: {
        Row: TestData;
        Insert: Omit<TestData, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<TestData, "id">>;
      };
      shorthand_categories: {
        Row: ShorthandCategory;
        Insert: Omit<ShorthandCategory, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ShorthandCategory, "id">>;
      };
    };
  };
};
