import React, { useState, useCallback, useEffect } from "react";
import {
  TextField,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { getCurrentRules, expandText } from "../utils/shorthandRules";
import TypingTest from "./TypingTest";
import { ShorthandRule } from "../types/shorthand";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ShorthandInputProps {
  token: string;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const ShorthandInput: React.FC<ShorthandInputProps> = ({ token }) => {
  const [shorthandInput, setShorthandInput] = useState("");
  const [selectedJob, setSelectedJob] = useState("general");
  const [tabValue, setTabValue] = useState(0);
  const [expandedText, setExpandedText] = useState("");
  const [rules, setRules] = useState<ShorthandRule[]>([]);

  useEffect(() => {
    // Load rules when job category changes
    const loadRules = async () => {
      try {
        console.log("Loading rules for category:", selectedJob);
        const loadedRules = await getCurrentRules(selectedJob);
        console.log("Loaded rules:", loadedRules);
        setRules(loadedRules);

        // Update expanded text with new rules if needed
        if (shorthandInput) {
          const expanded = expandText(shorthandInput, selectedJob);
          setExpandedText(expanded);
        }
      } catch (error) {
        console.error("Error loading rules:", error);
      }
    };

    loadRules();
  }, [selectedJob]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newInput = e.target.value;
    setShorthandInput(newInput);
    const expanded = expandText(newInput, selectedJob);
    setExpandedText(expanded);
  };

  const jobCategories = ["general", "medical", "legal", "tech"];

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Free Practice" />
          <Tab label="Typing Test" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Job Category
          </Typography>
          <Tabs
            value={selectedJob}
            onChange={(e, newValue) => setSelectedJob(newValue)}
          >
            {jobCategories.map((category) => (
              <Tab
                key={category}
                value={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
              />
            ))}
          </Tabs>
        </Box>

        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "primary.light",
            color: "primary.contrastText",
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Available Shortcuts ({rules.length}):
          </Typography>
          <List dense>
            {rules.map((rule) => (
              <ListItem key={rule.shorthand}>
                <ListItemText
                  primary={`${rule.shorthand} → ${rule.expansion}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        <TextField
          fullWidth
          multiline
          rows={6}
          value={expandText(shorthandInput)}
          onChange={handleInputChange}
          placeholder="Start typing here (shortcuts will expand as you type)..."
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TypingTest
          selectedJob={selectedJob}
          expandText={(text) => expandText(text, selectedJob)}
          onJobSelect={setSelectedJob}
          token={token}
        />
      </TabPanel>
    </Box>
  );
};

export default ShorthandInput;
