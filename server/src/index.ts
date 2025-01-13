import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { auth, adminAuth } from "./middleware/auth";
import { UserModel } from "./models/User";
import { TestDataModel } from "./models/TestData";
import { ShorthandCategory } from "./models/shorthand";
import { Request } from "express";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

interface DefaultRule {
  testText: string;
  rules: Array<{
    shorthand: string;
    expansion: string;
  }>;
}

interface DefaultRules {
  [key: string]: DefaultRule;
}

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    is_admin: boolean;
  };
}

// Initialize default admin user and shorthand rules
const initializeDefaults = async () => {
  try {
    // Create admin user if it doesn't exist
    const adminExists = await UserModel.findByEmail("admin");
    if (!adminExists) {
      await UserModel.create({
        email: "admin",
        password: "admin",
        is_admin: true,
      });
      console.log("Admin user created");
    }

    // Create anonymous user if it doesn't exist
    const anonymousExists = await UserModel.findByEmail("anonymous");
    if (!anonymousExists) {
      await UserModel.create({
        email: "anonymous",
        password: "anonymous",
        is_admin: false,
      });
    }

    // Create default user if it doesn't exist
    const userExists = await UserModel.findByEmail("user@tester.com");
    if (!userExists) {
      await UserModel.create({
        email: "user@tester.com",
        password: "user",
        is_admin: false,
      });
      console.log("Default user created");
    }

    // Initialize default shorthand categories if they don't exist
    const categories = ["general", "medical", "legal", "tech"];
    const defaultRules: DefaultRules = {
      general: {
        testText:
          "Hey everyone, by the way I'm on my way to the meeting. In my opinion we should discuss this as soon as possible since the deadline is approaching. For your information, the client will be there too and they want to review our progress.",
        rules: [
          { shorthand: "btw", expansion: "by the way" },
          { shorthand: "imo", expansion: "in my opinion" },
          { shorthand: "asap", expansion: "as soon as possible" },
          { shorthand: "fyi", expansion: "for your information" },
        ],
      },
      medical: {
        testText:
          "The patient presented with high blood pressure and elevated heart rate. Patient complains of chest pain. History includes hypertension. Diagnosis pending workup. Treatment plan includes medications and follow-up in two weeks. Nothing by mouth before labs. Need to rule out cardiac issues. Blood pressure stable, respiratory rate and oxygen saturation being monitored.",
        rules: [
          { shorthand: "pt", expansion: "Patient" },
          { shorthand: "dx", expansion: "Diagnosis" },
          { shorthand: "hx", expansion: "History" },
          { shorthand: "sx", expansion: "Symptoms" },
          { shorthand: "tx", expansion: "Treatment" },
          { shorthand: "meds", expansion: "Medications" },
          { shorthand: "labs", expansion: "Laboratory results" },
          { shorthand: "npo", expansion: "Nothing by mouth" },
          { shorthand: "f/u", expansion: "Follow-up" },
          { shorthand: "c/o", expansion: "Complains of" },
          { shorthand: "w/u", expansion: "Workup" },
          { shorthand: "r/o", expansion: "Rule out" },
          { shorthand: "bps", expansion: "Blood pressure stable" },
          { shorthand: "hr", expansion: "Heart rate" },
          { shorthand: "rr", expansion: "Respiratory rate" },
          { shorthand: "o2", expansion: "Oxygen saturation" },
        ],
      },
      legal: {
        testText:
          "The attorney filed a motion without notifying the defendant. The plaintiff claims jurisdiction in this state, but we may challenge that.",
        rules: [
          { shorthand: "atty", expansion: "attorney" },
          { shorthand: "def", expansion: "defendant" },
          { shorthand: "plt", expansion: "plaintiff" },
          { shorthand: "jx", expansion: "jurisdiction" },
          { shorthand: "mtn", expansion: "motion" },
        ],
      },
      tech: {
        testText:
          "The application programming interface needs to connect to the database. The user interface and user experience need improvement, and there's a pull request waiting for review.",
        rules: [
          { shorthand: "api", expansion: "application programming interface" },
          { shorthand: "db", expansion: "database" },
          { shorthand: "ui", expansion: "user interface" },
          { shorthand: "ux", expansion: "user experience" },
          { shorthand: "pr", expansion: "pull request" },
        ],
      },
    };

    for (const category of categories) {
      const exists = await ShorthandCategory.findByCategory(category);
      if (!exists && category in defaultRules) {
        await ShorthandCategory.create({
          category,
          test_text: defaultRules[category].testText,
          rules: defaultRules[category].rules,
        });
        console.log(`Default ${category} category created`);
      }
    }
  } catch (error) {
    console.error("Error initializing defaults:", error);
  }
};

// Routes
// Public routes first - MUST be before any middleware
app.get("/api/shorthand", async (req, res) => {
  try {
    console.log("Fetching categories...");
    const categories = await ShorthandCategory.find();
    console.log("Found categories:", categories);
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// Auth routes
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findByEmail(email);

    if (!user || !user.comparePassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.email, isAdmin: user.is_admin },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        email: user.email,
        isAdmin: user.is_admin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Protected routes
app.put("/api/shorthand/:category", auth, async (req, res) => {
  try {
    const { testText, rules } = req.body;
    const category = req.params.category;

    const existingCategory = await ShorthandCategory.findByCategory(category);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedCategory = await ShorthandCategory.update(
      existingCategory.id,
      {
        test_text: testText,
        rules,
      }
    );

    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: "Error updating category" });
  }
});

// Add test data submission endpoint
app.post("/api/test-data", async (req, res) => {
  try {
    const { job_category, shorthand_test, normal_test, time_saved, feedback } =
      req.body;

    if (!job_category) {
      return res.status(400).json({ message: "job_category is required" });
    }

    // Get anonymous user ID
    const anonymousUser = await UserModel.findByEmail("anonymous");
    if (!anonymousUser) {
      return res.status(500).json({ message: "Anonymous user not found" });
    }

    const testData = await TestDataModel.create({
      job_category,
      shorthand_test,
      normal_test,
      time_saved,
      user_id: anonymousUser.id,
    });

    res
      .status(201)
      .json({ message: "Test results saved successfully", data: testData });
  } catch (error) {
    console.error("Error saving test data:", error);
    res.status(500).json({ message: "Error saving test data" });
  }
});

// Admin routes
app.get("/api/admin/users", adminAuth, async (req, res) => {
  try {
    const users = await UserModel.find();
    console.log("Found users:", users);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Error fetching users",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

app.get("/api/admin/test-data", adminAuth, async (req, res) => {
  try {
    const testData = await TestDataModel.find();
    res.json(testData);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/admin/users", adminAuth, async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await UserModel.create({
      email,
      password,
      is_admin: false,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// Initialize defaults
initializeDefaults().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
