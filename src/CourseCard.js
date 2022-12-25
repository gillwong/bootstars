import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, handleDelete }) => {
  return (
    <Col className="px-2 py-2" sm="12" md="6" lg="4" xl="3">
      <Card text="dark" bg="light" className="m-0 w-100 h-100">
        <Card.Header className="fw-light">{course.grading}</Card.Header>
        
        <Card.Body className="d-flex flex-wrap">
          <Container className="p-0 d-inline">
            
            <Card.Title>{course.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{course.code}</Card.Subtitle>

            <Container className="p-0 d-flex justify-content-between">
              <Card.Text className="p-0 text-start">by {course.school}</Card.Text>
              <Card.Text className="p-0 text-end">{course.au} AU</Card.Text>
            </Container>
            
          </Container>

          <Container className="p-0 mt-3 d-flex align-items-end justify-content-between">
            
            <Link to={`/view/${course.id}`}><Button size="sm" variant="primary" className="px-4">View</Button></Link>

            <Link to={`/edit/${course.id}`}><Button size="sm" variant="secondary" className="px-3">Edit</Button></Link>

            <Button onClick={() => handleDelete(course.id)} size="sm" variant="outline-danger">Delete</Button>

          </Container>
        </Card.Body>
      </Card>
    </Col>
  );
}
 
export default CourseCard;