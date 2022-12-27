import { ChevronLeft, ChevronRight, Menu } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import SearchCourseMUI from "./SearchCourseMUI";

const AppHeaderMUI = ({
  week, 
  courseFilter, 
  handleHamburger, 
  handleWeek, 
  setCourseFilter 
}) => {
  const searchCourseProps = {
    courseFilter,
    setCourseFilter
  }

  return (
    <AppBar>
      <Toolbar>
        <IconButton 
          size="large" 
          edge="start" 
          color="inherit"
          onClick={handleHamburger}
        >
          <Menu />
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
        </Box>

        <SearchCourseMUI {...searchCourseProps} />
      </Toolbar>
    </AppBar>
  );
}
 
export default AppHeaderMUI;