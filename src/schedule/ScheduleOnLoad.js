import { useEffect } from "react";

const ScheduleOnLoad = ({ onLoadPage }) => {
  useEffect(onLoadPage, [onLoadPage]);
  return (<></>);
}
 
export default ScheduleOnLoad;