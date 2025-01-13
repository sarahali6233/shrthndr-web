export interface ShorthandRule {
  shorthand: string;
  expansion: string;
}

export interface ShorthandCategory {
  category: string;
  testText: string;
  rules: ShorthandRule[];
}

export interface JobShorthandRules {
  jobTitle: string;
  rules: ShorthandRule[];
}

export type JobCategory = "general" | "medical" | "legal" | "tech";
