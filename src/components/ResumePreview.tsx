import React from 'react';
import { Box, Typography, Chip, Stack, Divider } from '@mui/material';
import { IconUser, IconMail, IconPhone, IconMapPin, IconBriefcase, IconSchool } from '@tabler/icons-react';

interface ResumePreviewProps {
  resumeData: any;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData }) => {
  if (!resumeData || !resumeData.data) return null;

  const { data } = resumeData;
  const { basics, skills, work, education } = data;

  return (
    <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
        Resume Preview: {resumeData.title}
      </Typography>
      
      <Stack spacing={2}>
        {/* Basic Info */}
        {basics && (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Contact Information
            </Typography>
            <Stack spacing={0.5}>
              {basics.name && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconUser size={16} />
                  <Typography variant="caption">{basics.name}</Typography>
                </Box>
              )}
              {basics.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconMail size={16} />
                  <Typography variant="caption">{basics.email}</Typography>
                </Box>
              )}
              {basics.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconPhone size={16} />
                  <Typography variant="caption">{basics.phone}</Typography>
                </Box>
              )}
              {basics.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconMapPin size={16} />
                  <Typography variant="caption">
                    {basics.location.city}, {basics.location.region}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        )}

        <Divider />

        {/* Skills */}
        {skills && (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {skills.languages?.slice(0, 5).map((skill: any, index: number) => (
                <Chip key={index} label={skill.name} size="small" variant="outlined" />
              ))}
              {skills.frameworks?.slice(0, 3).map((skill: any, index: number) => (
                <Chip key={index} label={skill.name} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>
        )}

        <Divider />

        {/* Work Experience */}
        {work && work.length > 0 && (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Work Experience
            </Typography>
            <Stack spacing={1}>
              {work.slice(0, 2).map((job: any, index: number) => (
                <Box key={index}>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {job.position} at {job.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {job.startDate} - {job.endDate}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        <Divider />

        {/* Education */}
        {education && education.length > 0 && (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Education
            </Typography>
            <Stack spacing={1}>
              {education.slice(0, 1).map((edu: any, index: number) => (
                <Box key={index}>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {edu.studyType} in {edu.area}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {edu.institution} • {edu.startDate} - {edu.endDate}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #e2e8f0' }}>
          <Typography variant="caption" color="text.secondary">
            Last Updated: {new Date(resumeData.updatedAt).toLocaleDateString()}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default ResumePreview;
