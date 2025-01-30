import uniqueId from "lodash/uniqueId"; // Corrected import

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
} from "@tabler/icons-react";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Law Library",
  },
  {
    id: uniqueId(),
    title: "Library",
    icon: IconBook,
    href: "/library",
  },
  {
    id: uniqueId(),
    title: "Mentors",
    icon: IconUsers,
    href: "/mentors",
  },
  {
    id: uniqueId(),
    title: "Feedback",
    icon: IconMessage,
    href: "/feedback",
  },
  {
    navlabel: true,
    subheader: "Extra",
  },
  {
    id: uniqueId(),
    title: "Blogs",
    icon: IconFileText,
    href: "/blogs",
  },
  {
    id: uniqueId(),
    title: "AI Chatbot (Soon)",
    icon: IconRobot,
    href: "/ai",
  },
];

export default Menuitems;
