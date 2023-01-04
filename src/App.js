import { styled } from "@mui/material";
import { MultiBackend } from "dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AddCourse from "./addcourse/AddCourse";
import AppHeader from "./appheader/AppHeader";
import CourseList from "./courselist/CourseList";
import Schedule from "./schedule/Schedule";
import { OFF, ON } from "./services/constants";
import coursesService from "./services/courses";
import RightSidebar from "./sidebar/RightSidebar";
import Sidebar from "./sidebar/Sidebar";

const Main = styled("main", {
  shouldForwardProp: prop => !["pageTitle", "sidebarState", "rightSidebarState"].includes(prop)
})(({ theme, pageTitle, sidebarState, rightSidebarState }) => ({
  flexGrow: 1,
  padding: theme.spacing(1),
  // Transition when sidebar(s) closes
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `${sidebarState === ON ? "20%" : "0%"}`,
  marginRight: `${rightSidebarState === ON && pageTitle !== "Course List" ? "25%" : "0%"}`,
  // Transition when sidebar(s) opens
  ...(sidebarState === ON && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

function App() {
  const [courses, setCourses] = useState([]);
  const [sidebarState, setSidebarState] = useState(OFF);
  const [rightSidebarState, setRightSidebarState] = useState(OFF);
  const [focused, setFocused] = useState(false);
  const [mouseLeft, setMouseLeft] = useState(true);
  const [week, setWeek] = useState(1);
  const [pageTitle, setPageTitle] = useState("Course List");
  const [courseFilter, setCourseFilter] = useState("");

  useEffect(() => {
    coursesService.getAll()
      .then(returnedCourses => setCourses(returnedCourses))
      .catch(err => console.error(err));
  }, []);

  const addCourse = (newCourse) => {
    // Convert Map to Object
    newCourse.schedules = Object.fromEntries(newCourse.schedules);

    coursesService.create(newCourse)
      .then(returnedCourse => setCourses(courses.concat(returnedCourse)))
      .catch(err => console.error(err));
  };

  const editCourse = (updatedCourse) => {
    // Convert Map to Object
    updatedCourse.schedules = Object.fromEntries(updatedCourse.schedules);

    coursesService.update(updatedCourse)
      .then(returnedCourse => setCourses(courses.map(
        course => course.id === returnedCourse.id ? returnedCourse : course
      )))
      .catch(err => console.error(err));
  };

  const deleteCourse = (id) => {
    coursesService.delData(id)
      .then(() => setCourses(courses.filter((course) => course.id !== id)))
      .catch(err => console.error(err));
  };

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
  };

  const courseListProps = {
    courses,
    courseFilter,
    handleDelete: deleteCourse
  };

  return (
    <Router>
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>

        <AppHeader {...appHeaderProps} setRightSidebarState={setRightSidebarState} setFocused={setFocused} mouseLeft={mouseLeft} />

        <Sidebar sidebarState={sidebarState} />

        {pageTitle !== "Course List" && <RightSidebar {...courseListProps} rightSidebarState={rightSidebarState} setRightSidebarState={setRightSidebarState} focused={focused} setMouseLeft={setMouseLeft} />}

        <Main sidebarState={sidebarState} rightSidebarState={rightSidebarState} pageTitle={pageTitle}>
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
        </Main>
      </DndProvider>
    </Router>
  );
}

export default App;
