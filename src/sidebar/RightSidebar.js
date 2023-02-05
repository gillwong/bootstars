import { Button, Drawer, Toolbar } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

import CourseList from "../courselist/CourseList";
import { OFF } from "../services/constants";

const RightSidebar = ({
  rightSidebarState,
  toolbarHeight,
  courses,
  courseFilter,
  handleDelete,
  setRightSidebarState,
}) => {

  const courseListProps = {
    courses,
    courseFilter,
    toolbarHeight,
    handleDelete
  };

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={rightSidebarState}
      sx={{
        width: 1/4,
        "& .MuiDrawer-paper": {
          width: 1/4,
          boxSizing: "border-box",
          boxShadow: 3
        }
      }}
    >
      <Toolbar sx={toolbarHeight ? { height: `${toolbarHeight}px` } : {}} />
      <Button
        variant="contained"
        color="warning"
        sx={{ mx: 1, mt: 2, mb: 0 }}
        onClick={() => setRightSidebarState(OFF)}
      >
        Collapse
      </Button>
      <CourseList {...courseListProps} toolbarHeight={toolbarHeight} columns={1} onLoadPage={() => {}} />
    </Drawer>
  );
};

RightSidebar.propTypes = {
  rightSidebarState: PropTypes.bool,
  toolbarHeight: PropTypes.number.isRequired,
  courses: PropTypes.array,
  courseFilter: PropTypes.string,
  handleDelete: PropTypes.func,
  setRightSidebarState: PropTypes.func
};

export default RightSidebar;