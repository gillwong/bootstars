import { Add, CalendarMonth, ListTwoTone } from "@mui/icons-material";
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router";

const Sidebar = ({
  sidebarState,
  toolbarHeight
}) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();

  return (
    // issue: animation lags when number of course is large
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarState}
      sx={{
        width: isMd ? 1/10 : 1/5,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isMd ? 1/10 : 1/5,
          boxSizing: "border-box",
          boxShadow: 3
        },
      }}
    >
      <Toolbar sx={toolbarHeight ? { height: `${toolbarHeight}px` } : {}} />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItem
            disablePadding
          >
            <ListItemButton
              onClick={() => navigate("/schedule")}
              sx={isMd ? { px: 0 } : {}}
            >
              <ListItemIcon
                sx={isMd ? {
                  minWidth: 0,
                  mx: "auto",
                  my: 0.5
                } : {}}
              >
                <CalendarMonth />
              </ListItemIcon>
              {!isMd && <ListItemText>My Schedule</ListItemText>}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/list")}
              sx={isMd ? { px: 0 } : {}}
            >
              <ListItemIcon
                sx={isMd ? {
                  minWidth: 0,
                  mx: "auto",
                  my: 0.5
                } : {}}
              >
                <ListTwoTone />
              </ListItemIcon>
              {!isMd && <ListItemText>Course List</ListItemText>}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/add")}
              sx={isMd ? { px: 0 } : {}}
            >
              <ListItemIcon
                sx={isMd ? {
                  minWidth: 0,
                  mx: "auto",
                  my: 0.5
                } : {}}
              >
                <Add />
              </ListItemIcon>
              {!isMd && <ListItemText>Add Course</ListItemText>}
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};

Sidebar.propTypes = {
  sidebarState: PropTypes.bool,
  toolbarHeight: PropTypes.number.isRequired
};

export default Sidebar;