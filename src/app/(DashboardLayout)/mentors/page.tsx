"use client"; // Ensures this runs as a Client Component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Button,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

// Define the Mentor type
interface Mentor {
  _id: { $oid: string };
  img: string;
  name: string;
  email: string;
  jobTitle?: string;
}

// Function to partially hide the email address
const maskEmail = (email: string) => {
  const [username, domain] = email.split("@");
  const maskedUsername = username.slice(0, 3) + "***"; // Mask all but first 3 characters
  return `${maskedUsername}@${domain}`;
};

const Mentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAll, setShowAll] = useState<boolean>(false); // State to control showing all mentors
  const router = useRouter(); // Initialize router for navigation
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen is mobile

  // Fetch mentor data from API
  useEffect(() => {
    fetch("https://api.ilc.limited/api/mentors")
      .then((response) => response.json())
      .then((data: Mentor[]) => {
        setMentors(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching mentor data:", error);
        setLoading(false);
      });
  }, []);

  // Handle Explore More Button Click
  const handleExploreMore = () => {
    setShowAll(true); // Set to true to show all mentors
  };

  return (
    <DashboardCard title="Top Mentors">
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        {loading ? (
          <Typography variant="h6" align="center">
            Loading...
          </Typography>
        ) : (
          <>
            <Table aria-label="mentor table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Profile
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Name
                    </Typography>
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Email
                      </Typography>
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Job Title
                      </Typography>
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {mentors.slice(0, showAll ? mentors.length : 5).map((mentor) => (
                  <TableRow key={mentor._id.$oid}>
                    <TableCell>
                      <Avatar src={mentor.img} alt={mentor.name} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {mentor.name}
                      </Typography>
                      {isMobile && (
                        <Typography variant="body2" color="textSecondary">
                          {mentor.jobTitle || "N/A"}
                        </Typography>
                      )}
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                          {maskEmail(mentor.email)} {/* Masked email */}
                        </Typography>
                      </TableCell>
                    )}
                    {!isMobile && (
                      <TableCell>
                        <Chip
                          sx={{ px: "4px", backgroundColor: "primary.main", color: "#fff" }}
                          size="small"
                          label={mentor.jobTitle || "N/A"}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Centered Explore More Button */}
            {!showAll && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleExploreMore}>
                  Explore More
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </DashboardCard>
  );
};

export default Mentors;
