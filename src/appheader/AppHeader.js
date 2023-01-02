import { ChevronLeft, ChevronRight, Close, Menu } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

import SearchCourse from "./SearchCourse";

const AppHeader = ({
  week,
  pageTitle,
  courseFilter,
  sidebarState,
  mouseLeft,
  handleHamburger,
  handleWeek,
  setCourseFilter,
  setRightSidebarState,
  setFocused
}) => {
  const searchCourseProps = {
    courseFilter,
    setCourseFilter,
    setRightSidebarState
  };

  return (
    <AppBar sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          onClick={handleHamburger}
        >
          {sidebarState ? <Close /> : <Menu />}
        </IconButton>

        <Typography variant="h6" ml={2}>
          Material STARS
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1
          }}
        >
          {pageTitle === "Schedule" ? <><IconButton
            size="large"
            color="inherit"
            onClick={handleWeek.left}
          >
            <ChevronLeft />
          </IconButton>
          <Typography>Week {week}</Typography>
          <IconButton
            size="large"
            color="inherit"
            onClick={handleWeek.right}
          >
            <ChevronRight />
          </IconButton></> : <Typography variant="h6">{pageTitle}</Typography>}
        </Box>

        <SearchCourse {...searchCourseProps} setFocused={setFocused} mouseLeft={mouseLeft} />
      </Toolbar>
    </AppBar>
  );
};

AppHeader.propTypes = {
  week: PropTypes.number,
  pageTitle: PropTypes.string,
  courseFilter: PropTypes.string,
  sidebarState: PropTypes.bool,
  mouseLeft: PropTypes.bool,
  handleHamburger: PropTypes.func,
  handleWeek: PropTypes.object,
  setCourseFilter: PropTypes.func,
  setRightSidebarState: PropTypes.func,
  setFocused: PropTypes.func
};

export default AppHeader;