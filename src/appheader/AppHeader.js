import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Hamburger from './Hamburger';
import SearchCourse from './SearchCourse';
import { CaretLeft, CaretRight } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/esm/Button';
import './AppHeader.css';

const AppHeader = ({
  pageTitle, 
  sidebarState, 
  week, 
  courseFilter, 
  handleHamburger, 
  handleWeek, 
  setCourseFilter 
}) => {

  const hamburgerProps = {
    sidebarState,
    handleHamburger
  }

  const searchCourseProps = {
    courseFilter,
    setCourseFilter
  }

  return (
    <Row className="py-2 border-bottom">
      <Col xs="auto" className="d-flex align-items-center">
        
        <Hamburger {...hamburgerProps} />

      </Col>
      <Col xs="1" className="px-0 d-none d-lg-flex align-items-center">
        <span className="px-0 h6 mb-0">Bootstrap STARS</span>
      </Col>
      <Col className="d-flex justify-content-center">
        <Row className="d-flex align-items-center">
          
          {pageTitle === "Schedule" ? 
          <><Col className="px-0">
            <Button onClick={handleWeek.left} size="lg" className="week-button d-flex align-items-center" variant="link">
              <CaretLeft />
            </Button>
          </Col>
          <Col xs="auto" className="px-0">Week {week}</Col>
          <Col className="px-0">
            <Button onClick={handleWeek.right} size="lg" className="week-button d-flex align-items-center" variant="link">
              <CaretRight />
            </Button>
          </Col></> : 
          <span className="px-0 h5 mb-0">{pageTitle}</span>}

        </Row>
      </Col>
      <Col xs="auto" className="d-flex align-items-center">
        
        {pageTitle === "Course List" && <SearchCourse {...searchCourseProps} />}
        
      </Col>
    </Row>
  );
}
 
export default AppHeader;