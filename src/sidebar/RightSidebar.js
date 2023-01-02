import { Drawer, Toolbar } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

import CourseList from "../courselist/CourseList";

const RightSidebar = ({
  rightSidebarState,
  courses,
  focused,
  courseFilter,
  handleDelete,
  setRightSidebarState,
  setMouseLeft
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
      onMouseLeave={() => {
        setMouseLeft(true);
        if(!focused) {
          setRightSidebarState(false);
        }
      }}
      onMouseEnter={() => setMouseLeft(false)}
      sx={{
        width: 1/4,
        "& .MuiDrawer-paper": {
          width: 1/4,
          boxSizing: "border-box",
          boxShadow: 3
        }
      }}
    >
      <Toolbar />
      <CourseList {...courseListProps} columns={1} onLoadPage={() => {}} />
    </Drawer>
  );
};

RightSidebar.propTypes = {
  rightSidebarState: PropTypes.bool,
  courses: PropTypes.array,
  focused: PropTypes.bool,
  courseFilter: PropTypes.string,
  handleDelete: PropTypes.func,
  setRightSidebarState: PropTypes.func,
  setMouseLeft: PropTypes.func
};

export default RightSidebar;