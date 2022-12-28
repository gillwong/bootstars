import { Box } from "@mui/material";
import CourseCardMUI from "./CourseCardMUI";

const CourseListMUI = ({ 
  courses, 
  courseFilter, 
  handleDelete 
}) => {
  return (
    <Box sx={{ overflow: "auto" }}>

      {courses
        .filter(course => 
          course.code.toLowerCase().indexOf(courseFilter.toLowerCase()) !== -1 || 
          course.title.toLowerCase().indexOf(courseFilter.toLowerCase()) !== -1)
        .map(course => <CourseCardMUI key={course.id} course={course} handleDelete={handleDelete} />)}

    </Box>
  );
}
 
export default CourseListMUI;