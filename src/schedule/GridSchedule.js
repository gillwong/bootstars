import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useDrop } from "react-dnd";
import CourseCardMini from "../courselist/CourseCardMini";
import { DAYS, ItemTypes } from "../services/constants";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from "react";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const GridSchedule = ({ pos, prevTableContent, setPrevTableContent, tableContent, setTableContent, children }) => {
  const day = DAYS[pos[1] - 1];
  let timeStart = `${6 + pos[0]}.00`;
  let timeEnd;
  const [indexDrop, setIndexDrop] = useState();

  const addToTable = item => {
    let newTableContent = [...tableContent];

    for(let i = 0; i < item.schedules[indexDrop].length; i++) {
      timeStart = item.schedules[indexDrop][i].time.substring(0, 5);
      timeEnd = item.schedules[indexDrop][i].time.substring(8);

      let startTime = dayjs(timeStart, "HH.mm");
      let endTime = dayjs(timeEnd, "HH.mm");
      let duration = endTime.diff(startTime, "h", true);

      newTableContent[parseInt(timeStart.substring(0, 2)) - 7][DAYS.findIndex(element => element === item.schedules[indexDrop][i].day) + 1] = {
        course: item,
        indexDrop,
        timeStart,
        timeEnd,
        timing: `${timeStart} - ${timeEnd}`,
        duration,
        group: item.schedules[indexDrop][i]
      }
    }
    setTableContent(newTableContent);
  }

  const [{ isOver, canDrop, itemObj }, drop] = useDrop(() => ({
    accept: ItemTypes.COURSE,
    canDrop: item => {
      const indexes = Object.keys(item.schedules);
      for(let i = 0; i < indexes.length; i++) {
        for(let j = 0; j < item.schedules[indexes[i]].length; j++) {
          if(timeStart.substring(0, 2) === item.schedules[indexes[i]][j].time.substring(0, 2) && day === item.schedules[indexes[i]][j].day) {
            timeStart = item.schedules[indexes[i]][j].time.substring(0, 5);
            timeEnd = item.schedules[indexes[i]][j].time.substring(8);
            setIndexDrop(indexes[i]);
            // console.log({ timeStart, timeEnd, indexDrop });
            return true;
          }
        }
      }
      return false;
    },
    drop: item => {
      addToTable(item);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
      itemObj: monitor.getItem()
    })
  }), [pos])

  useEffect(() => {
    if(isOver && canDrop && indexDrop) {
      // console.log({ isOver, prevTableContent, tableContent });
      const newPrevTableContent = structuredClone(tableContent);
      setPrevTableContent(newPrevTableContent);
      addToTable(itemObj);
    } else if(!isOver && canDrop && indexDrop) {
      // console.log({ isOver, prevTableContent, tableContent });
      const newTableContent = structuredClone(prevTableContent);
      setTableContent(newTableContent);
    }
  }, [isOver])

  return (
    <Grid2 
      xs={1} 
      textAlign="left"
      sx={{
        position: "relative",
        padding: 0,
        backgroundColor: canDrop ? isOver ? "navy" : "lightblue" : "",
      }}
    >
      <Grid2
        ref={drop}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          margin: 0,
          zIndex: isOver ? 5 : 0,
        }}
      >
        
      </Grid2>
      {tableContent[pos[0]][pos[1]] && 
        <CourseCardMini 
          course={tableContent[pos[0]][pos[1]].course} 
          index={tableContent[pos[0]][pos[1]].indexDrop} 
          timing={tableContent[pos[0]][pos[1]].timing}
          mt={tableContent[pos[0]][pos[1]].timeStart.substring(3) === "30" ? 2.5 : 0}
          height={tableContent[pos[0]][pos[1]].duration}
          group={tableContent[pos[0]][pos[1]].group}
        />
      }
    </Grid2>
  );
}

export default GridSchedule;