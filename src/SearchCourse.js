import Form from "react-bootstrap/esm/Form";

const SearchCourse = ({ courseFilter, setCourseFilter }) => {
  return (
    <Form>
      <Form.Label className="d-none">Search Course</Form.Label>
      <Form.Control 
        type="text" 
        placeholder="Search Course" 
        value={courseFilter} 
        onChange={(e) => setCourseFilter(e.target.value)} 
      />
    </Form>
  );
}
 
export default SearchCourse;