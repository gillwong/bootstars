import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CourseList from './CourseList';
import { useEffect, useState } from 'react';
import AppHeader from './AppHeader';
import Sidebar from './Sidebar';
import AddCourse from './AddCourse';
import coursesService from './services/courses';
import Schedule from './Schedule';
import CourseDetails from './CourseDetails';

function App() {
  const [ courses, setCourses ] = useState([]);
  const [ sidebarOn, toggleSidebarOn ] = useState(false);
  const [ week, setWeek ] = useState(1);
  const [ pageTitle, setPageTitle ] = useState("Course List");
  const [ courseFilter, setCourseFilter ] = useState("");

  useEffect(() => {
    coursesService.getAll()
      .then((allCourses) => {
        setCourses(allCourses);
      })
      .catch((err) => console.error(err));
  }, []);

  const addCourse = (newCourse) => {
    coursesService.create(newCourse)
      .then(returnedCourse => setCourses(courses.concat(returnedCourse)))
      .catch((err) => console.error(err));
  }

  const editCourse = (updatedCourse) => {
    coursesService.update(updatedCourse)
      .then(returnedCourse => {
        let updatedCourses = [...courses];
        const updatedId = updatedCourses.findIndex(course => course.id === returnedCourse.id);
        updatedCourses[updatedId] = returnedCourse;
        setCourses(updatedCourses);
      })
      .catch((err) => console.error(err));
  }

  const deleteCourse = (id) => {
    coursesService.delData(id)
      .then(() => setCourses(courses.filter((course) => course.id !== id)))
      .catch((err) => console.error(err));
  }

  const weekLeft = () => setWeek(week !== 1 ? week - 1 : week);
  const weekRight = () => setWeek(week !== 13 ? week + 1 : week);
  const weekHandler = {
    left: weekLeft,
    right: weekRight
  }

  return (
    <Router>
      <Container fluid className="vh-100">
        <AppHeader pageTitle={pageTitle} handleHamburger={() => toggleSidebarOn(!sidebarOn)} sideBarState={sidebarOn} week={week} handleWeek={weekHandler} courseFilter={courseFilter} setCourseFilter={setCourseFilter} />
        <Row className="h-100">
          {sidebarOn && <Sidebar />}
          <Col className="px-0">
            <Routes>
              <Route path="/" element={
                <CourseList courses={courses} courseFilter={courseFilter} handleDelete={deleteCourse} onLoadPage={() => setPageTitle("Course List")} />
              } />
              <Route path="/add" element={
                <AddCourse handleAdd={addCourse} mode="ADD" onLoadPage={() => setPageTitle("Add Course")} />
              } />
              <Route path="/schedule" element={
                <Schedule onLoadPage={() => setPageTitle("Schedule")} />
              } />
              <Route path="/edit/:id" element={
                <AddCourse handleAdd={addCourse} mode="EDIT" handleEdit={editCourse} onLoadPage={() => setPageTitle("Edit Course")} />
              } />
              <Route path="/view/:id" element={
                <AddCourse mode="VIEW" onLoadPage={() => setPageTitle("View Course")} />
              } />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
