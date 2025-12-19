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
  },
  {
    id: uniqueId(),
    title: "Personality Test",
    icon: IconCrown,
    href: "https://personalitytest.ilc.limited/test/",
    external: true,
  },
  {
    id: uniqueId(),
    title: "CV Builder",
    icon: IconFileText,
    href: "https://resumebuilder.ilc.limited/editor",
    external: true,
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
  },
  {
    id: uniqueId(),
    title: "Events",
    icon: IconCalendar,
    href: "/events",
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
  },
];

export default Menuitems;
