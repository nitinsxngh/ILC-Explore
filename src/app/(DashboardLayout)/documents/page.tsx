"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Paper,
  Stack,
  Chip,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  IconUpload,
  IconFile,
  IconX,
  IconCheck,
  IconFileText,
  IconCertificate,
  IconTrophy,
} from "@tabler/icons-react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import BlankCard from "@/app/(DashboardLayout)/components/shared/BlankCard";

interface DocumentFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  uploadProgress?: number;
  status?: "pending" | "uploading" | "success" | "error";
}

interface DocumentCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  acceptedTypes: string[];
  maxSize: number; // in MB
  documents: DocumentFile[];
}

const Documents = () => {
  const [categories, setCategories] = useState<DocumentCategory[]>([
    {
      id: "tenth",
      title: "10th Marksheet",
      description: "Upload your 10th standard marksheet",
      icon: <IconFileText size={32} />,
      acceptedTypes: [".pdf", ".jpg", ".jpeg", ".png"],
      maxSize: 5,
      documents: [],
    },
    {
      id: "twelfth",
      title: "12th Marksheet",
      description: "Upload your 12th standard marksheet",
      icon: <IconFileText size={32} />,
      acceptedTypes: [".pdf", ".jpg", ".jpeg", ".png"],
      maxSize: 5,
      documents: [],
    },
    {
      id: "graduation",
      title: "Graduation Marksheet",
      description: "Upload your graduation degree marksheet",
      icon: <IconFileText size={32} />,
      acceptedTypes: [".pdf", ".jpg", ".jpeg", ".png"],
      maxSize: 5,
      documents: [],
    },
    {
      id: "certificates",
      title: "Certificates",
      description: "Upload your certificates and credentials",
      icon: <IconCertificate size={32} />,
      acceptedTypes: [".pdf", ".jpg", ".jpeg", ".png"],
      maxSize: 10,
      documents: [],
    },
    {
      id: "achievements",
      title: "Achievements",
      description: "Upload your achievements and awards",
      icon: <IconTrophy size={32} />,
      acceptedTypes: [".pdf", ".jpg", ".jpeg", ".png"],
      maxSize: 10,
      documents: [],
    },
  ]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleFileSelect = (
    categoryId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    const newDocuments: DocumentFile[] = Array.from(files).map((file) => {
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      const isValidType = category.acceptedTypes.includes(fileExtension);
      const isValidSize = file.size <= category.maxSize * 1024 * 1024;

      return {
        id: Math.random().toString(36).substring(7),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: isValidType && isValidSize ? "pending" : "error",
      };
    });

    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, documents: [...cat.documents, ...newDocuments] }
          : cat
      )
    );

    // Reset input
    event.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (
    categoryId: string,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    const newDocuments: DocumentFile[] = Array.from(files).map((file) => {
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      const isValidType = category.acceptedTypes.includes(fileExtension);
      const isValidSize = file.size <= category.maxSize * 1024 * 1024;

      return {
        id: Math.random().toString(36).substring(7),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: isValidType && isValidSize ? "pending" : "error",
      };
    });

    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, documents: [...cat.documents, ...newDocuments] }
          : cat
      )
    );
  };

  const handleRemoveFile = (categoryId: string, documentId: string) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              documents: cat.documents.filter((doc) => doc.id !== documentId),
            }
          : cat
      )
    );
  };

  const handleUpload = async (categoryId: string, documentId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    const document = category?.documents.find((doc) => doc.id === documentId);

    if (!document || document.status === "error") return;

    // Update status to uploading
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              documents: cat.documents.map((doc) =>
                doc.id === documentId
                  ? { ...doc, status: "uploading", uploadProgress: 0 }
                  : doc
              ),
            }
          : cat
      )
    );

    // Simulate upload progress (replace with actual upload logic)
    const simulateUpload = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  documents: cat.documents.map((doc) =>
                    doc.id === documentId
                      ? { ...doc, uploadProgress: progress }
                      : doc
                  ),
                }
              : cat
          )
        );

        if (progress >= 100) {
          clearInterval(interval);
          setCategories((prevCategories) =>
            prevCategories.map((cat) =>
              cat.id === categoryId
                ? {
                    ...cat,
                    documents: cat.documents.map((doc) =>
                      doc.id === documentId
                        ? { ...doc, status: "success", uploadProgress: 100 }
                        : doc
                    ),
                  }
                : cat
            )
          );
        }
      }, 200);
    };

    simulateUpload();
  };

  const handleUploadAll = async (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    category.documents.forEach((doc) => {
      if (doc.status === "pending") {
        handleUpload(categoryId, doc.id);
      }
    });
  };

  return (
    <PageContainer title="Documents">
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Documents
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Upload and manage your academic documents, certificates, and achievements
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} md={6} key={category.id}>
              <BlankCard>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "primary.light",
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {category.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {category.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {category.description}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Upload Area */}
                  <Paper
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(category.id, e)}
                    sx={{
                      p: 3,
                      border: "2px dashed",
                      borderColor: "divider",
                      borderRadius: 2,
                      textAlign: "center",
                      bgcolor: "action.hover",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "action.selected",
                      },
                    }}
                  >
                    <input
                      type="file"
                      id={`file-input-${category.id}`}
                      style={{ display: "none" }}
                      multiple
                      accept={category.acceptedTypes.join(",")}
                      onChange={(e) => handleFileSelect(category.id, e)}
                    />
                    <label htmlFor={`file-input-${category.id}`}>
                      <Stack
                        spacing={2}
                        alignItems="center"
                        sx={{ cursor: "pointer" }}
                      >
                        <IconUpload size={48} color="#666" />
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            Click to upload or drag and drop
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {category.acceptedTypes.join(", ").toUpperCase()} (Max{" "}
                            {category.maxSize}MB)
                          </Typography>
                        </Box>
                      </Stack>
                    </label>
                  </Paper>

                  {/* Uploaded Files List */}
                  {category.documents.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Stack spacing={1}>
                        {category.documents.map((doc) => (
                          <Paper
                            key={doc.id}
                            sx={{
                              p: 2,
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 1,
                              bgcolor:
                                doc.status === "error"
                                  ? "error.light"
                                  : doc.status === "success"
                                  ? "success.light"
                                  : "background.paper",
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                                <IconFile size={24} />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography
                                    variant="body2"
                                    fontWeight={500}
                                    noWrap
                                  >
                                    {doc.name}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {formatFileSize(doc.size)}
                                  </Typography>
                                </Box>
                              </Stack>

                              <Stack direction="row" spacing={1} alignItems="center">
                                {doc.status === "error" && (
                                  <Chip
                                    label="Invalid"
                                    color="error"
                                    size="small"
                                  />
                                )}
                                {doc.status === "uploading" && (
                                  <Box sx={{ width: 100 }}>
                                    <LinearProgress
                                      variant="determinate"
                                      value={doc.uploadProgress || 0}
                                    />
                                  </Box>
                                )}
                                {doc.status === "success" && (
                                  <Chip
                                    icon={<IconCheck size={16} />}
                                    label="Uploaded"
                                    color="success"
                                    size="small"
                                  />
                                )}
                                {doc.status === "pending" && (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => handleUpload(category.id, doc.id)}
                                  >
                                    Upload
                                  </Button>
                                )}
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleRemoveFile(category.id, doc.id)
                                  }
                                  color="error"
                                >
                                  <IconX size={18} />
                                </IconButton>
                              </Stack>
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>

                      {category.documents.some(
                        (doc) => doc.status === "pending"
                      ) && (
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{ mt: 2 }}
                          onClick={() => handleUploadAll(category.id)}
                        >
                          Upload All
                        </Button>
                      )}
                    </Box>
                  )}
                </CardContent>
              </BlankCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </PageContainer>
  );
};

export default Documents;

