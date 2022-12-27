import CourseCard from "./CourseCard";
import Row from "react-bootstrap/esm/Row";
import { useEffect } from "react";

const CourseList = ({ 
  courses, 
  courseFilter, 
  handleDelete, 
  onLoadPage 
}) => {

  useEffect(onLoadPage, [onLoadPage]);

  return (
    <Row className="mx-2">

      {courses
        .filter(course => 
          course.code.toLowerCase().indexOf(courseFilter.toLowerCase()) !== -1 || 
          course.title.toLowerCase().indexOf(courseFilter.toLowerCase()) !== -1)
        .map(course => <CourseCard key={course.id} course={course} handleDelete={handleDelete} />)}
      
    </Row>
  );
}
 
export default CourseList;