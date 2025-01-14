import {
  supabase,
  TestData,
  TestDetails,
  TimeSavedDetails,
} from "../config/supabase";

export interface ITestData
  extends Omit<TestData, "id" | "created_at" | "updated_at"> {
  user_id?: string | null;
}

export class TestDataModel {
  static async create(data: Omit<ITestData, "timestamp">): Promise<ITestData> {
    const { data: result, error } = await supabase
      .from("test_data")
      .insert([
        {
          ...data,
          timestamp: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error || !result) {
      throw new Error(error?.message || "Failed to create test data");
    }

    return result;
  }

  static async findByUserId(userId: string): Promise<ITestData[]> {
    const { data, error } = await supabase
      .from("test_data")
      .select()
      .eq("user_id", userId)
      .order("timestamp", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async find(): Promise<ITestData[]> {
    const { data, error } = await supabase
      .from("test_data")
      .select(
        `
        *,
        users (
          email
        )
      `
      )
      .order("timestamp", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }
}
