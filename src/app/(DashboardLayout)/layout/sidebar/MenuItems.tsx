import uniqueId from "lodash/uniqueId";

import {
  IconDashboard,
  IconBook,
  IconUsers,
  IconMessage,
  IconFileText,
  IconMoodHappy,
  IconRobot,
  IconLogin,
  IconUserPlus,
  IconCrown,
  IconList,
  IconMessageCircle,
  IconNews,
  IconCalendar,
  IconExternalLink,
  IconUpload,
} from "@tabler/icons-react";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconDashboard,
    href: "/",
    studentOnly: true, // Only show for students
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconDashboard,
    href: "/mentor",
    mentorOnly: true, // Main dashboard for mentors
  },
  {
    id: uniqueId(),
    title: "Personality Test",
    icon: IconCrown,
    href: "https://personalitytest.ilc.limited/test/",
    external: true,
    studentOnly: true, // Only show for students
  },
  {
    id: uniqueId(),
    title: "CV Builder",
    icon: IconFileText,
    href: "https://resumebuilder.ilc.limited/editor",
    external: true,
    studentOnly: true, // Only show for students
  },
  {
    id: uniqueId(),
    title: "Courses",
    icon: IconList,
    href: "/courses",
  },
  {
    id: uniqueId(),
    title: "Community Page",
    icon: IconMessageCircle,
    href: "https://forum.ilc.limited/",
    external: true,
  },
  {
    id: uniqueId(),
    title: "Library",
    icon: IconBook,
    href: "/library",
    studentOnly: true, // Only show for students
    children: [
      {
        id: uniqueId(),
        title: "Notes",
        href: "/library/notes",
      },
      {
        id: uniqueId(),
        title: "Drafts",
        href: "/library/drafts",
      },
      {
        id: uniqueId(),
        title: "Publication",
        href: "/library/publication",
      },
      {
        id: uniqueId(),
        title: "Blogs",
        href: "/library/blogs",
      },
      {
        id: uniqueId(),
        title: "Articles",
        href: "/library/articles",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "News",
    icon: IconNews,
    href: "/news",
    studentOnly: true, // Only show for students
  },
  {
    id: uniqueId(),
    title: "Events",
    icon: IconCalendar,
    href: "/events",
    studentOnly: true, // Only show for students
    children: [
      {
        id: uniqueId(),
        title: "Seminar",
        href: "/events/seminar",
      },
      {
        id: uniqueId(),
        title: "Webinar",
        href: "/events/webinar",
      },
      {
        id: uniqueId(),
        title: "Call For Paper",
        href: "/events/call-for-paper",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Documents",
    icon: IconUpload,
    href: "/documents",
    studentOnly: true, // Only show for students
  },
  {
    id: uniqueId(),
    title: "My Courses",
    icon: IconBook,
    href: "/mentor/courses",
    mentorOnly: true, // Only show for mentors
  },
];

export default Menuitems;
