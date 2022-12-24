import { useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { useParams } from "react-router-dom";
import coursesServices from "./services/courses";

const CourseDetails = ({ onLoadPage }) => {
  const { id } = useParams();
  const [ course, setCourse ] = useState({});
  const [ isPending, toggleIsPending ] = useState(true);

  useEffect(onLoadPage, [onLoadPage]);

  useEffect(() => {
    coursesServices.getData(id)
      .then(returnedCourse => {
        setCourse(returnedCourse);
        toggleIsPending(false);
      });
  }, [id]);
  
  return !isPending ? (
    <Container className="py-4">
      <Row className="mb-3">
        <Col xs="auto" className="h2 me-4">{course.code}</Col>
        <Col className="h2">{course.title}</Col>
        <Col xs="auto" className="h2">{course.au} AU</Col>
        <Col xs="2" className="h2 text-end">{course.school}</Col>
      </Row>
      <hr />
      <Row className="mb-3">
        <Col>Prerequisite:</Col>
        <Col>{course.prereq.join(", ")}</Col>
      </Row>
      <Row className="mb-3">
        <Col>Mutually exclusive with:</Col>
        <Col>{course.exclusive.join(", ")}</Col>
      </Row>
      <Row className="mb-3">
        <Col>Not available to programme:</Col>
        <Col>{course.programmeExclude}</Col>
      </Row>
      <Row className="mb-3">
        <Col>Not available to all programme:</Col>
        <Col>{course.ayExclude}</Col>
      </Row>
      <Row className="mb-3">
        <Col>Grading type:</Col>
        <Col>{course.grading}</Col>
      </Row>
      <Row className="mb-3">
        <Col>
          Remark:<br />
          {course.bde ? <span className="text-success">Course is available as Broadening and Deepening Elective</span> : <span className="text-danger">Course is not available as Broadening and Deepening Elective</span>}<br />
          {course.gerpe ? <span className="text-success">Course is available as General Education Prescribed Elective</span> : <span className="text-danger">Course is not available as General Education Prescribed Elective</span>}
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>Exam Schedule:</Col>
        <Col>{course.examSchedule}</Col>
      </Row>
    </Container>
  ) : (<></>);
}
 
export default CourseDetails;