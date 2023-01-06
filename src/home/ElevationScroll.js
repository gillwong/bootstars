import { useScrollTrigger } from "@mui/material";
import { cloneElement } from "react";

const ElevationScroll = ({ children }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0
  });
  return cloneElement(children, { elevation: trigger ? 4 : 0 });
};

export default ElevationScroll;