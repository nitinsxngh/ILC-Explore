import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Badge,
  Stack,
  Chip,
  Avatar,
} from '@mui/material';
import {
  IconX,
  IconBell,
  IconCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconStar,
} from '@tabler/icons-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  avatar?: string;
}

interface NotificationSidebarProps {
  open: boolean;
  onClose: () => void;
}

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ open, onClose }) => {
  // Sample notification data - in a real app, this would come from an API or context
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Welcome to ILC Explore!',
      message: 'Your account has been successfully created. Start exploring our features.',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
    },
    {
      id: '2',
      title: 'Personality Test Completed',
      message: 'Your personality assessment results are now available. Check your dashboard.',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
    },
    {
      id: '3',
      title: 'Resume Updated',
      message: 'Your resume has been successfully updated and saved.',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
    },
    {
      id: '4',
      title: 'New Course Available',
      message: 'A new course "Advanced React Development" is now available in your library.',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      read: true,
    },
    {
      id: '5',
      title: 'Profile Incomplete',
      message: 'Complete your profile to get personalized recommendations.',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <IconCheck size={20} color="#10b981" />;
      case 'warning':
        return <IconAlertCircle size={20} color="#f59e0b" />;
      case 'error':
        return <IconAlertCircle size={20} color="#ef4444" />;
      default:
        return <IconInfoCircle size={20} color="#3b82f6" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 400,
          maxWidth: '90vw',
          backgroundColor: '#ffffff',
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconBell size={24} color="#1e3a8a" />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                color="primary"
                sx={{ ml: 1, fontWeight: 600 }}
              />
            )}
          </Stack>
          <IconButton onClick={onClose} size="small">
            <IconX size={20} />
          </IconButton>
        </Box>

        {/* Notifications List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 3,
                textAlign: 'center',
              }}
            >
              <IconBell size={48} color="#cbd5e1" />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      p: 3,
                      backgroundColor: notification.read ? 'transparent' : '#f8fafc',
                      borderLeft: notification.read ? 'none' : `3px solid ${getNotificationColor(notification.type)}`,
                      '&:hover': {
                        backgroundColor: '#f1f5f9',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, mr: 2 }}>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: notification.read ? 400 : 600,
                            color: notification.read ? '#64748b' : '#1e293b',
                            mb: 0.5,
                          }}
                        >
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: notification.read ? '#94a3b8' : '#64748b',
                              display: 'block',
                              mb: 1,
                            }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#94a3b8',
                              fontSize: '0.75rem',
                            }}
                          >
                            {formatTimestamp(notification.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                    {!notification.read && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: getNotificationColor(notification.type),
                          ml: 1,
                        }}
                      />
                    )}
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                color: '#1e3a8a',
              },
            }}
          >
            Mark all as read
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default NotificationSidebar;
