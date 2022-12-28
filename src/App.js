import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect, useState } from 'react';
import coursesService from './services/courses';
import { OFF } from './services/constants';
import AppHeader from './appheader/AppHeader';
import Sidebar from './sidebar/Sidebar';
import CourseList from './courselist/CourseList';
import AddCourse from './addcourse/AddCourse';
import Schedule from './schedule/Schedule';
import AppHeaderMUI from './appheader/AppHeaderMUI';
import SidebarMUI from './sidebar/SidebarMUI';
import RightSidebar from './sidebar/RightSidebar';

function App() {
  const [courses, setCourses] = useState([]);
  const [sidebarState, setSidebarState] = useState(OFF);
  const [rightSidebarState, setRightSidebarState] = useState(OFF);
  const [week, setWeek] = useState(1);
  const [pageTitle, setPageTitle] = useState("Course List");
  const [courseFilter, setCourseFilter] = useState("");

  useEffect(() => {
    coursesService.getAll()
      .then(returnedCourses => setCourses(returnedCourses))
      .catch(err => console.error(err));
  }, []);

  const addCourse = (newCourse) => {
    coursesService.create(newCourse)
      .then(returnedCourse => setCourses(courses.concat(returnedCourse)))
      .catch(err => console.error(err));
  }

  const editCourse = (updatedCourse) => {
    coursesService.update(updatedCourse)
      .then(returnedCourse => setCourses(courses.map(
          course => course.id === returnedCourse.id ? returnedCourse : course
      )))
      .catch(err => console.error(err));
  }

  const deleteCourse = (id) => {
    coursesService.delData(id)
      .then(() => setCourses(courses.filter((course) => course.id !== id)))
      .catch(err => console.error(err));
  }

  const weekLeft = () => setWeek(week !== 1 ? week - 1 : week);
  const weekRight = () => setWeek(week !== 13 ? week + 1 : week);

  const appHeaderProps = {
    pageTitle, 
    sidebarState, 
    week, 
    courseFilter, 
    handleHamburger: () => setSidebarState(!sidebarState),
    handleWeek: { left: weekLeft, right: weekRight },
    setCourseFilter
  }

  const courseListProps = {
    courses,
    courseFilter,
    handleDelete: deleteCourse
  }

  return (
    <Router>
      <Container fluid className="vh-100">
        
        {pageTitle === "Schedule" 
          ? <AppHeaderMUI {...appHeaderProps} setRightSidebarState={setRightSidebarState} /> 
          : <AppHeader {...appHeaderProps} />
        }
        
        <Row className="h-100">
          
          {pageTitle === "Schedule" 
            ? <SidebarMUI sidebarState={sidebarState} />
            : sidebarState && <Sidebar />
          }

          {pageTitle === "Schedule" && <RightSidebar {...courseListProps} rightSidebarState={rightSidebarState} setRightSidebarState={setRightSidebarState} />}
          
          <Col className="px-0">
            <Routes>
              <Route path="/" element={
                <CourseList 
                  {...courseListProps} 
                  onLoadPage={() => setPageTitle("Course List")} 
                />
              } />
              <Route path="/add" element={
                <AddCourse 
                  mode="ADD" 
                  handleAdd={addCourse} 
                  onLoadPage={() => setPageTitle("Add Course")} 
                />
              } />
              <Route path="/schedule" element={
                <Schedule onLoadPage={() => setPageTitle("Schedule")} />
              } />
              <Route path="/edit/:id" element={
                <AddCourse 
                  mode="EDIT" 
                  handleAdd={addCourse} 
                  handleEdit={editCourse} 
                  onLoadPage={() => setPageTitle("Edit Course")} 
                />
              } />
              <Route path="/view/:id" element={
                <AddCourse 
                  mode="VIEW" 
                  onLoadPage={() => setPageTitle("View Course")} 
                />
              } />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
