"use client"; // Ensures this runs as a Client Component

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CardContent,
  Typography,
  Grid,
  Tooltip,
  Fab,
  Avatar,
  Button,
  Box,
  Container,
} from "@mui/material";
import { Stack } from "@mui/system";
import { IconFileText } from "@tabler/icons-react";
import BlankCard from "@/app/(DashboardLayout)/components/shared/BlankCard";

interface LibraryAsset {
  _id: { $oid: string };
  category: string;
  name: string;
  description: string;
  price: number;
  fileUrl: string;
}

const Library = () => {
  const [assets, setAssets] = useState<LibraryAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(4); // Show 4 items initially

  // Fetch assets from API
  useEffect(() => {
    fetch("https://api.ilc.limited/api/library/assets")
      .then((response) => response.json())
      .then((data: LibraryAsset[]) => {
        setAssets(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching library assets:", error);
        setError("Failed to load assets");
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      {/* Header Section - Title aligned to the left */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Library
        </Typography>
      </Box>

      {/* Grid for Assets */}
      <Grid container spacing={3}>
        {loading ? (
          <Typography variant="h6" align="center">
            Loading...
          </Typography>
        ) : error ? (
          <Typography variant="h6" align="center" color="error">
            {error}
          </Typography>
        ) : (
          assets.slice(0, visibleCount).map((asset) => (
            <Grid item xs={12} md={4} lg={3} key={asset._id.$oid || asset.name}>
              <BlankCard>
                {/* If the asset is free, wrap the card in a Link to the file */}
                <Link href={asset.price === 0 ? asset.fileUrl : `/purchase/${asset._id.$oid}`} passHref>
                  <Box sx={{ cursor: "pointer" }}>
                    {/* PDF Preview */}
                    {asset.price > 0 ? (
                      <Box sx={{ position: "relative", height: 250, width: "100%" }}>
                        <Avatar
                          variant="square"
                          sx={{
                            height: "100%",
                            width: "100%",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              color: "white",
                              fontWeight: "bold",
                              textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                            }}
                          >
                            Locked
                          </Typography>
                        </Avatar>
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="h6" color="white">
                            Purchase to unlock the PDF
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      // For free assets, show PDF directly
                      <Avatar
                        variant="square"
                        sx={{
                          height: 250,
                          width: "100%",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <embed
                          src={asset.fileUrl}
                          type="application/pdf"
                          width="100%"
                          height="100%"
                          style={{ objectFit: "contain" }}
                        />
                      </Avatar>
                    )}

                    {/* Tooltip for Viewing */}
                    <Tooltip title="View PDF">
                      <Fab
                        size="small"
                        color="primary"
                        sx={{
                          position: "absolute",
                          bottom: "15px",
                          right: "15px",
                        }}
                      >
                        <IconFileText size="16" />
                      </Fab>
                    </Tooltip>
                  </Box>
                </Link>

                {/* Asset Details */}
                <CardContent sx={{ p: 3, pt: 2 }}>
                  <Typography variant="h6">{asset.name}</Typography>
                  <Typography color="textSecondary" variant="body2" mt={1}>
                    {asset.description}
                  </Typography>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
                    <Typography variant="h6">
                      {asset.price === 0 ? "FREE" : `₹${asset.price}`}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      {asset.category}
                    </Typography>
                  </Stack>
                </CardContent>
              </BlankCard>
            </Grid>
          ))
        )}
      </Grid>

      {/* See More Button - Aligned to Left */}
      {visibleCount < assets.length && (
        <Grid container sx={{ mt: 3 }}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Button variant="contained" onClick={() => setVisibleCount(visibleCount + 4)}>
              See More
            </Button>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Library;
