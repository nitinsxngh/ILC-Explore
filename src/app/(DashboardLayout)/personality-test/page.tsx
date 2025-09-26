"use client";

import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  useTheme,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconBrain,
  IconScale,
  IconDrone,
  IconSettings,
  IconBriefcase,
  IconCurrencyDollar,
} from "@tabler/icons-react";

const questions = [
  "I enjoy solving complex problems using logic.",
  "I am interested in understanding laws and how they work.",
  "I love working with flying or robotic machines.",
  "I prefer building things and understanding how machines function.",
  "I am comfortable leading a team or making strategic decisions.",
  "I enjoy working with numbers and analyzing financial trends.",
  "I like writing code or automating tasks.",
  "I am confident in debating or presenting arguments.",
  "I am interested in how businesses operate and grow.",
  "I like thinking creatively and innovating solutions.",
];

const suggestionMap = {
  ai: { icon: <IconBrain size={24} />, label: "Integrated AI Circle" },
  legal: { icon: <IconScale size={24} />, label: "Integrated Legal Circle" },
  drone: { icon: <IconDrone size={24} />, label: "Integrated Drone Circle" },
  engineering: {
    icon: <IconSettings size={24} />,
    label: "Integrated Engineering Circle",
  },
  management: {
    icon: <IconBriefcase size={24} />,
    label: "Integrated Management Circle",
  },
  finance: {
    icon: <IconCurrencyDollar size={24} />,
    label: "Integrated Finance Circle",
  },
};

const PersonalityTest = () => {
  const theme = useTheme();
  const {
    control,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const [step, setStep] = useState(0);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const totalQuestions = questions.length;

  const handleAnswer = async (value: string) => {
    const fieldName = `q${step + 1}`;
    setValue(fieldName, value, { shouldValidate: true });

    const valid = await trigger(fieldName);
    if (!valid) return;

    if (step < totalQuestions - 1) {
      setTimeout(() => {
        setStep((prev) => prev + 1);
      }, 300); // quick transition
    } else {
      // Last question, calculate result
      const data = getValues();
      const scores = {
        ai: Number(data.q1) + Number(data.q7) + Number(data.q10),
        legal: Number(data.q2) + Number(data.q8),
        drone: Number(data.q3),
        engineering: Number(data.q4),
        management: Number(data.q5) + Number(data.q9),
        finance: Number(data.q6),
      };

      const bestFit = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
      setTimeout(() => {
        setSuggestion(bestFit);
      }, 400);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 6 }, minHeight: "80vh" }}>
      <Typography
        variant="h4"
        fontWeight={800}
        textAlign="center"
        mb={4}
        sx={{
          background: "linear-gradient(to right, #00c6ff, #0072ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        🧭 AI-Based Personality Test
      </Typography>

      {suggestion ? (
        <Paper
          elevation={4}
          sx={{
            mt: 4,
            p: 4,
            borderRadius: 4,
            background: "linear-gradient(145deg, #f5f7fa, #e4ecf1)",
            boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Stack alignItems="center" spacing={2}>
            {suggestionMap[suggestion as keyof typeof suggestionMap].icon}
            <Typography variant="h5" fontWeight="bold">
              You are best suited for:
            </Typography>
            <Typography variant="h6" color="primary">
              {
                suggestionMap[suggestion as keyof typeof suggestionMap].label
              }
            </Typography>
          </Stack>
        </Paper>
      ) : (
        <>
          <LinearProgress
            variant="determinate"
            value={((step + 1) / totalQuestions) * 100}
            sx={{ height: 8, borderRadius: 4, mb: 4 }}
          />

          <Stack spacing={4} alignItems="center">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                style={{ width: "100%" }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    maxWidth: 600,
                    mx: "auto",
                  }}
                >
                  <Typography fontWeight={600}>
                    Q{step + 1}. {questions[step]}
                  </Typography>

                  <Controller
                    name={`q${step + 1}`}
                    control={control}
                    rules={{ required: "Please select a rating" }}
                    render={({ field }) => (
                      <>
                        <RadioGroup
                          row
                          value={field.value || ""}
                          onChange={(e) => handleAnswer(e.target.value)}
                        >
                          {[1, 2, 3, 4, 5].map((val) => (
                            <FormControlLabel
                              key={val}
                              value={String(val)}
                              control={<Radio color="primary" />}
                              label={val}
                            />
                          ))}
                        </RadioGroup>
                        {errors[`q${step + 1}`] && (
                          <FormHelperText error>
                            {errors[`q${step + 1}`]?.message?.toString()}
                          </FormHelperText>
                        )}
                      </>
                    )}
                  />
                </Paper>
              </motion.div>
            </AnimatePresence>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default PersonalityTest;
