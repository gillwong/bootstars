import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { AppBar, Box, Card, CardActionArea, CardContent, CardMedia, Chip, Divider, Grow, IconButton, MobileStepper, Slide, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Background, Parallax } from "react-parallax";

import ElevationScroll from "./ElevationScroll";
import FeaturesTab from "./FeaturesTab";
import Icon from "./Icon";
import addCourseImg from "./images/add_course.png";
import courseListImg from "./images/course_list.png";
import featuresAddCourseImg from "./images/features_add_course.png";
import masonry1Img from "./images/masonry1.png";
import masonry2Img from "./images/masonry2.png";
import scheduleImg from "./images/schedule.png";
import OpenButton from "./OpenButton";
import TransitionScroll from "./TransitionScroll";

const steps = [
  {
    label: "Course List",
    image: courseListImg
  },
  {
    label: "Add Course",
    image: addCourseImg
  },
  {
    label: "Schedule",
    image: scheduleImg
  }
];

const Home = ({ onLoadPage }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    onLoadPage();
    const anchor = document.querySelector("#back-to-top-anchor");
    if(anchor) {
      anchor.scrollIntoView({ block: "center" });
    }
  }, [onLoadPage]);

  const handleAboutClick = () => {
    const anchor = document.querySelector("#about-anchor");
    if(anchor) {
      anchor.scrollIntoView({ block: "center" });
    }
    setActiveTab(0);
  };

  const handleFeaturesClick = () => {
    const anchor = document.querySelector("#features-anchor");
    if(anchor) {
      anchor.scrollIntoView({ block: "center" });
    }
    setActiveTab(1);
  };

  return (<>
    <ElevationScroll>
      <AppBar sx={{
        backgroundColor: "white",
        color: "black"
      }}>
        <Toolbar>
          <Icon edge="start" />
          <OpenButton variant="outlined" sx={{ ml: 2 }} />
          <Tabs value={activeTab} sx={{
            ml: "auto",
            alignSelf: "stretch",
            "& .MuiTabs-scroller": { display: "flex" }
          }}>
            <Tab label="About" onClick={handleAboutClick} />
            <Tab label="Features" onClick={handleFeaturesClick} />
          </Tabs>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
    <Toolbar id="back-to-top-anchor" />
    <Grid2 container id="about-anchor" sx={{ minHeight: "85vh", mb: 3 }}>
      <Grid2 xs={5} display="flex" alignItems="center">
        <Box display="block" sx={{ p: 8 }}>
          <Typography
            variant="h3">
              boot/MUI STARS
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1, mb: 4 }}
          >
            NTU STARS Planner with drag & drop support
          </Typography>
          <OpenButton size="large" variant="contained" />
        </Box>
      </Grid2>
      <Grid2 xs={7} display="flex" alignItems="center" justifyContent="center">
        <Card elevation={8}>
          <CardActionArea>
            <CardMedia sx={{ width: "44.8em", height: "30.1em" }} image={steps[activeStep].image} title={steps[activeStep].label} />
            <CardContent sx={{ py: 1 }}>
              <Typography variant="h6" align="center">{steps[activeStep].label}</Typography>
            </CardContent>
          </CardActionArea>
          <MobileStepper
            variant="dots"
            steps={3}
            position="static"
            activeStep={activeStep}
            sx={{ flexGrow: 1 }}
            backButton={
              <IconButton onClick={() => setActiveStep(prevActiveStep => prevActiveStep - 1)} disabled={activeStep === 0}><KeyboardArrowLeft /></IconButton>
            }
            nextButton={
              <IconButton onClick={() => setActiveStep(prevActiveStep => prevActiveStep + 1)} disabled={activeStep === 2}><KeyboardArrowRight /></IconButton>
            }
          />
        </Card>
      </Grid2>
    </Grid2>
    <Divider><Chip variant="outlined" label="Features"></Chip></Divider>
    <FeaturesTab setActiveTab={setActiveTab}><>
      <Grid2 container id="features-anchor" sx={{ minHeight: "85vh", mt: 3, mb: 2 }}>
        <Grid2 xs={7} display="flex" alignItems="center" justifyContent="center">
          <TransitionScroll windowPercent={0.1}>
            <Slide direction="right" in={false} mountOnEnter unmountOnExit>
              <Card elevation={8}>
                <CardActionArea>
                  <CardMedia sx={{ width: "44.8em", height: "30.1em" }} image={featuresAddCourseImg} title="Add Course" />
                </CardActionArea>
              </Card>
            </Slide>
          </TransitionScroll>
        </Grid2>
        <Grid2 xs={5} display="flex" alignItems="center">
          <Box display="block" sx={{ p: 8 }}>
            <TransitionScroll windowPercent={0.1}>
              <Grow in={false} style={{ transformOrigin: "50% 0 0" }}>
                <Typography
                  variant="h4">
                  Add Courses manually <br />or automatically
                </Typography>
              </Grow>
            </TransitionScroll>
            <TransitionScroll windowPercent={0.125}>
              <Grow in={false} style={{ transformOrigin: "50% 0 0" }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 1, mb: 4 }}
                >
                  Add courses manually or download the course source file from STARS and parse automatically. Courses can be viewed and modified after creation. Use the search course bar to quickly find courses to view or edit.
                </Typography>
              </Grow>
            </TransitionScroll>
          </Box>
        </Grid2>
      </Grid2><Grid2 container sx={{ minHeight: "85vh", my: 2 }}>
        <Grid2 xs={5} display="flex" alignItems="center">
          <Box display="block" sx={{ p: 8 }}>
            <TransitionScroll windowPercent={0.35}>
              <Grow in={false} style={{ transformOrigin: "50% 0 0" }}>
                <Typography
                  variant="h4">
                    Course List
                </Typography>
              </Grow>
            </TransitionScroll>
            <TransitionScroll windowPercent={0.375}>
              <Grow in={false} style={{ transformOrigin: "50% 0 0" }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 1, mb: 4 }}
                >
                All your courses in one masonry grid layout. View, edit, or delete courses from here. Use the search course bar to filter courses.
                </Typography>
              </Grow>
            </TransitionScroll>
          </Box>
        </Grid2>
        <Grid2 xs={7} display="flex" alignItems="center" justifyContent="center">
          <Parallax strength={200}>
            <Background><img src={masonry1Img} style={{ marginLeft: "-32%", width: "180%" }} /></Background>
            <Box sx={{ width: "20em", height: "30em" }} />
          </Parallax>
          <Parallax strength={-100}>
            <Background><img src={masonry2Img} style={{ marginLeft: "-32%", width: "180%" }} /></Background>
            <Box sx={{ width: "20em", height: "30em" }} />
          </Parallax>
        </Grid2>
      </Grid2><Grid2 container sx={{ minHeight: "85vh", my: 2 }}>
        <Grid2 xs={7} display="flex" alignItems="center" justifyContent="center">
          <TransitionScroll windowPercent={0.6}>
            <Slide direction="right" in={false} mountOnEnter unmountOnExit>
              <Card elevation={8}>
                <CardActionArea>
                  <CardMedia sx={{ width: "44.8em", height: "30.1em" }} image={scheduleImg} title="Schedule" />
                </CardActionArea>
              </Card>
            </Slide>
          </TransitionScroll>
        </Grid2>
        <Grid2 xs={5} display="flex" alignItems="center">
          <Box display="block" sx={{ p: 8 }}>
            <TransitionScroll windowPercent={0.575}>
              <Grow in={false} style={{ transformOrigin: "50% 0 0" }}>
                <Typography
                  variant="h4">
                Plan Your Schedule
                </Typography>
              </Grow>
            </TransitionScroll>
            <TransitionScroll windowPercent={0.6}>
              <Grow in={false} style={{ transformOrigin: "50% 0 0" }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 1, mb: 4 }}
                >
                Plan your schedules by dragging and dropping courses to available slots (buggy). Use the search course bar to quickly find courses. Hover over the mini course cards on the calendar to view details or remove them from the schedule.
                </Typography>
              </Grow>
            </TransitionScroll>
          </Box>
        </Grid2>
      </Grid2></>
    </FeaturesTab></>
  );
};

Home.propTypes = {
  onLoadPage: PropTypes.func.isRequired
};

export default Home;