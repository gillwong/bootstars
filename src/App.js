import { Add } from "@mui/icons-material";
import { Fab, styled, useMediaQuery, useTheme, Zoom } from "@mui/material";
import { MultiBackend } from "dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { Route, Routes, useNavigate } from "react-router-dom";

import AddCourse from "./addcourse/AddCourse";
import AppHeader from "./appheader/AppHeader";
import CourseList from "./courselist/CourseList";
import Schedule from "./schedule/Schedule";
import { OFF, ON } from "./services/constants";
import coursesService from "./services/courses";
import RightSidebar from "./sidebar/RightSidebar";
import Sidebar from "./sidebar/Sidebar";

const Main = styled("main", {
  shouldForwardProp: prop => !["pageTitle", "sidebarState", "rightSidebarState", "isMd", "isSm"].includes(prop)
})(({ theme, pageTitle, sidebarState, rightSidebarState, isMd, isSm }) => ({
  flexGrow: 1,
  padding: theme.spacing(1),
  // Transition when sidebar(s) closes
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `${
    sidebarState === ON
      ? isSm
        ? "0%"
        : isMd
          ? "10%"
          : "20%"
      : "0%"
  }`,
  marginRight: `${
    rightSidebarState === ON && pageTitle !== "Course List"
      ? "25%"
      : "0%"
  }`,
  // Transition when sidebar(s) opens
  ...(sidebarState === ON && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

function App() {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [courses, setCourses] = useState([]);
  const [sidebarState, setSidebarState] = useState(OFF);
  const [rightSidebarState, setRightSidebarState] = useState(OFF);
  const [week, setWeek] = useState(1);
  const [pageTitle, setPageTitle] = useState("Course List");
  const [courseFilter, setCourseFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    coursesService.getAll()
      .then(returnedCourses => setCourses(returnedCourses))
      .catch(err => console.error(err));
  }, []);

  const addCourse = (newCourse) => {
    coursesService.create(newCourse)
      .then(returnedCourse => setCourses(courses.concat(returnedCourse)))
      .catch(err => console.error(err));
  };

  const editCourse = (updatedCourse) => {
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
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>

      <AppHeader {...appHeaderProps} setRightSidebarState={setRightSidebarState} />

      <Sidebar sidebarState={sidebarState} />

      {pageTitle !== "Course List" && <RightSidebar {...courseListProps} rightSidebarState={rightSidebarState} setRightSidebarState={setRightSidebarState} />}

      {!["Add Course", "Edit Course", "View Course"].includes(pageTitle) && <Zoom in={true}><Fab
        color="secondary"
        onClick={() => navigate("/add")}
        sx={{
          margin: 0,
          position: "fixed",
          top: "auto",
          right: 20,
          bottom: 20,
          left: "auto"
        }}
      >
        <Add />
      </Fab></Zoom>}

      <Main sidebarState={sidebarState} rightSidebarState={rightSidebarState} pageTitle={pageTitle} isMd={isMd} isSm={isSm}>
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
  );
}

export default App;
