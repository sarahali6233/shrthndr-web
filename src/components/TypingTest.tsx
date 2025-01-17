import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  CircularProgress,
  Stack,
  Tabs,
  Tab,
  Slider,
  Chip,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { getCurrentRules } from "../utils/shorthandRules";
import { API_URL } from "../services/api";
import { ShorthandRule } from "../types/shorthand";

interface TypingTestProps {
  selectedJob: string;
  expandText: (text: string) => string;
  onJobSelect: (job: string) => void;
  token: string;
}

interface TestResult {
  wpm: number;
  accuracy: number;
  timeInSeconds: number;
}

interface Feedback {
  rating: number;
  comment: string;
  email: string;
}

const TypingTest: React.FC<TypingTestProps> = ({
  selectedJob,
  expandText,
  onJobSelect,
  token,
}) => {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [inputText, setInputText] = useState("");
  const [shorthandInput, setShorthandInput] = useState("");
  const [targetText, setTargetText] = useState("");
  const [normalResult, setNormalResult] = useState<TestResult | null>(null);
  const [shorthandResult, setShorthandResult] = useState<TestResult | null>(
    null
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [rules, setRules] = useState<ShorthandRule[]>([]);
  const [feedback, setFeedback] = useState<Feedback>({
    rating: 5,
    comment: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const loadRules = async (selectedJob: string) => {
    try {
      const rules = await getCurrentRules(selectedJob);
      setRules(rules);
    } catch (error) {
      console.error("Error loading rules:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (selectedJob) {
      loadRules(selectedJob);
    }
  }, [selectedJob]);

  useEffect(() => {
    const loadRules = async () => {
      try {
        console.log("Loading rules for typing test, category:", selectedJob);
        const loadedRules = await getCurrentRules(selectedJob);
        console.log("Loaded rules for typing test:", loadedRules);
        setRules(loadedRules);
        const testRule = loadedRules.find((rule) => rule.shorthand === "test");
        if (testRule) {
          setTargetText(testRule.expansion);
        } else {
          console.log("No test rule found, using default text");
          // Default text based on job category
          const defaultTexts = {
            general:
              "Hey everyone, by the way I'm on my way to the meeting. In my opinion we should discuss this as soon as possible since the deadline is approaching.",
            medical:
              "The patient presented with an elevated heart rate of 120 bpm. After a thorough diagnosis, the doctor wrote a prescription for medication. The patient's medical history was reviewed carefully.",
            legal:
              "The attorney filed a motion without notifying the defendant. The plaintiff claims jurisdiction in this state, but we may challenge that.",
            tech: "The application programming interface needs to connect to the database. The user interface and user experience need improvement, and there's a pull request waiting for review.",
          };
          setTargetText(
            defaultTexts[selectedJob as keyof typeof defaultTexts] ||
              defaultTexts.general
          );
        }
      } catch (error) {
        console.error("Error loading rules:", error);
        setTargetText("Error loading test text. Please try again.");
      }
    };

    loadRules();
    if (step === 0) {
      resetTest();
      setNormalResult(null);
      setShorthandResult(null);
      setFeedback({ rating: 5, comment: "", email: "" });
      setSubmitted(false);
    }
  }, [selectedJob, step]);

  const resetTest = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStarted(false);
    setFinished(false);
    setStartTime(null);
    setElapsedTime(0);
    setInputText("");
    setShorthandInput("");
  };

  const startTimer = () => {
    setStarted(true);
    const now = Date.now();
    setStartTime(now);
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - now) / 1000));
    }, 1000);
  };

  const finishTest = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setFinished(true);
    const result = {
      wpm: calculateWPM(),
      accuracy: calculateAccuracy(),
      timeInSeconds: elapsedTime,
    };
    if (step === 0) {
      setNormalResult(result);
      setStep(1);
      resetTest();
    } else {
      setShorthandResult(result);
      setStep(2);
    }
  };

  const calculateWPM = () => {
    if (!startTime || !finished) return 0;
    const words = (step === 0 ? inputText : expandText(shorthandInput))
      .trim()
      .split(/\s+/).length;
    const minutes = elapsedTime / 60;
    return Math.round(words / minutes);
  };

  const calculateAccuracy = () => {
    if (!finished) return 0;
    const currentInput = step === 0 ? inputText : expandText(shorthandInput);
    const targetWords = targetText.trim().split(/\s+/);
    const inputWords = currentInput.trim().split(/\s+/);
    const correctWords = targetWords.filter(
      (word, i) => word === inputWords[i]
    );
    return Math.round((correctWords.length / targetWords.length) * 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;

    if (!started) {
      startTimer();
    }

    if (step === 0) {
      setInputText(newValue);
      if (newValue.length >= targetText.length) {
        finishTest();
      }
    } else {
      // For shorthand typing test
      const currentExpanded = expandText(shorthandInput);

      // Calculate the difference between new and current expanded text
      if (newValue.length < currentExpanded.length) {
        // Handle deletion
        const cursorPos = e.target.selectionStart || 0;
        // Convert cursor position from expanded text to shorthand text
        const expandedBeforeCursor = currentExpanded.slice(0, cursorPos);
        const shorthandBeforeCursor = shorthandInput.slice(
          0,
          shorthandInput.length * (cursorPos / currentExpanded.length)
        );
        const deletePos = Math.floor(shorthandBeforeCursor.length);

        const beforeCursor = shorthandInput.slice(0, deletePos);
        const afterCursor = shorthandInput.slice(deletePos + 1);
        setShorthandInput(beforeCursor + afterCursor);
      } else {
        // Handle addition
        const addedChar = newValue[cursorPosition - 1];
        if (addedChar) {
          const beforeCursor = shorthandInput.slice(0, cursorPosition - 1);
          const afterCursor = shorthandInput.slice(cursorPosition - 1);
          const shouldCapitalize = beforeCursor.trim().endsWith(".");
          const newChar = shouldCapitalize
            ? addedChar.toUpperCase()
            : addedChar;
          const newShorthand = beforeCursor + newChar + afterCursor;
          setShorthandInput(newShorthand);

          if (expandText(newShorthand).length >= targetText.length) {
            finishTest();
          }
        }
      }
    }
  };

  const getTimeSaved = () => {
    if (!normalResult || !shorthandResult) return null;
    const timeSaved =
      normalResult.timeInSeconds - shorthandResult.timeInSeconds;
    const percentage = Math.round(
      (timeSaved / normalResult.timeInSeconds) * 100
    );
    return {
      seconds: timeSaved,
      percentage: isFinite(percentage) ? percentage : 0,
    };
  };

  const renderTimer = () => {
    if (!started || finished) return null;
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    return (
      <Box
        sx={{
          position: "fixed",
          top: 20,
          right: 20,
          bgcolor: "primary.main",
          color: "white",
          borderRadius: "50%",
          width: 100,
          height: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 3,
        }}
      >
        <Typography variant="h4">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </Typography>
        <CircularProgress
          variant="determinate"
          value={100}
          size={100}
          sx={{
            position: "absolute",
            color: "rgba(255,255,255,0.2)",
          }}
        />
      </Box>
    );
  };

  const handleSubmit = async () => {
    const testData = {
      job_category: selectedJob.toLowerCase(),
      shorthand_test: {
        wpm: shorthandResult!.wpm,
        accuracy: shorthandResult!.accuracy,
        time_in_seconds: shorthandResult!.timeInSeconds,
      },
      normal_test: {
        wpm: normalResult!.wpm,
        accuracy: normalResult!.accuracy,
        time_in_seconds: normalResult!.timeInSeconds,
      },
      time_saved: getTimeSaved(),
      feedback: {
        rating: feedback.rating,
        comment: feedback.comment,
        email: feedback.email,
      },
    };

    try {
      const response = await fetch(`${API_URL}/api/test-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      if (!response.ok) {
        throw new Error("Failed to save test data");
      }
      setSubmitted(true);
    } catch (error) {
      console.error("Error saving test data:", error);
    }
  };

  const renderHighlightedText = (text: string, currentInput: string) => {
    const words = text.split(/\s+/);
    const inputWords = currentInput.trim().split(/\s+/);
    const currentWordIndex = inputWords.length - 1;

    return (
      <Box>
        {words.map((word, index) => (
          <Typography
            key={index}
            component="span"
            sx={{
              backgroundColor:
                index === currentWordIndex ? "primary.light" : "transparent",
              padding: "2px 4px",
              borderRadius: "4px",
              margin: "0 2px",
              display: "inline-block",
            }}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </Typography>
        ))}
      </Box>
    );
  };

  const renderShortcuts = () => (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        bgcolor: "primary.light",
        color: "primary.contrastText",
      }}
    >
      <Typography variant="subtitle2" gutterBottom sx={{ color: "white" }}>
        Available Shortcuts:
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {rules.map((rule) => (
          <Chip
            key={rule.shorthand}
            label={`${rule.shorthand} → ${rule.expansion}`}
            size="small"
            sx={{ bgcolor: "primary.dark", color: "white" }}
          />
        ))}
      </Box>
    </Paper>
  );

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Step 1: Normal Typing Test
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Select Job Category
              </Typography>
              <Tabs
                value={selectedJob}
                onChange={(e, newValue) => onJobSelect(newValue)}
                sx={{ mb: 2 }}
              >
                {["general", "medical", "legal", "tech"].map((category) => (
                  <Tab
                    key={category}
                    value={category}
                    label={category.charAt(0).toUpperCase() + category.slice(1)}
                    disabled={started}
                  />
                ))}
              </Tabs>
            </Box>
            {renderShortcuts()}
            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Type the following text:
              </Typography>
              {renderHighlightedText(targetText, inputText)}
            </Paper>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={inputText}
              onChange={handleInputChange}
              disabled={finished}
              placeholder="Start typing here..."
              sx={{ mb: 2 }}
            />
            {started && !finished && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Progress:{" "}
                {Math.round(
                  inputText.trim() === targetText.trim()
                    ? 100
                    : Math.min(
                        99,
                        (inputText.trim().length / targetText.trim().length) *
                          100
                      )
                )}
                %
              </Typography>
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Step 2: Shorthand Typing Test
            </Typography>
            {renderShortcuts()}
            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Type the same text using shortcuts:
              </Typography>
              {renderHighlightedText(targetText, expandText(shorthandInput))}
            </Paper>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={expandText(shorthandInput)}
              onChange={handleInputChange}
              disabled={finished}
              placeholder="Start typing here (shortcuts will expand as you type)..."
              sx={{ mb: 2 }}
            />
            {started && !finished && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Progress:{" "}
                {Math.round(
                  expandText(shorthandInput).trim() === targetText.trim()
                    ? 100
                    : Math.min(
                        99,
                        (expandText(shorthandInput).trim().length /
                          targetText.trim().length) *
                          100
                      )
                )}
                %
              </Typography>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Test Results
            </Typography>
            <Stack spacing={2}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Normal Typing:
                </Typography>
                <Typography>Words per Minute: {normalResult?.wpm}</Typography>
                <Typography>Accuracy: {normalResult?.accuracy}%</Typography>
                <Typography>
                  Time: {normalResult?.timeInSeconds} seconds
                </Typography>
              </Paper>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Shorthand Typing:
                </Typography>
                <Typography>
                  Words per Minute: {shorthandResult?.wpm}
                </Typography>
                <Typography>Accuracy: {shorthandResult?.accuracy}%</Typography>
                <Typography>
                  Time: {shorthandResult?.timeInSeconds} seconds
                </Typography>
              </Paper>
              {getTimeSaved() && (
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    bgcolor:
                      getTimeSaved()!.seconds > 0
                        ? "success.light"
                        : "error.light",
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Time {getTimeSaved()!.seconds > 0 ? "Saved" : "Increased"}:
                  </Typography>
                  <Typography>
                    {Math.abs(getTimeSaved()!.seconds)} seconds (
                    {getTimeSaved()!.seconds > 0 ? "+" : "-"}
                    {Math.abs(getTimeSaved()!.percentage)}%{" "}
                    {getTimeSaved()!.seconds > 0 ? "faster" : "slower"})
                  </Typography>
                </Paper>
              )}
            </Stack>
            <Button
              variant="contained"
              onClick={() => setStep(3)}
              sx={{ mt: 2 }}
            >
              Continue to Feedback
            </Button>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Quick Feedback
            </Typography>
            <Paper elevation={1} sx={{ p: 2 }}>
              <TextField
                fullWidth
                label="Your Email (optional)"
                type="email"
                value={feedback.email}
                onChange={(e) =>
                  setFeedback((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                sx={{ mb: 2 }}
              />
              <Typography gutterBottom>
                How would you rate your experience with the shorthand typing
                system? (1-10)
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography>1</Typography>
                <Slider
                  value={feedback.rating}
                  onChange={(_, value) =>
                    setFeedback((prev) => ({
                      ...prev,
                      rating: value as number,
                    }))
                  }
                  min={1}
                  max={10}
                  marks
                  valueLabelDisplay="auto"
                  sx={{ flex: 1 }}
                />
                <Typography>10</Typography>
              </Stack>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Any additional comments? (optional)"
                value={feedback.comment}
                onChange={(e) =>
                  setFeedback((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitted}
                sx={{ mr: 2 }}
              >
                Submit Results
              </Button>
              {submitted && (
                <Typography color="success.main" sx={{ mt: 1 }}>
                  ✓ Results submitted successfully!
                </Typography>
              )}
              {submitted && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setStep(0);
                    resetTest();
                    setNormalResult(null);
                    setShorthandResult(null);
                    setFeedback({ rating: 5, comment: "", email: "" });
                    setSubmitted(false);
                  }}
                  sx={{ mt: 2 }}
                >
                  Start New Test
                </Button>
              )}
            </Paper>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Stepper activeStep={step} sx={{ mb: 4 }}>
        <Step>
          <StepLabel>Normal Test</StepLabel>
        </Step>
        <Step>
          <StepLabel>Shorthand Test</StepLabel>
        </Step>
        <Step>
          <StepLabel>Results</StepLabel>
        </Step>
        <Step>
          <StepLabel>Feedback</StepLabel>
        </Step>
      </Stepper>
      {renderStepContent()}
      {renderTimer()}
    </Box>
  );
};

export default TypingTest;
