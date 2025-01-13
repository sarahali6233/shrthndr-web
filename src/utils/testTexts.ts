import { JobCategory } from "../types/shorthand";

interface TestText {
  text: string;
  category: JobCategory;
}

export const testTexts: TestText[] = [
  {
    category: "general",
    text: "Hey, by the way I'm on my way to the meeting. In my opinion we should discuss this as soon as possible. For your information, the client will be there too.",
  },
  {
    category: "medical",
    text: "The patient presented with high blood pressure and elevated heart rate. Prescription was provided based on the diagnosis. The patient should follow up in two weeks.",
  },
  {
    category: "legal",
    text: "The attorney filed a motion without notifying the defendant. The plaintiff claims jurisdiction in this state, but we may challenge that.",
  },
  {
    category: "tech",
    text: "The application programming interface needs to connect to the database. The user interface and user experience need improvement, and there's a pull request waiting for review.",
  },
];
