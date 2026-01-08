"use client";

import React from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";
import { useUserProfile } from "@/hooks/useUserProfile";

const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const pathname = usePathname();
  const pathDirect = pathname;
  const { isMentor, loading } = useUserProfile();

  // Filter menu items based on user role
  const filteredMenuItems = Menuitems.filter((item) => {
    // If item is mentor-only, only show if user is a mentor
    if (item.mentorOnly) {
      return isMentor && !loading;
    }
    // If item is student-only, only show if user is NOT a mentor (i.e., is a student)
    if (item.studentOnly) {
      return !isMentor && !loading;
    }
    // Show all other items (available to both)
    return true;
  }).sort((a, b) => {
    // Sort so Dashboard appears first
    if (a.title === "Dashboard" && b.title !== "Dashboard") return -1;
    if (b.title === "Dashboard" && a.title !== "Dashboard") return 1;
    return 0;
  });

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {filteredMenuItems.map((item) => {
          return (
            <NavItem
              item={item}
              key={item.id}
              pathDirect={pathDirect}
              onClick={toggleMobileSidebar}
            />
          );
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
