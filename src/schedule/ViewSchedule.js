/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import Schedule from "./Schedule";

const ViewSchedule = ({
  onLoadPage,
  week,
  tableContent,
  toolbarHeight,
}) => {
  // issue: does not show properly when not accessed through Schedule component
  const [staticTableContent, setStaticTableContent] = useState(undefined);

  useEffect(onLoadPage, [onLoadPage]);

  useEffect(() => {
    const staticTable = tableContent.map((row) =>
      row.map((cell) => {
        if(cell instanceof Object) {
          if(cell.group.teachingWeeks.includes(week)) {
            return cell;
          } else {
            return "";
          }
        } else {
          return cell;
        }
      })
    );
    // console.log({ tableContent, staticTable });
    setStaticTableContent(staticTable);
  }, [tableContent, week]);

  return (staticTableContent &&
    <Schedule
      tableContent={staticTableContent}
      prevTableContent={staticTableContent}
      toolbarHeight={toolbarHeight}
      setTableContent={setStaticTableContent}
      setPrevTableContent={setStaticTableContent}
      onLoadPage={onLoadPage} />
  );
};

ViewSchedule.propTypes = {
  onLoadPage: PropTypes.func.isRequired,
  week: PropTypes.number.isRequired,
  tableContent: PropTypes.array.isRequired,
  toolbarHeight: PropTypes.number.isRequired,
};

export default ViewSchedule;