import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  ShorthandCategory,
  getShorthandCategories,
  updateShorthandCategory,
} from "../services/api";
import { ShorthandRule } from "../types/shorthand";
import { refreshRules } from "../utils/shorthandRules";

interface ShorthandManagerProps {
  token: string;
}

const ShorthandManager: React.FC<ShorthandManagerProps> = ({ token }) => {
  const [categories, setCategories] = useState<ShorthandCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [testText, setTestText] = useState("");
  const [rules, setRules] = useState<ShorthandRule[]>([]);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newRule, setNewRule] = useState<ShorthandRule>({
    shorthand: "",
    expansion: "",
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [addRuleError, setAddRuleError] = useState("");
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [bulkRules, setBulkRules] = useState<ShorthandRule[]>([]);
  const [loading, setLoading] = useState(false);

  const jobCategories = ["general", "medical", "legal", "tech"];

  useEffect(() => {
    loadCategories();
  }, [token]);

  useEffect(() => {
    const category = categories.find((c) => c.category === selectedCategory);
    if (category) {
      setTestText(category.testText);
      setRules(category.rules);
    } else {
      // Initialize new category with empty values
      setTestText("");
      setRules([]);
    }
  }, [selectedCategory, categories]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categories = await getShorthandCategories();
      setCategories(categories);
    } catch (error) {
      console.error("Error loading categories:", error);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedCategory || !token) return;

    try {
      setLoading(true);
      await updateShorthandCategory(selectedCategory, testText, rules, token);
      setSuccessMessage("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      setError("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRule = () => {
    setAddRuleError("");

    if (!newRule.shorthand.trim()) {
      setAddRuleError("Shorthand text is required");
      return;
    }

    if (!newRule.expansion.trim()) {
      setAddRuleError("Expansion text is required");
      return;
    }

    // Check if shorthand already exists
    if (rules.some((rule) => rule.shorthand === newRule.shorthand.trim())) {
      setAddRuleError("This shorthand already exists");
      return;
    }

    setRules([
      ...rules,
      {
        shorthand: newRule.shorthand.trim(),
        expansion: newRule.expansion.trim(),
      },
    ]);
    setNewRule({ shorthand: "", expansion: "" });
    setIsAddingRule(false);
    setAddRuleError("");
  };

  const handleAddBulkRule = () => {
    setBulkRules([...bulkRules, { shorthand: "", expansion: "" }]);
  };

  const handleBulkRuleChange = (
    index: number,
    field: keyof ShorthandRule,
    value: string
  ) => {
    const newBulkRules = [...bulkRules];
    newBulkRules[index] = { ...newBulkRules[index], [field]: value };
    setBulkRules(newBulkRules);
  };

  const handleRemoveBulkRule = (index: number) => {
    setBulkRules(bulkRules.filter((_, i) => i !== index));
  };

  const handleSaveBulkRules = () => {
    setAddRuleError("");

    // Validate bulk rules
    const validRules = bulkRules.filter(
      (rule) => rule.shorthand.trim() && rule.expansion.trim()
    );
    const duplicates = validRules.some(
      (rule, index) =>
        validRules.findIndex(
          (r) => r.shorthand.trim() === rule.shorthand.trim()
        ) !== index
    );

    if (duplicates) {
      setAddRuleError("Duplicate shorthands found in bulk rules");
      return;
    }

    // Check against existing rules
    const existingConflict = validRules.some((rule) =>
      rules.some(
        (existingRule) => existingRule.shorthand === rule.shorthand.trim()
      )
    );

    if (existingConflict) {
      setAddRuleError("Some shorthands already exist in the current category");
      return;
    }

    // Add all valid rules
    setRules([...rules, ...validRules]);
    setBulkRules([]);
    setIsAddingRule(false);
    setAddRuleError("");
  };

  const handleDeleteRule = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const newRules = [...rules];
      newRules.splice(deleteIndex, 1);
      setRules(newRules);
      setDeleteIndex(null);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Manage Shorthand Rules
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={selectedCategory}
          onChange={(e, value) => {
            setSelectedCategory(value);
            setBulkRules([]);
            setAddRuleError("");
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {jobCategories.map((category) => (
            <Tab
              key={category}
              label={category.charAt(0).toUpperCase() + category.slice(1)}
              value={category}
            />
          ))}
        </Tabs>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Test Text for{" "}
            {selectedCategory.charAt(0).toUpperCase() +
              selectedCategory.slice(1)}
          </Typography>
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder={`Enter test text for ${selectedCategory} category...`}
          sx={{ mb: 2 }}
        />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">
            Shortcuts for{" "}
            {selectedCategory.charAt(0).toUpperCase() +
              selectedCategory.slice(1)}
          </Typography>
          <Box>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setIsAddingRule(true)}
              sx={{ mr: 1 }}
            >
              Add Single
            </Button>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddBulkRule}
              variant="contained"
            >
              Add Row
            </Button>
          </Box>
        </Box>

        {bulkRules.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Bulk Add Shortcuts
            </Typography>
            {bulkRules.map((rule, index) => (
              <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  label="Shorthand"
                  value={rule.shorthand}
                  onChange={(e) =>
                    handleBulkRuleChange(index, "shorthand", e.target.value)
                  }
                  size="small"
                />
                <TextField
                  label="Expansion"
                  value={rule.expansion}
                  onChange={(e) =>
                    handleBulkRuleChange(index, "expansion", e.target.value)
                  }
                  size="small"
                  sx={{ flex: 1 }}
                />
                <IconButton
                  onClick={() => handleRemoveBulkRule(index)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="contained"
              onClick={handleSaveBulkRules}
              disabled={bulkRules.length === 0}
              sx={{ mt: 1 }}
            >
              Save All
            </Button>
          </Box>
        )}

        <List>
          {rules.map((rule, index) => (
            <ListItem key={index} divider>
              <ListItemText primary={`${rule.shorthand} → ${rule.expansion}`} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteRule(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Button
        variant="contained"
        onClick={handleSave}
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>

      <Dialog open={isAddingRule} onClose={() => setIsAddingRule(false)}>
        <DialogTitle>
          Add New Shortcut to{" "}
          {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Shorthand"
            value={newRule.shorthand}
            onChange={(e) =>
              setNewRule({ ...newRule, shorthand: e.target.value })
            }
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Expansion"
            value={newRule.expansion}
            onChange={(e) =>
              setNewRule({ ...newRule, expansion: e.target.value })
            }
          />
          {addRuleError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {addRuleError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsAddingRule(false);
              setAddRuleError("");
              setNewRule({ shorthand: "", expansion: "" });
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleAddRule} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteIndex !== null} onClose={() => setDeleteIndex(null)}>
        <DialogTitle>Delete Shortcut</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this shortcut?
            {deleteIndex !== null && rules[deleteIndex] && (
              <Box sx={{ mt: 1, fontWeight: "bold" }}>
                {rules[deleteIndex].shorthand} → {rules[deleteIndex].expansion}
              </Box>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShorthandManager;
