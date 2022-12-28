import { Drawer, Toolbar } from "@mui/material";
import CourseListMUI from "../courselist/CourseListMUI";

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
  }

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
      <CourseListMUI {...courseListProps} />
    </Drawer>
  );
}
 
export default RightSidebar;