"use client"; // Ensures this runs as a Client Component

import { useEffect, useState } from "react";
import { Typography, Box, Grid, Button, Card, CardContent, CardMedia } from "@mui/material";
import Link from "next/link";

// Define the Blog type
interface Blog {
  _id: { $oid: string };
  img: string;
  category: string;
  title: string;
  description: string;
  body: string;
  keywords: string[];
  timestamp: { $date: { $numberLong: string } };
}

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the blogs data from your API
    fetch("https://api.ilc.limited/api/blogs") // Assuming this is the correct endpoint
      .then((response) => response.json())
      .then((data: Blog[]) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        All Blogs
      </Typography>

      {/* Check if loading */}
      {loading ? (
        <Typography variant="h6" align="center">
          Loading...
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {/* Map through the blogs array and render each blog */}
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog._id.$oid}>
              <Card
                sx={{
                  height: "100%",
                  boxShadow: 3, // Card shadow
                  borderRadius: 2, // Rounded corners
                  transition: "box-shadow 0.3s ease", // No scaling effect, just transition for shadow
                  "&:hover": {
                    boxShadow: 6, // Hover shadow effect
                  },
                }}
              >
                <CardMedia
                  component="img"
                  alt={blog.title}
                  height="200"
                  image={blog.img}
                  title={blog.title}
                  sx={{
                    borderTopLeftRadius: 2, // Rounded top corners for the image
                    borderTopRightRadius: 2,
                    objectFit: "cover", // Ensure the image fits well in the card
                  }}
                />
                <CardContent sx={{ padding: 3 }}>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                    {blog.description}
                  </Typography>
                  <Link href={`/blog/${blog._id.$oid}`} passHref>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        padding: "10px 0",
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: "#0069d9", // Customize hover color
                        },
                      }}
                    >
                      Read More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Blogs;
