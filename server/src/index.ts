import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface AuthRequest extends express.Request {
  user?: {
    id: string;
    email: string;
    is_admin: boolean;
  };
}

interface ShorthandRule {
  shorthand: string;
  expansion: string;
}

interface ShorthandCategory {
  id: string;
  category: string;
  test_text: string;
  rules: ShorthandRule[];
  created_at: string;
  updated_at: string;
}

const initializeDefaults = async () => {
  try {
    // Create default users if they don't exist
    const { data: adminUser } = await supabase
      .from("users")
      .select()
      .eq("email", "admin@example.com")
      .single();

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await supabase.from("users").insert({
        email: "admin@example.com",
        password: hashedPassword,
        is_admin: true,
      });
    }

    // Create default shorthand categories if they don't exist
    const { data: categories } = await supabase
      .from("shorthand_categories")
      .select();

    if (!categories || categories.length === 0) {
      const defaultCategories = [
        {
          category: "general",
          test_text:
            "Hey everyone, by the way I'm on my way to the meeting. In my opinion we should discuss this as soon as possible since the deadline is approaching.",
          rules: [
            { shorthand: "btw", expansion: "by the way" },
            { shorthand: "imo", expansion: "in my opinion" },
            { shorthand: "asap", expansion: "as soon as possible" },
          ],
        },
        {
          category: "medical",
          test_text:
            "The patient presented with high blood pressure and elevated heart rate. Patient complains of chest pain. History includes hypertension. Diagnosis pending workup. Treatment plan includes medications and follow-up in two weeks. Nothing by mouth before labs. Need to rule out cardiac issues. Blood pressure stable, respiratory rate and oxygen saturation being monitored.",
          rules: [
            { shorthand: "pt", expansion: "patient" },
            { shorthand: "bp", expansion: "blood pressure" },
            { shorthand: "hr", expansion: "heart rate" },
            { shorthand: "dx", expansion: "diagnosis" },
            { shorthand: "tx", expansion: "treatment" },
            { shorthand: "hx", expansion: "history" },
          ],
        },
        {
          category: "legal",
          test_text:
            "The attorney filed a motion without notifying the defendant. The plaintiff claims jurisdiction in this state, but we may challenge that.",
          rules: [
            { shorthand: "atty", expansion: "attorney" },
            { shorthand: "def", expansion: "defendant" },
            { shorthand: "plt", expansion: "plaintiff" },
          ],
        },
        {
          category: "tech",
          test_text:
            "The application programming interface needs to connect to the database. The user interface and user experience need improvement, and there's a pull request waiting for review.",
          rules: [
            {
              shorthand: "api",
              expansion: "application programming interface",
            },
            { shorthand: "db", expansion: "database" },
            { shorthand: "ui", expansion: "user interface" },
            { shorthand: "ux", expansion: "user experience" },
            { shorthand: "pr", expansion: "pull request" },
          ],
        },
      ];

      for (const category of defaultCategories) {
        await supabase.from("shorthand_categories").insert({
          category: category.category,
          test_text: category.test_text,
          rules: category.rules,
        });
      }
    }
  } catch (error) {
    console.error("Error initializing defaults:", error);
  }
};

// Public route to get shorthand categories
app.get("/api/shorthand", async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from("shorthand_categories")
      .select()
      .order("category");

    if (error) throw error;
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Auth middleware
const auth = async (
  req: AuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as any;

    const { data: user, error } = await supabase
      .from("users")
      .select()
      .eq("id", decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Admin middleware
const adminAuth = async (
  req: AuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    await auth(req, res, () => {
      if (!req.user?.is_admin) {
        return res.status(401).json({ error: "Admin access required" });
      }
      next();
    });
  } catch (error) {
    return res.status(401).json({ error: "Admin access required" });
  }
};

// Auth routes
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data: user, error } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    if (error || !user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Protected routes
app.post("/api/test-data", async (req, res) => {
  try {
    const { job_category, shorthand_test, normal_test, time_saved, feedback } =
      req.body;

    if (!job_category || !shorthand_test || !normal_test) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from("test_data")
      .insert({
        user_id: "0",
        job_category,
        shorthand_test,
        normal_test,
        time_saved,
        feedback,
      })
      .select();

    if (error) throw error;
    res.json({ data });
  } catch (error) {
    console.error("Error saving test data:", error);
    res.status(500).json({ error: "Failed to save test data" });
  }
});

// Admin routes
app.get("/api/admin/users", adminAuth, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select()
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/api/admin/test-data", adminAuth, async (req, res) => {
  try {
    const { data: testData, error } = await supabase
      .from("test_data")
      .select(
        `
        *,
        users (
          email
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(testData);
  } catch (error) {
    console.error("Error fetching test data:", error);
    res.status(500).json({ error: "Failed to fetch test data" });
  }
});

// Initialize defaults and start server
const port = process.env.PORT || 5001;

initializeDefaults().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
