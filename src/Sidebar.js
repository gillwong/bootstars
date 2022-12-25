import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  
  return (
    <Col xs="auto" md="2" className="px-0 border-end">
      <ButtonGroup vertical className="d-flex w-100">
        <Button onClick={() => navigate("/schedule")} variant="light text-start" className="rounded-0">My Schedule</Button>
        <Button onClick={() => navigate("/")}  variant="light text-start" className="rounded-0">Course List</Button>
        <Button onClick={() => navigate("/add")}  variant="light text-start" className="rounded-0">Add Course</Button>
      </ButtonGroup>
    </Col>
  );
}
 
export default Sidebar;