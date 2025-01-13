import { getShorthandCategories } from "../services/api";
import { ShorthandRule, ShorthandCategory } from "../types/shorthand";

let cachedRules: {
  [key: string]: ShorthandRule[];
} = {};

export const getCurrentRules = async (
  jobCategory: string
): Promise<ShorthandRule[]> => {
  // If we don't have cached rules, fetch them
  if (Object.keys(cachedRules).length === 0) {
    try {
      console.log("Fetching categories from server...");
      const categories = await getShorthandCategories();
      console.log("Received categories:", categories);

      categories.forEach((category: ShorthandCategory) => {
        cachedRules[category.category] = category.rules;
      });
      console.log("Cached rules:", cachedRules);
    } catch (error) {
      console.error("Error fetching shorthand rules:", error);
      return []; // Return empty array if fetch fails
    }
  }

  console.log(
    `Getting rules for category ${jobCategory}:`,
    cachedRules[jobCategory] || []
  );
  return cachedRules[jobCategory] || [];
};

// Function to refresh the cache - call this when rules are updated
export const refreshRules = async (): Promise<void> => {
  try {
    console.log("Refreshing rules cache...");
    const categories = await getShorthandCategories();
    console.log("Received categories for refresh:", categories);

    // Clear existing cache
    cachedRules = {};

    categories.forEach((category: ShorthandCategory) => {
      cachedRules[category.category] = category.rules;
    });
    console.log("Updated cached rules:", cachedRules);
  } catch (error) {
    console.error("Error refreshing shorthand rules:", error);
  }
};

export const expandText = (text: string, jobCategory: string = "general") => {
  const rules = cachedRules[jobCategory] || [];
  let expandedText = text;

  rules.forEach((rule) => {
    const regex = new RegExp(`\\b${rule.shorthand}\\b`, "gi");
    expandedText = expandedText.replace(regex, (match) => {
      const expansion = rule.expansion;
      // Preserve the original capitalization
      if (match[0] === match[0].toUpperCase()) {
        return expansion.charAt(0).toUpperCase() + expansion.slice(1);
      }
      return expansion;
    });
  });

  return expandedText;
};
