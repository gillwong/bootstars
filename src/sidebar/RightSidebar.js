import { Button, Drawer, Toolbar } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

import CourseList from "../courselist/CourseList";
import { OFF } from "../services/constants";

const RightSidebar = ({
  rightSidebarState,
  courses,
  courseFilter,
  handleDelete,
  setRightSidebarState,
}) => {

  const courseListProps = {
    courses,
    courseFilter,
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
      <Toolbar sx={{ mb: 2 }} />
      <Button
        variant="contained"
        color="warning"
        sx={{ mx: 1, mt: 2, mb: 0 }}
        onClick={() => setRightSidebarState(OFF)}
      >
        Collapse
      </Button>
      <CourseList {...courseListProps} columns={1} onLoadPage={() => {}} />
    </Drawer>
  );
};

RightSidebar.propTypes = {
  rightSidebarState: PropTypes.bool,
  courses: PropTypes.array,
  courseFilter: PropTypes.string,
  handleDelete: PropTypes.func,
  setRightSidebarState: PropTypes.func
};

export default RightSidebar;