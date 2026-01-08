"use client";

import React, { useState, useEffect } from "react";
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
  Avatar,
  IconButton,
  Dialog,
  DialogContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  IconCheck,
  IconBuilding,
  IconCircle,
  IconLock,
  IconUser,
} from "@tabler/icons-react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import BlankCard from "@/app/(DashboardLayout)/components/shared/BlankCard";

interface LearningOutcome {
  id: string;
  text: string;
}

interface Course {
  _id?: string;
  id: string;
  mentorName: string;
  mentorTitle: string;
  mentorExperience: string;
  mentorCompany: string;
  mentorshipTopic: string;
  learningOutcomes: LearningOutcome[];
  classType: "Offline" | "Hybrid" | "Online";
  totalSeats: number;
  availableSeats: number;
  cost: number;
  domainId?: string;
}

interface Domain {
  id: string;
  name: string;
  fullName: string;
  courses: Course[];
}

const Courses = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>("ilc");
  const [selectedSeats, setSelectedSeats] = useState<{
    [courseId: string]: number[];
  }>({});
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState<{
    course: Course | null;
    seatNumber: number;
    totalAmount: number;
  }>({
    course: null,
    seatNumber: 0,
    totalAmount: 0,
  });
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const domainList: Omit<Domain, "courses">[] = [
    { id: "ilc", name: "ILC", fullName: "Legal" },
    { id: "ifc", name: "IFC", fullName: "Finance" },
    { id: "iaic", name: "IAIC", fullName: "AI" },
    { id: "idc", name: "IDC", fullName: "Drone" },
    { id: "iec", name: "IEC", fullName: "Engineering" },
    { id: "imc", name: "IMC", fullName: "Management" },
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/courses");
      const data = await response.json();

      if (response.ok) {
        // Transform API courses to match the Course interface
        const transformedCourses: Course[] = (data.courses || []).map((course: any) => ({
          _id: course._id?.toString(),
          id: course._id?.toString() || course.id || Math.random().toString(),
          mentorName: course.mentorName || "Mentor",
          mentorTitle: course.mentorTitle || "",
          mentorExperience: course.mentorExperience || "",
          mentorCompany: course.mentorCompany || "",
          mentorshipTopic: course.mentorshipTopic,
          learningOutcomes: course.learningOutcomes || [],
          classType: course.classType,
          totalSeats: course.totalSeats,
          availableSeats: course.availableSeats,
          cost: course.cost,
          domainId: course.domainId,
        }));
        setAllCourses(transformedCourses);
      } else {
        setError(data.error || "Failed to fetch courses");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  // Group courses by domain
  const domains: Domain[] = domainList.map((domain) => ({
    ...domain,
    courses: allCourses.filter((course) => course.domainId === domain.id),
  }));

  const currentDomain = domains.find((d) => d.id === selectedDomain);
  const currentCourses = currentDomain?.courses || [];

  const handleSeatClick = (course: Course, seatNumber: number) => {
    const isBooked =
      seatNumber <= course.totalSeats - course.availableSeats;
    const isFullyBooked = course.availableSeats === 0;
    const courseSelectedSeats = selectedSeats[course.id] || [];
    const isSelected = courseSelectedSeats.includes(seatNumber);

    // If seat is already booked or selected, don't do anything
    if (isBooked || isFullyBooked || isSelected) {
      return;
    }

    // Open payment modal
    setSelectedCourseForPayment({
      course: course,
      seatNumber: seatNumber,
      totalAmount: course.cost,
    });
    setPaymentModalOpen(true);
  };

  const handleProceedToPay = () => {
    // Add the seat to selected seats
    if (selectedCourseForPayment.course) {
      setSelectedSeats((prev) => {
        const courseSeats = prev[selectedCourseForPayment.course!.id] || [];
        if (!courseSeats.includes(selectedCourseForPayment.seatNumber)) {
          return {
            ...prev,
            [selectedCourseForPayment.course!.id]: [
              ...courseSeats,
              selectedCourseForPayment.seatNumber,
            ],
          };
        }
        return prev;
      });
    }

    // Close modal and handle payment (integrate with payment gateway)
    setPaymentModalOpen(false);
    // TODO: Integrate with payment gateway here
    console.log("Proceeding to payment for:", selectedCourseForPayment);
  };

  const handleCancelPayment = () => {
    setPaymentModalOpen(false);
    setSelectedCourseForPayment({
      course: null,
      seatNumber: 0,
      totalAmount: 0,
    });
  };

  const getSeatColor = (
    course: Course,
    seatNumber: number,
    selectedSeats: number[]
  ) => {
    if (selectedSeats.includes(seatNumber)) {
      return "#6366f1"; // Selected - dark purple
    }
    if (seatNumber <= course.totalSeats - course.availableSeats) {
      return "#9ca3af"; // Booked - grey
    }
    return "#e5e7eb"; // Available - light grey
  };

  const getSeatIconColor = (
    course: Course,
    seatNumber: number,
    selectedSeats: number[]
  ) => {
    if (selectedSeats.includes(seatNumber)) {
      return "#ffffff"; // Selected - white icon
    }
    if (seatNumber <= course.totalSeats - course.availableSeats) {
      return "#ffffff"; // Booked - white icon
    }
    return "#9ca3af"; // Available - grey icon (will change on hover via CSS)
  };

  const getClassTypeColor = (classType: string) => {
    switch (classType) {
      case "Offline":
        return "#f97316"; // Orange
      case "Hybrid":
        return "#6366f1"; // Purple
      case "Online":
        return "#10b981"; // Green
      default:
        return "#6b7280"; // Grey
    }
  };

  const getClassTypeDotColor = (classType: string) => {
    switch (classType) {
      case "Offline":
        return "#ea580c"; // Dark orange
      case "Hybrid":
        return "#4f46e5"; // Dark purple
      case "Online":
        return "#059669"; // Dark green
      default:
        return "#4b5563"; // Dark grey
    }
  };

  return (
    <PageContainer title="Courses">
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Courses
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Explore mentorship programs across different domains
          </Typography>
        </Box>

        {/* Domain Navigation */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            mb: 4,
          }}
        >
          {domainList.map((domain) => {
            const domainCourses = domains.find((d) => d.id === domain.id)?.courses || [];
            return (
              <Button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id)}
                variant={selectedDomain === domain.id ? "contained" : "outlined"}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor:
                    selectedDomain === domain.id ? "#6366f1" : "transparent",
                  color:
                    selectedDomain === domain.id
                      ? "white"
                      : "text.primary",
                  borderColor: selectedDomain === domain.id ? "#6366f1" : "divider",
                  "&:hover": {
                    bgcolor:
                      selectedDomain === domain.id ? "#4f46e5" : "action.hover",
                    borderColor: "#6366f1",
                  },
                }}
              >
                {domain.name} ({domain.fullName})
                {domainCourses.length > 0 && (
                  <Chip
                    label={domainCourses.length}
                    size="small"
                    sx={{
                      ml: 1,
                      height: 20,
                      fontSize: "0.7rem",
                      bgcolor: selectedDomain === domain.id ? "rgba(255,255,255,0.2)" : "#f3f4f6",
                      color: selectedDomain === domain.id ? "white" : "text.secondary",
                    }}
                  />
                )}
              </Button>
            );
          })}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Courses Grid */}
            {currentCourses.length > 0 && (
              <Grid container spacing={3}>
                {currentCourses.map((course) => {
                  const courseSelectedSeats = selectedSeats[course.id] || [];
                  const isFullyBooked = course.availableSeats === 0;

                  return (
              <Grid item xs={12} md={6} key={course.id}>
                <BlankCard>
                  <CardContent sx={{ p: 3 }}>
                    {/* Mentor Information */}
                    <Stack direction="row" spacing={2} alignItems="flex-start" mb={3}>
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: "#6366f1",
                          fontSize: "1.5rem",
                          fontWeight: 600,
                        }}
                      >
                        {course.mentorName.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                          {course.mentorName}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          <Typography
                            variant="body2"
                            sx={{ color: "#2563eb", fontWeight: 500 }}
                          >
                            {course.mentorTitle}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            •
                          </Typography>
                          <Chip
                            label={course.mentorExperience}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.7rem",
                              bgcolor: "#f3f4f6",
                              color: "text.secondary",
                            }}
                          />
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                          mt={0.5}
                        >
                          <IconBuilding size={14} color="#6b7280" />
                          <Typography variant="body2" color="textSecondary">
                            {course.mentorCompany}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>

                    {/* Mentorship Topic */}
                    <Box mb={3}>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                      >
                        MENTORSHIP TOPIC
                      </Typography>
                      <Typography variant="h5" fontWeight={700} mt={0.5}>
                        {course.mentorshipTopic}
                      </Typography>
                    </Box>

                    {/* What You Will Learn */}
                    <Box mb={3}>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                        gutterBottom
                        display="block"
                      >
                        WHAT YOU WILL LEARN
                      </Typography>
                      <Stack spacing={1}>
                        {course.learningOutcomes.map((outcome) => (
                          <Stack
                            key={outcome.id}
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <IconCheck
                              size={18}
                              color="#10b981"
                              style={{ flexShrink: 0 }}
                            />
                            <Typography variant="body2">
                              {outcome.text}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Box>

                    {/* Class Type */}
                    <Box mb={3}>
                      <Chip
                        icon={
                          <IconCircle
                            size={12}
                            fill={getClassTypeDotColor(course.classType)}
                            color={getClassTypeDotColor(course.classType)}
                          />
                        }
                        label={course.classType + " Class"}
                        sx={{
                          bgcolor: getClassTypeColor(course.classType),
                          color: "white",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          height: 24,
                          "& .MuiChip-icon": {
                            color: "white",
                          },
                        }}
                      />
                    </Box>

                    {/* Seat Selection & Cost */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-end"
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                          display="block"
                          mb={1}
                        >
                          SELECT A SEAT
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          {Array.from({ length: course.totalSeats }).map(
                            (_, index) => {
                              const seatNumber = index + 1;
                              const isBooked =
                                seatNumber <=
                                course.totalSeats - course.availableSeats;
                              const isSelected =
                                courseSelectedSeats.includes(seatNumber);
                              const seatColor = getSeatColor(
                                course,
                                seatNumber,
                                courseSelectedSeats
                              );
                              const iconColor = getSeatIconColor(
                                course,
                                seatNumber,
                                courseSelectedSeats
                              );

                              return (
                                <Box
                                  key={seatNumber}
                                  onClick={() => {
                                    if (!isBooked && !isFullyBooked) {
                                      handleSeatClick(course, seatNumber);
                                    }
                                  }}
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,
                                    bgcolor: seatColor,
                                    cursor:
                                      isBooked || isFullyBooked
                                        ? "not-allowed"
                                        : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.2s ease",
                                    opacity: isBooked ? 0.6 : 1,
                                    border: isSelected
                                      ? "2px solid #4f46e5"
                                      : "2px solid transparent",
                                    "&:hover": {
                                      transform:
                                        isBooked || isFullyBooked
                                          ? "none"
                                          : "scale(1.15)",
                                      bgcolor:
                                        isBooked || isFullyBooked
                                          ? seatColor
                                          : isSelected
                                          ? "#6366f1"
                                          : "#f3f4f6",
                                      boxShadow:
                                        isBooked || isFullyBooked
                                          ? "none"
                                          : "0 2px 8px rgba(99, 102, 241, 0.3)",
                                    },
                                    "&:hover svg path": {
                                      stroke: isBooked ? iconColor : "#6366f1",
                                    },
                                    "&:hover .seat-icon": {
                                      color: isBooked ? iconColor : "#6366f1",
                                    },
                                    "&:hover > div": {
                                      "& path": {
                                        stroke: isBooked ? iconColor : "#6366f1",
                                      },
                                    },
                                  }}
                                >
                                  {isBooked ? (
                                    <IconUser
                                      size={20}
                                      color={iconColor}
                                      className="seat-icon"
                                      style={{
                                        transition: "color 0.2s ease",
                                      }}
                                    />
                                  ) : (
                                    <Box
                                      component="svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      sx={{
                                        "& path": {
                                          stroke: iconColor,
                                          transition: "stroke 0.2s ease",
                                        },
                                      }}
                                    >
                                      <path
                                        d="M7 18V21C7 21.5523 7.44772 22 8 22H16C16.5523 22 17 21.5523 17 21V18"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M5 10V16C5 17.1046 5.89543 18 7 18H17C18.1046 18 19 17.1046 19 16V10"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M7 10V6C7 4.89543 7.89543 4 9 4H15C16.1046 4 17 4.89543 17 6V10"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </Box>
                                  )}
                                </Box>
                              );
                            }
                          )}
                        </Stack>
                      </Box>

                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                          display="block"
                        >
                          COST
                        </Typography>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          sx={{ color: "#1f2937" }}
                        >
                          ₹{course.cost.toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Book Button */}
                    {courseSelectedSeats.length > 0 && (
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          mt: 3,
                          py: 1.5,
                          borderRadius: 2,
                          bgcolor: "#6366f1",
                          "&:hover": {
                            bgcolor: "#4f46e5",
                          },
                        }}
                        onClick={() => {
                          // Handle booking logic here
                          alert(
                            `Booking ${courseSelectedSeats.length} seat(s) for ${course.mentorshipTopic}`
                          );
                        }}
                      >
                        Book {courseSelectedSeats.length} Seat
                        {courseSelectedSeats.length > 1 ? "s" : ""} - ₹
                        {(course.cost * courseSelectedSeats.length).toLocaleString()}
                      </Button>
                    )}
                  </CardContent>
                </BlankCard>
              </Grid>
                  );
                })}
              </Grid>
            )}

            {currentCourses.length === 0 && (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  px: 3,
                }}
              >
                <Typography variant="h5" fontWeight={600} color="textSecondary" gutterBottom>
                  No courses available
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  There are no courses available for {currentDomain?.name} ({currentDomain?.fullName}) domain yet.
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Check back later or explore other domains.
                </Typography>
              </Box>
            )}

            {allCourses.length === 0 && (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  px: 3,
                }}
              >
                <Typography variant="h5" fontWeight={600} color="textSecondary" gutterBottom>
                  No courses available
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  No courses have been created yet. Mentors can create courses to get started.
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* Payment Modal */}
        <Dialog
          open={paymentModalOpen}
          onClose={handleCancelPayment}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              position: "relative",
              overflow: "visible",
            },
          }}
        >
          {/* Gradient Border at Top */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: "linear-gradient(90deg, #6366f1 0%, #ec4899 100%)",
              borderRadius: "12px 12px 0 0",
            }}
          />
          
          <DialogContent sx={{ p: 4, pt: 5 }}>
            <Stack spacing={3} alignItems="center">
              {/* Lock Icon */}
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "#ede9fe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconLock size={32} color="#6366f1" />
              </Box>

              {/* Title */}
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ color: "#1f2937", textAlign: "center" }}
              >
                Secure Your Seat
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{ color: "#6b7280", textAlign: "center", maxWidth: 400 }}
              >
                You are about to book a mentorship slot. Complete the payment of{" "}
                <Typography
                  component="span"
                  variant="body1"
                  fontWeight={700}
                  sx={{ color: "#1f2937" }}
                >
                  ₹{selectedCourseForPayment.totalAmount.toLocaleString()}
                </Typography>{" "}
                to proceed.
              </Typography>

              {/* Buttons */}
              <Stack spacing={2} sx={{ width: "100%", mt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleProceedToPay}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: "#6366f1",
                    color: "white",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      bgcolor: "#4f46e5",
                    },
                  }}
                >
                  Proceed to Pay ₹{selectedCourseForPayment.totalAmount.toLocaleString()}
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleCancelPayment}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    borderColor: "#e5e7eb",
                    color: "#1f2937",
                    fontWeight: 500,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      borderColor: "#d1d5db",
                      bgcolor: "#f9fafb",
                    },
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </DialogContent>
        </Dialog>
      </Container>
    </PageContainer>
  );
};

export default Courses;

