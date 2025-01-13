import express from "express";
import { ShorthandCategory } from "../models/shorthand";
import { auth, adminAuth } from "../middleware/auth";

const router = express.Router();

// Create a new shorthand category (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const { category, testText, rules } = req.body;
    const newCategory = await ShorthandCategory.create({
      category,
      test_text: testText,
      rules,
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: "Error creating category" });
  }
});

// Update a shorthand category (admin only)
router.put("/:category", adminAuth, async (req, res) => {
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

// Delete a shorthand category (admin only)
router.delete("/:category", adminAuth, async (req, res) => {
  try {
    const category = req.params.category;
    const existingCategory = await ShorthandCategory.findByCategory(category);

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    await ShorthandCategory.delete(existingCategory.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: "Error deleting category" });
  }
});

export default router;
