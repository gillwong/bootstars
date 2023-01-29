import { blueGrey } from "@mui/material/colors";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { useDrop } from "react-dnd";

import CourseCardMini from "../courselist/CourseCardMini";
import { DAYS, ItemTypes } from "../services/constants";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const GridSchedule = ({
  pos,
  prevTableContent,
  setPrevTableContent,
  tableContent,
  setTableContent
}) => {
  const gridDay = DAYS[pos[1] - 1];
  const gridTimeStart = `${6 + pos[0] < 10 ? "0" : ""}${6 + pos[0]}.00`;
  let classTimeStart, classTimeEnd;
  const classIndex = useRef(undefined);

  const addToTable = (course, table) => {
    let newTableContent = structuredClone(table);

    for(let i = 0; i < course.schedules[classIndex.current].length; i++) {
      classTimeStart = course.schedules[classIndex.current][i].time.substring(0, 5);
      classTimeEnd = course.schedules[classIndex.current][i].time.substring(8);

      let classTimeStartObj = dayjs(classTimeStart, "HH.mm");
      let classTimeEndObj = dayjs(classTimeEnd, "HH.mm");
      let duration = classTimeEndObj.diff(classTimeStartObj, "h", true);

      newTableContent[
        parseInt(classTimeStart.substring(0, 2)) - 7
      ][
        DAYS.findIndex(el => el === course.schedules[classIndex.current][i].day) + 1
      ] = {
        course,
        index: classIndex.current,
        classTimeStart,
        classTimeEnd,
        timing: `${classTimeStart} - ${classTimeEnd}`,
        duration,
        group: course.schedules[classIndex.current][i]
      };
    }
    // console.log({ course, table, newTableContent });
    return newTableContent;
  };

  const [{ isOver, canDrop, itemObj }, drop] = useDrop(() => ({
    accept: ItemTypes.COURSE,
    canDrop: item => {
      const indexes = Object.keys(item.schedules);
      for(let i = 0; i < indexes.length; i++) {
        for(let j = 0; j < item.schedules[indexes[i]].length; j++) {
          if(
            gridTimeStart.substring(0, 2) === item.schedules[indexes[i]][j].time.substring(0, 2)
            && gridDay === item.schedules[indexes[i]][j].day
          ) {
            classTimeStart = item.schedules[indexes[i]][j].time.substring(0, 5);
            classTimeEnd = item.schedules[indexes[i]][j].time.substring(8);
            classIndex.current = indexes[i];
            return true;
          }
        }
      }
      return false;
    },
    drop: item => {
      setPrevTableContent(p => addToTable(item, p));
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
      itemObj: monitor.getItem()
      // { // itemObj members
      //   code: course.code,
      //   title: course.title,
      //   schedules: course.schedules
      // }
    })
  }));

  useEffect(() => {
    const hoverEffect = () => {
      // console.log({ prevTableContent, tableContent });
      if(isOver && canDrop && classIndex) {
        // console.log("hover", { classIndex });
        setTableContent(addToTable(itemObj, prevTableContent));
        // addToTable(itemObj, prevTableContent, setTableContent);
      } else if(!isOver && canDrop && classIndex) {
        const newTableContent = structuredClone(prevTableContent);
        setTableContent(newTableContent);
        // console.log("leave", { newTableContentHover: newTableContent });
      }
    };
    hoverEffect();
  }, [isOver]);

  return (
    <Grid2
      xs={1}
      textAlign="left"
      sx={{
        position: "relative",
        padding: 0,
        backgroundColor: canDrop ? isOver ? blueGrey[300] : blueGrey[50] : "",
      }}
    >
      <Grid2
        ref={drop}
        sx={{
          position: "relative",
          margin: 0,
          height: "100%",
          zIndex: isOver ? 10 : 0,
          // debug
          // backgroundColor: "red",
          // opacity: "50%"
        }}
      >

      </Grid2>
      {tableContent[pos[0]][pos[1]] &&
        <CourseCardMini
          course={tableContent[pos[0]][pos[1]].course}
          index={tableContent[pos[0]][pos[1]].index}
          timing={tableContent[pos[0]][pos[1]].timing}
          mt={tableContent[pos[0]][pos[1]].classTimeStart.substring(3) === "30" ? 3 : 0}
          height={tableContent[pos[0]][pos[1]].duration}
          group={tableContent[pos[0]][pos[1]].group}
          tableContent={tableContent}
          setTableContent={setTableContent}
          setPrevTableContent={setPrevTableContent}
        />
      }
    </Grid2>
  );
};

GridSchedule.propTypes = {
  pos: PropTypes.array,
  prevTableContent: PropTypes.array,
  setPrevTableContent: PropTypes.func,
  tableContent: PropTypes.array,
  setTableContent: PropTypes.func
};

export default GridSchedule;