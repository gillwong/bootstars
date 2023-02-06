import { Add } from "@mui/icons-material";
import { Fab, styled, useMediaQuery, useTheme, Zoom } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { Route, Routes, useNavigate } from "react-router-dom";

import AddCourse from "./addcourse/AddCourse";
import AppHeader from "./appheader/AppHeader";
import CourseList from "./courselist/CourseList";
import Home from "./home/Home";
import Schedule from "./schedule/Schedule";
import ViewSchedule from "./schedule/ViewSchedule";
import { BLANK_SCHEDULE, OFF, ON } from "./services/constants";
import coursesService from "./services/courses";
import storageAvailable from "./services/storageAvailable";
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

  const appHeaderRef = useRef();
  const [toolbarHeight, setToolbarHeight] = useState(0);

  const [scheduleContentTemp, setScheduleContentTemp] = useState(BLANK_SCHEDULE);
  const [scheduleContent, setScheduleContent] = useState(BLANK_SCHEDULE);

  const [courses, setCourses] = useState([]);
  const [sidebarState, setSidebarState] = useState(OFF);
  const [rightSidebarState, setRightSidebarState] = useState(OFF);
  const [week, setWeek] = useState(1);
  const [pageTitle, setPageTitle] = useState("Home");
  const [courseFilter, setCourseFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    coursesService.getAll()
      .then(returnedCourses => setCourses(returnedCourses))
      .catch(err => console.error(err));
    getAppHeaderHeight();
    window.addEventListener("resize", getAppHeaderHeight);
    if(storageAvailable("localStorage")) {
      // localStorage.removeItem("userSchedule");
      if(localStorage.getItem("userSchedule")) {
        const userSchedule = JSON.parse(localStorage.getItem("userSchedule"));
        // console.log(userSchedule);
        setScheduleContentTemp(userSchedule);
        setScheduleContent(userSchedule);
      } else {
        // console.log("BLANK SCHED");
        localStorage.setItem("userSchedule", JSON.stringify(BLANK_SCHEDULE));
      }
    }
  }, []);

  const getAppHeaderHeight = () => {
    const height = Number(appHeaderRef.current?.clientHeight);
    setToolbarHeight(height);
  };

  const addCourse = (newCourse) => {
    // Convert Map to Object
    newCourse.schedules = Object.fromEntries(newCourse.schedules);

    // Adds teachingWeeks to schedules' groups
    Object.keys(newCourse.schedules).forEach((index) => {
      newCourse.schedules[index].forEach((group) => {
        if(group.remark.match(/Wk/)) {
          let teachingWeeksSet = new Set();

          const commaSeperated = group.remark.match(/(\d+,)+\d+/g);
          if(commaSeperated) {
            for(const week of commaSeperated[0].split(",")) {
              teachingWeeksSet.add(Number(week));
            }
          }

          const weekRange = group.remark.match(/(\d+)-(\d+)/);
          if(weekRange) {
            for(let week = Number(weekRange[1]); week <= Number(weekRange[2]); week++) {
              teachingWeeksSet.add(week);
            }
          }

          group.teachingWeeks = Array.from(teachingWeeksSet).sort((a, b) => a - b);
          // console.log(group.teachingWeeks);
        } else {
          group.teachingWeeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        }
      });
    });

    coursesService.create(newCourse)
      .then(returnedCourse => setCourses(courses.concat(returnedCourse)))
      .catch(err => console.error(err));
  };

  const editCourse = (updatedCourse) => {
    // Convert Map to Object
    updatedCourse.schedules = Object.fromEntries(updatedCourse.schedules);

    // Adds teachingWeeks to schedules' groups
    Object.keys(updatedCourse.schedules).forEach((index) => {
      updatedCourse.schedules[index].forEach((group) => {
        if(group.remark.match(/Wk/)) {
          let teachingWeeksSet = new Set();

          const commaSeperated = group.remark.match(/(\d+,)+\d+/g);
          if(commaSeperated) {
            for(const week of commaSeperated[0].split(",")) {
              teachingWeeksSet.add(Number(week));
            }
          }

          const weekRange = group.remark.match(/(\d+)-(\d+)/);
          if(weekRange) {
            for(let week = Number(weekRange[1]); week <= Number(weekRange[2]); week++) {
              teachingWeeksSet.add(week);
            }
          }

          group.teachingWeeks = Array.from(teachingWeeksSet).sort((a, b) => a - b);
          // console.log(group.teachingWeeks);
        } else {
          group.teachingWeeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        }
      });
    });

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
    <DndProvider backend={TouchBackend} options={{
      enableMouseEvents: true,
    }}>
      {pageTitle !== "Home" && <>
        <AppHeader ref={appHeaderRef} {...appHeaderProps} setRightSidebarState={setRightSidebarState} />

        <Sidebar sidebarState={sidebarState} toolbarHeight={toolbarHeight} />

        {pageTitle !== "Course List" && <RightSidebar {...courseListProps} rightSidebarState={rightSidebarState} toolbarHeight={toolbarHeight} setRightSidebarState={setRightSidebarState} />}

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
      </>}
      <Main sidebarState={sidebarState} rightSidebarState={rightSidebarState} pageTitle={pageTitle} isMd={isMd} isSm={isSm}>
        <Routes>
          <Route path="/" element={
            <Home onLoadPage={() => setPageTitle("Home")}/>
          } />
          <Route path="/list" element={
            <CourseList
              {...courseListProps}
              toolbarHeight={toolbarHeight}
              onLoadPage={() => setPageTitle("Course List")}
            />
          } />
          <Route path="/add" element={
            <AddCourse
              mode="ADD"
              toolbarHeight={toolbarHeight}
              handleAdd={addCourse}
              onLoadPage={() => setPageTitle("Add Course")}
            />
          } />
          <Route path="/schedule" element={
            <Schedule
              tableContent={scheduleContent}
              prevTableContent={scheduleContentTemp}
              toolbarHeight={toolbarHeight}
              setTableContent={setScheduleContent}
              setPrevTableContent={setScheduleContentTemp}
              onLoadPage={() => setPageTitle("Schedule")} />
          } />
          <Route path="/schedule/view" element={
            <ViewSchedule
              week={week}
              tableContent={scheduleContent}
              toolbarHeight={toolbarHeight}
              onLoadPage={() => setPageTitle("Schedule View")} />
          } />
          <Route path="/edit/:id" element={
            <AddCourse
              mode="EDIT"
              toolbarHeight={toolbarHeight}
              handleAdd={addCourse}
              handleEdit={editCourse}
              onLoadPage={() => setPageTitle("Edit Course")}
            />
          } />
          <Route path="/view/:id" element={
            <AddCourse
              mode="VIEW"
              toolbarHeight={toolbarHeight}
              onLoadPage={() => setPageTitle("View Course")}
            />
          } />
        </Routes>
      </Main>
    </DndProvider>
  );
}

export default App;
