import { ChevronLeft, ChevronRight, Close, Menu, Search } from "@mui/icons-material";
import { AppBar, Box, IconButton, Popover, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import React, { useState } from "react";

import Icon from "../home/Icon";
import SearchCourse from "./SearchCourse";

const AppHeader = ({
  week,
  pageTitle,
  courseFilter,
  sidebarState,
  handleHamburger,
  handleWeek,
  setCourseFilter,
  setRightSidebarState,
}) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);

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

        <Icon />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1
          }}
        >
          {pageTitle === "Schedule"
            ?
            <>
              <IconButton
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
              </IconButton>
            </>
            : <Typography variant="h6">{pageTitle}</Typography>
          }
        </Box>
        {isMd
          ?
          <>
            <IconButton
              size="large"
              color="inherit"
              edge="end"
              onClick={e => setAnchorEl(e.currentTarget)}
            >
              <Search />
            </IconButton>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              marginThreshold={0}
              anchorOrigin={{
                vertical: "center",
                horizontal: "right"
              }}
              transformOrigin={{
                vertical: "center",
                horizontal: "right"
              }}
            >
              <SearchCourse {...searchCourseProps} />
            </Popover>
          </>
          : <SearchCourse {...searchCourseProps} />
        }
      </Toolbar>
    </AppBar>
  );
};

AppHeader.propTypes = {
  week: PropTypes.number,
  pageTitle: PropTypes.string,
  courseFilter: PropTypes.string,
  sidebarState: PropTypes.bool,
  handleHamburger: PropTypes.func,
  handleWeek: PropTypes.object,
  setCourseFilter: PropTypes.func,
  setRightSidebarState: PropTypes.func
};

export default AppHeader;