import { blueGrey } from "@mui/material/colors";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { useDrop } from "react-dnd";

import CourseCardMini from "../courselist/CourseCardMini";
import { DAYS, ItemTypes } from "../services/constants";

const GridSchedule = ({
  pos,
  setPrevTableContent,
  tableContent,
  setDropIndex,
  setChildItemObj,
  setAnyHoverEvent,
  setTableContent,
  addToTable
}) => {
  const gridDay = DAYS[pos[1] - 1];
  const gridTimeStart = `${6 + pos[0] < 10 ? "0" : ""}${6 + pos[0]}.00`;
  // eslint-disable-next-line no-unused-vars
  let classTimeStart, classTimeEnd;
  const classIndex = useRef(undefined);

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
      setPrevTableContent(p => addToTable(item, p, classIndex.current));
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
    if(canDrop && isOver) {
      console.log("YES", { dropIndex: classIndex.current, childItemObj: itemObj });
      setDropIndex(classIndex.current);
      setChildItemObj(structuredClone(itemObj));
      setAnyHoverEvent(true);
    } else if(canDrop && !isOver) {
      console.log("NO", { dropIndex: classIndex.current, childItemObj: itemObj });
      setAnyHoverEvent(false);
    }
  }, [isOver]);

  return (
    <Grid2
      xs={1}
      textAlign="left"
      sx={{
        position: "relative",
        padding: 0,
        pr: 1,
        pb: 1,
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
  setPrevTableContent: PropTypes.func,
  tableContent: PropTypes.array,
  setTableContent: PropTypes.func,
  setDropIndex: PropTypes.func,
  setChildItemObj: PropTypes.func,
  setAnyHoverEvent: PropTypes.func,
  addToTable: PropTypes.func.isRequired
};

export default GridSchedule;