import React, { useEffect, useState } from "react";
import { getCurrentRules } from "../utils/shorthandRules";

const FreePractice: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const loadRules = async (selectedJob: string) => {
    try {
      setLoading(true);
      const rules = await getCurrentRules(selectedJob);
      setRules(rules);
    } catch (error) {
      console.error("Error loading rules:", error);
      setError("Failed to load shortcuts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJob) {
      loadRules(selectedJob);
    }
  }, [selectedJob]);

  return <div>{/* Render your component content here */}</div>;
};

export default FreePractice;
