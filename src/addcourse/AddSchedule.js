import PropTypes from "prop-types";
import React from "react";
import Form from "react-bootstrap/Form";

const AddSchedule = ({
  scheduleMap,
  index,
  subIndex,
  changeSchedules,
  mode
}) => {
  return (
    <>
      <td><Form.Control disabled={mode === "VIEW"} required size="sm" type="text" value={scheduleMap.get(index)[subIndex].type} onChange={(e) => changeSchedules(index, subIndex, "type", e.target.value)} /></td>
      <td><Form.Control disabled={mode === "VIEW"} required size="sm" type="text" value={scheduleMap.get(index)[subIndex].group} onChange={(e) => changeSchedules(index, subIndex, "group", e.target.value)} /></td>
      <td><Form.Control disabled={mode === "VIEW"} required size="sm" type="text" value={scheduleMap.get(index)[subIndex].day} onChange={(e) => changeSchedules(index, subIndex, "day", e.target.value)} /></td>
      <td><Form.Control disabled={mode === "VIEW"} required size="sm" type="text" value={scheduleMap.get(index)[subIndex].time} onChange={(e) => changeSchedules(index, subIndex, "time", e.target.value)} /></td>
      <td><Form.Control disabled={mode === "VIEW"} required size="sm" type="text" value={scheduleMap.get(index)[subIndex].venue} onChange={(e) => changeSchedules(index, subIndex, "venue", e.target.value)} /></td>
      <td><Form.Control disabled={mode === "VIEW"} size="sm" type="text" value={scheduleMap.get(index)[subIndex].remark} onChange={(e) => changeSchedules(index, subIndex, "remark", e.target.value)} /></td>
    </>
  );
};

AddSchedule.propTypes = {
  scheduleMap: PropTypes.instanceOf(Map),
  index: PropTypes.string,
  subIndex: PropTypes.number,
  changeSchedules: PropTypes.func,
  mode: PropTypes.string
};

export default AddSchedule;