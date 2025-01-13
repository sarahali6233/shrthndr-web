import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { JobShorthandRules } from "../types/shorthand";

interface JobSelectorProps {
  jobs: JobShorthandRules[];
  selectedJob: string;
  onJobSelect: (jobTitle: string) => void;
}

const JobSelector: React.FC<JobSelectorProps> = ({
  jobs,
  selectedJob,
  onJobSelect,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onJobSelect(event.target.value);
  };

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel id="job-select-label">Select Job Category</InputLabel>
      <Select
        labelId="job-select-label"
        id="job-select"
        value={selectedJob}
        label="Select Job Category"
        onChange={handleChange}
      >
        {jobs.map((job) => (
          <MenuItem key={job.jobTitle} value={job.jobTitle}>
            {job.jobTitle}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default JobSelector;
