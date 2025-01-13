import {
  supabase,
  ShorthandCategory as IShorthandCategory,
} from "../config/supabase";

export class ShorthandCategory {
  static async findOne(
    query: Partial<IShorthandCategory>
  ): Promise<IShorthandCategory | null> {
    const { data, error } = await supabase
      .from("shorthand_categories")
      .select()
      .match(query)
      .single();

    if (error || !data) return null;
    return data;
  }

  static async create(
    data: Omit<IShorthandCategory, "id" | "created_at" | "updated_at">
  ): Promise<IShorthandCategory> {
    const { data: result, error } = await supabase
      .from("shorthand_categories")
      .insert([data])
      .select()
      .single();

    if (error || !result) {
      throw new Error(error?.message || "Failed to create shorthand category");
    }

    return result;
  }

  static async find(): Promise<IShorthandCategory[]> {
    const { data, error } = await supabase
      .from("shorthand_categories")
      .select()
      .order("category");

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async findByCategory(
    category: string
  ): Promise<IShorthandCategory | null> {
    const { data, error } = await supabase
      .from("shorthand_categories")
      .select()
      .eq("category", category)
      .single();

    if (error || !data) return null;
    return data;
  }

  static async update(
    id: string,
    data: Partial<Omit<IShorthandCategory, "id">>
  ): Promise<IShorthandCategory> {
    const { data: result, error } = await supabase
      .from("shorthand_categories")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error || !result) {
      throw new Error(error?.message || "Failed to update shorthand category");
    }

    return result;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("shorthand_categories")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }
}
