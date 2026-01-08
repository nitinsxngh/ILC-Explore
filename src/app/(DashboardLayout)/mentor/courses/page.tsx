"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Stack,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import Link from "next/link";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import MentorGuard from "@/components/MentorGuard";
import BlankCard from "@/app/(DashboardLayout)/components/shared/BlankCard";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";

interface LearningOutcome {
  id: string;
  text: string;
}

interface Course {
  _id?: string;
  mentorId: string;
  domainId: string;
  mentorshipTopic: string;
  learningOutcomes: LearningOutcome[];
  classType: "Offline" | "Hybrid" | "Online";
  totalSeats: number;
  availableSeats: number;
  cost: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const domains = [
  { id: "ilc", name: "ILC", fullName: "Legal" },
  { id: "ifc", name: "IFC", fullName: "Finance" },
  { id: "iaic", name: "IAIC", fullName: "AI" },
  { id: "idc", name: "IDC", fullName: "Drone" },
  { id: "iec", name: "IEC", fullName: "Engineering" },
  { id: "imc", name: "IMC", fullName: "Management" },
];

const MentorCoursesPage = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    domainId: "",
    mentorshipTopic: "",
    learningOutcomes: [{ id: "1", text: "" }],
    classType: "Offline" as "Offline" | "Hybrid" | "Online",
    totalSeats: "4",
    cost: "",
  });

  const fetchCourses = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/courses?mentorId=${user.uid}`);
      const data = await response.json();

      if (response.ok) {
        setCourses(data.courses || []);
      } else {
        setError(data.error || "Failed to fetch courses");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user, fetchCourses]);

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        domainId: course.domainId,
        mentorshipTopic: course.mentorshipTopic,
        learningOutcomes: course.learningOutcomes.length > 0
          ? course.learningOutcomes
          : [{ id: "1", text: "" }],
        classType: course.classType,
        totalSeats: course.totalSeats.toString(),
        cost: course.cost.toString(),
      });
    } else {
      setEditingCourse(null);
      setFormData({
        domainId: "",
        mentorshipTopic: "",
        learningOutcomes: [{ id: "1", text: "" }],
        classType: "Offline",
        totalSeats: "4",
        cost: "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCourse(null);
  };

  const handleAddLearningOutcome = () => {
    setFormData({
      ...formData,
      learningOutcomes: [
        ...formData.learningOutcomes,
        { id: Date.now().toString(), text: "" },
      ],
    });
  };

  const handleRemoveLearningOutcome = (id: string) => {
    if (formData.learningOutcomes.length > 1) {
      setFormData({
        ...formData,
        learningOutcomes: formData.learningOutcomes.filter((lo) => lo.id !== id),
      });
    }
  };

  const handleLearningOutcomeChange = (id: string, text: string) => {
    setFormData({
      ...formData,
      learningOutcomes: formData.learningOutcomes.map((lo) =>
        lo.id === id ? { ...lo, text } : lo
      ),
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate form
      if (!formData.domainId || !formData.mentorshipTopic || !formData.cost) {
        setError("Please fill in all required fields");
        return;
      }

      const validOutcomes = formData.learningOutcomes.filter((lo) => lo.text.trim());
      if (validOutcomes.length === 0) {
        setError("Please add at least one learning outcome");
        return;
      }

      setError(null);

      const coursePayload = {
        mentorId: user?.uid,
        domainId: formData.domainId,
        mentorshipTopic: formData.mentorshipTopic,
        learningOutcomes: validOutcomes,
        classType: formData.classType,
        totalSeats: formData.totalSeats,
        cost: formData.cost,
      };

      let response;
      if (editingCourse) {
        // Update course
        response = await fetch("/api/courses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: editingCourse._id,
            ...coursePayload,
          }),
        });
      } else {
        // Create course
        response = await fetch("/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(coursePayload),
        });
      }

      const data = await response.json();

      if (response.ok) {
        handleCloseDialog();
        fetchCourses();
      } else {
        setError(data.error || "Failed to save course");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save course");
    }
  };

  const handleDeleteClick = (courseId: string) => {
    setCourseToDelete(courseId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete || !user) return;

    try {
      const response = await fetch(
        `/api/courses?courseId=${courseToDelete}&mentorId=${user.uid}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (response.ok) {
        setDeleteDialogOpen(false);
        setCourseToDelete(null);
        fetchCourses();
      } else {
        setError(data.error || "Failed to delete course");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete course");
    }
  };

  const getDomainName = (domainId: string) => {
    const domain = domains.find((d) => d.id === domainId);
    return domain ? `${domain.name} (${domain.fullName})` : domainId;
  };

  const getClassTypeColor = (classType: string) => {
    switch (classType) {
      case "Offline":
        return "#f97316";
      case "Hybrid":
        return "#6366f1";
      case "Online":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  return (
    <MentorGuard>
      <PageContainer title="Manage Courses" description="Create and manage your courses">
        <Container>
          <Box sx={{ my: 4 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  My Courses
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Create, update, and manage your mentorship courses
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<IconPlus size={20} />}
                onClick={() => handleOpenDialog()}
                sx={{
                  bgcolor: "#6366f1",
                  "&:hover": { bgcolor: "#4f46e5" },
                }}
              >
                Create New Course
              </Button>
            </Stack>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : courses.length === 0 ? (
              <Card sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No courses yet
                </Typography>
                <Typography variant="body2" color="textSecondary" mb={3}>
                  Create your first course to start mentoring students
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<IconPlus size={20} />}
                  onClick={() => handleOpenDialog()}
                >
                  Create Your First Course
                </Button>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {courses.map((course) => (
                  <Grid item xs={12} md={6} key={course._id}>
                    <BlankCard>
                      <CardContent sx={{ p: 3 }}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          mb={2}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Chip
                              label={getDomainName(course.domainId)}
                              size="small"
                              sx={{ mb: 1 }}
                            />
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              {course.mentorshipTopic}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                              <Chip
                                label={course.classType}
                                size="small"
                                sx={{
                                  bgcolor: getClassTypeColor(course.classType),
                                  color: "white",
                                  fontSize: "0.75rem",
                                }}
                              />
                              <Typography variant="body2" color="textSecondary">
                                {course.availableSeats}/{course.totalSeats} seats available
                              </Typography>
                            </Stack>
                          </Box>
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(course)}
                              sx={{ color: "#6366f1" }}
                            >
                              <IconEdit size={18} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(course._id!)}
                              sx={{ color: "#ef4444" }}
                            >
                              <IconTrash size={18} />
                            </IconButton>
                          </Stack>
                        </Stack>

                        <Box mb={2}>
                          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Learning Outcomes:
                          </Typography>
                          <Stack spacing={0.5}>
                            {course.learningOutcomes.map((outcome) => (
                              <Stack
                                key={outcome.id}
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <IconCheck size={16} color="#10b981" />
                                <Typography variant="body2">{outcome.text}</Typography>
                              </Stack>
                            ))}
                          </Stack>
                        </Box>

                        <Typography variant="h5" fontWeight={700} color="primary">
                          ₹{course.cost.toLocaleString()}
                        </Typography>
                      </CardContent>
                    </BlankCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {/* Create/Edit Course Dialog */}
          <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>
              {editingCourse ? "Edit Course" : "Create New Course"}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 1 }}>
                <TextField
                  select
                  label="Domain"
                  value={formData.domainId}
                  onChange={(e) =>
                    setFormData({ ...formData, domainId: e.target.value })
                  }
                  required
                  fullWidth
                >
                  {domains.map((domain) => (
                    <MenuItem key={domain.id} value={domain.id}>
                      {domain.name} ({domain.fullName})
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Mentorship Topic"
                  value={formData.mentorshipTopic}
                  onChange={(e) =>
                    setFormData({ ...formData, mentorshipTopic: e.target.value })
                  }
                  required
                  fullWidth
                  placeholder="e.g., Corporate Law Fundamentals"
                />

                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="subtitle2">Learning Outcomes</Typography>
                    <Button
                      size="small"
                      startIcon={<IconPlus size={16} />}
                      onClick={handleAddLearningOutcome}
                    >
                      Add
                    </Button>
                  </Stack>
                  <Stack spacing={1}>
                    {formData.learningOutcomes.map((outcome) => (
                      <Stack
                        key={outcome.id}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <TextField
                          fullWidth
                          size="small"
                          value={outcome.text}
                          onChange={(e) =>
                            handleLearningOutcomeChange(outcome.id, e.target.value)
                          }
                          placeholder="Enter learning outcome"
                        />
                        {formData.learningOutcomes.length > 1 && (
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveLearningOutcome(outcome.id)}
                            sx={{ color: "#ef4444" }}
                          >
                            <IconX size={18} />
                          </IconButton>
                        )}
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                <TextField
                  select
                  label="Class Type"
                  value={formData.classType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      classType: e.target.value as "Offline" | "Hybrid" | "Online",
                    })
                  }
                  required
                  fullWidth
                >
                  <MenuItem value="Offline">Offline</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                  <MenuItem value="Online">Online</MenuItem>
                </TextField>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Total Seats"
                      type="number"
                      value={formData.totalSeats}
                      onChange={(e) =>
                        setFormData({ ...formData, totalSeats: e.target.value })
                      }
                      required
                      fullWidth
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Cost (₹)"
                      type="number"
                      value={formData.cost}
                      onChange={(e) =>
                        setFormData({ ...formData, cost: e.target.value })
                      }
                      required
                      fullWidth
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }}
              >
                {editingCourse ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this course? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </PageContainer>
    </MentorGuard>
  );
};

export default MentorCoursesPage;

