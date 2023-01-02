import { Box, styled, Toolbar, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Fragment, useEffect, useState } from "react";
import { ON } from "../services/constants";
import GridSchedule from "./GridSchedule";

const ScheduleWrapper = styled("main", { shouldForwardProp: prop => prop !== "sideBarState" })(
  ({ theme, sidebarState, rightSidebarState }) => ({
    flexGrow: 1,
    padding: theme.spacing(1),
    // Transition when sidebar(s) closes
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: `${sidebarState === ON ? "20%" : "0%"}`,
    marginRight: `${rightSidebarState === ON ? "25%" : "0%"}`,
    // Transition when sidebar(s) opens
    ...(sidebarState === ON && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    })
  })
);

const Schedule = ({ sidebarState, rightSidebarState, onLoadPage }) => {
  const [prevTableContent, setPrevTableContent] = useState([]);
  const [tableContent, setTableContent] = useState([
    ["Time", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    ["08.00", "", "", "", "", "", "", ""],
    ["09.00", "", "", "", "", "", "", ""],
    ["10.00", "", "", "", "", "", "", ""],
    ["11.00", "", "", "", "", "", "", ""],
    ["12.00", "", "", "", "", "", "", ""],
    ["13.00", "", "", "", "", "", "", ""],
    ["14.00", "", "", "", "", "", "", ""],
    ["15.00", "", "", "", "", "", "", ""],
    ["16.00", "", "", "", "", "", "", ""],
    ["17.00", "", "", "", "", "", "", ""],
    ["18.00", "", "", "", "", "", "", ""],
    ["19.00", "", "", "", "", "", "", ""],
    ["20.00", "", "", "", "", "", "", ""],
    ["21.00", "", "", "", "", "", "", ""],
    ["22.00", "", "", "", "", "", "", ""],
  ]);

  useEffect(onLoadPage, [onLoadPage]);
  return (
    <Box sx={{ flexGrow: 1, py: 2}}>
      <Toolbar />
      <ScheduleWrapper sidebarState={sidebarState} rightSidebarState={rightSidebarState}>
      <Grid2 
        container
        spacing={2}
        columns={8}
        sx={{
          "--Grid-borderWidth": "1px",
          borderTop: "var(--Grid-borderWidth) solid",
          borderLeft: "var(--Grid-borderWidth) solid",
          borderColor: "divider",
          "& > div": {
            borderRight: "var(--Grid-borderWidth) solid",
            borderBottom: "var(--Grid-borderWidth) solid",
            borderColor: "divider"
          }
        }}
      >

        {tableContent.map((row, i) => 
          <Fragment key={i}>
            {i === 0 
              ? row.map((content, j) => 
                <Grid2 key={j} xs={1} textAlign="center">
                  <Typography variant="button" color="text.secondary">{content}</Typography>
                </Grid2>)
              : row.map((content, j) => 
                j === 0 
                  ? <Grid2 key={j} xs={1} textAlign="right">
                    <Typography variant="button" color="text.secondary" sx={{ display: "block", mt: 1, mb: -1, mr: -0.5}}>{content}</Typography>
                  </Grid2>
                  : <GridSchedule 
                    key={j} 
                    pos={[i, j]} 
                    prevTableContent={prevTableContent} 
                    setPrevTableContent={setPrevTableContent} 
                    tableContent={tableContent} 
                    setTableContent={setTableContent}
                  >{content}</GridSchedule>
            )}
          </Fragment>
        )}
        
      </Grid2>
      </ScheduleWrapper>
    </Box>
  );
}
 
export default Schedule;