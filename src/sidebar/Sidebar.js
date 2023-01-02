import { Add, CalendarMonth, ListTwoTone } from "@mui/icons-material";
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router";

const Sidebar = ({ sidebarState }) => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarState}
      sx={{
        width: 1/5,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 1/5,
          boxSizing: "border-box",
          boxShadow: 3
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/schedule")}
            >
              <ListItemIcon><CalendarMonth /></ListItemIcon>
              <ListItemText>My Schedule</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/")}
            >
              <ListItemIcon><ListTwoTone /></ListItemIcon>
              <ListItemText>Course List</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/add")}
            >
              <ListItemIcon><Add /></ListItemIcon>
              <ListItemText>Add Course</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};

Sidebar.propTypes = { sidebarState: PropTypes.bool };

export default Sidebar;