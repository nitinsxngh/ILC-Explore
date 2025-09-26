"use client";

import React, { useRef } from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Paper,
  useTheme,
  Divider,
  Avatar,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  IconUser,
  IconMail,
  IconPhone,
  IconBook,
  IconBriefcase,
  IconStars,
  IconBulb,
} from '@tabler/icons-react';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string(),
  summary: z.string(),
  education: z.string(),
  experience: z.string(),
  skills: z.string(),
});

type FormData = z.infer<typeof schema>;

const ResumeBuilder: React.FC = () => {
  const theme = useTheme();
  const {
    register,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const pdfRef = useRef(null);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 6 },
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Typography
        variant="h4"
        fontWeight={800}
        textAlign="center"
        mb={4}
        sx={{
          background: 'linear-gradient(to right, #00c6ff, #0072ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
         ILC AI-Powered Resume Builder
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={6}>
        {/* === Form Section === */}
        <Stack spacing={2} flex={1} sx={{ px: 2 }}>
          <TextField
            label="Full Name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
          />
          <TextField
            label="Email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />
          <TextField label="Phone" {...register('phone')} fullWidth />
          <TextField
            label="Summary"
            {...register('summary')}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Education"
            {...register('education')}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Experience"
            {...register('experience')}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Skills"
            {...register('skills')}
            multiline
            rows={2}
            fullWidth
          />
        </Stack>

        {/* === Preview Section === */}
        <Paper
          ref={pdfRef}
          elevation={4}
          sx={{
            p: 4,
            flex: 1,
            borderRadius: 4,
            bgcolor: 'background.paper',
            background: 'linear-gradient(145deg, #f5f7fa, #e4ecf1)',
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Stack alignItems="center" spacing={1} mb={3}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: 32,
                fontWeight: 600,
              }}
            >
              {watch('name')?.[0] ?? 'A'}
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              {watch('name')}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              <IconMail size={16} style={{ marginRight: 4 }} />
              {watch('email')} &nbsp; | &nbsp;
              <IconPhone size={16} style={{ marginRight: 4 }} />
              {watch('phone')}
            </Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Section icon={<IconStars size={20} />} title="Summary" text={watch('summary')} />
          <Section icon={<IconBook size={20} />} title="Education" text={watch('education')} />
          <Section icon={<IconBriefcase size={20} />} title="Experience" text={watch('experience')} />
          <Section icon={<IconBulb size={20} />} title="Skills" text={watch('skills')} />
        </Paper>
      </Stack>
    </Box>
  );
};

export default ResumeBuilder;

// === Section Component for Cleaner Layout ===
const Section = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) => (
  <Box mb={3}>
    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
      {icon}
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
    </Stack>
    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
      {text}
    </Typography>
  </Box>
);
