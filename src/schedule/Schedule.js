import { Box, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import PropTypes from "prop-types";
import React, { Fragment, useEffect } from "react";
import { useState } from "react";

import { DAYS } from "../services/constants";
import GridSchedule from "./GridSchedule";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const Schedule = ({
  onLoadPage,
  prevTableContent,
  toolbarHeight,
  tableContent,
  setPrevTableContent,
  setTableContent
}) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  const [dropIndex, setDropIndex] = useState(undefined);
  const [childItemObj, setChildItemObj] = useState(null);
  const [anyHoverEvent, setAnyHoverEvent] = useState(false);

  const addToTable = (course, table, classIndex) => {
    let newTableContent = structuredClone(table);

    for(let i = 0; i < course.schedules[classIndex].length; i++) {
      let classTimeStart = course.schedules[classIndex][i].time.substring(0, 5);
      let classTimeEnd = course.schedules[classIndex][i].time.substring(8);

      let classTimeStartObj = dayjs(classTimeStart, "HH.mm");
      let classTimeEndObj = dayjs(classTimeEnd, "HH.mm");
      let duration = classTimeEndObj.diff(classTimeStartObj, "h", true);

      newTableContent[
        parseInt(classTimeStart.substring(0, 2)) - 7
      ][
        DAYS.findIndex(el => el === course.schedules[classIndex][i].day) + 1
      ] = {
        course,
        index: classIndex,
        classTimeStart,
        classTimeEnd,
        timing: `${classTimeStart} - ${classTimeEnd}`,
        duration,
        group: course.schedules[classIndex][i]
      };
    }
    // console.log({ course, table, newTableContent });
    return newTableContent;
  };

  useEffect(onLoadPage, [onLoadPage]);

  // debug
  // useEffect(() => {
  //   console.log("render Schedule component");
  //   console.log({ prevTableContent, tableContent });
  // });

  useEffect(() => {
    // console.log({ dropIndex, anyHoverEvent });
    if(anyHoverEvent && dropIndex) {
      setTableContent(addToTable(childItemObj, prevTableContent, dropIndex));
    } else {
      const newTableContent = structuredClone(prevTableContent);
      setTableContent(newTableContent);
    }
  }, [dropIndex, anyHoverEvent]);

  return (
    <Box sx={{ flexGrow: 1, py: 1 }}>
      <Toolbar sx={toolbarHeight ? { height: `${toolbarHeight}px` } : {}} />
      <Grid2
        container
        spacing={2}
        columns={8}
        sx={{
          margin: 0,
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
                  {isMd
                    ? <Typography variant="button" color="text.secondary">{content}</Typography>
                    : <Typography variant="button" color="text.secondary">{content !== "Time" ? content.substring(0, 3) : content}</Typography>
                  }
                </Grid2>)
              : row.map((content, j) =>
                j === 0
                  ? <Grid2
                    key={j}
                    xs={1}
                    textAlign="right"
                    sx={{
                      pt: 2,
                    }}
                  >
                    <Typography variant="button" color="text.secondary" sx={{ display: "block", mt: 1, mb: -1, mr: -0.5 }}>{content}</Typography>
                  </Grid2>
                  : <GridSchedule
                    key={j}
                    pos={[i, j]}
                    dropIndex={dropIndex}
                    childItemObj={childItemObj}
                    prevTableContent={prevTableContent}
                    setPrevTableContent={setPrevTableContent}
                    tableContent={tableContent}
                    setDropIndex={setDropIndex}
                    setChildItemObj={setChildItemObj}
                    setAnyHoverEvent={setAnyHoverEvent}
                    setTableContent={setTableContent}
                    addToTable={addToTable}
                  >{content}</GridSchedule>
              )}
          </Fragment>
        )}

      </Grid2>
    </Box>
  );
};

Schedule.propTypes = {
  onLoadPage: PropTypes.func.isRequired,
  tableContent: PropTypes.array.isRequired,
  prevTableContent: PropTypes.array.isRequired,
  toolbarHeight: PropTypes.number.isRequired,
  setTableContent: PropTypes.func.isRequired,
  setPrevTableContent: PropTypes.func.isRequired
};

export default Schedule;