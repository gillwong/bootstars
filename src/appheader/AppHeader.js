import { ChevronLeft, ChevronRight, Close, Edit, Menu, Search, Visibility } from "@mui/icons-material";
import { AppBar, Box, Button, IconButton, Popover, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Icon from "../home/Icon";
import SearchCourse from "./SearchCourse";

const AppHeader = React.forwardRef(({
  week,
  pageTitle,
  courseFilter,
  sidebarState,
  handleHamburger,
  handleWeek,
  setCourseFilter,
  setRightSidebarState,
}, ref) => {
  const theme = createTheme(useTheme(), {
    palette: {
      altprimary: {
        main: blueGrey[500],
        contrastText: "#fff",
      },
    },
  });
  const isMd = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const searchCourseProps = {
    courseFilter,
    setCourseFilter,
    setRightSidebarState
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar ref={ref} color={pageTitle === "Schedule View" ? "altprimary" : "primary"} sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
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
            {pageTitle === "Schedule View"
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
              : pageTitle === "Schedule"
                ? <Button
                  color="inherit"
                  underline="none"
                  variant="outlined"
                  startIcon={<Visibility />}
                  onClick={() => navigate("/schedule/view")}
                  sx={{
                    "&:hover": {
                      color: "inherit"
                    }
                  }}
                >
                  <Typography>View</Typography>
                </Button>
                : <Typography variant="h6">{pageTitle}</Typography>
            }
          </Box>
          {pageTitle !== "Schedule View"
            ? isMd
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
            : <IconButton
              size="large"
              color="inherit"
              edge="end"
              onClick={() => navigate("/schedule")}
            >
              <Edit />
            </IconButton>
          }
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
});

AppHeader.displayName = "AppHeader";

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