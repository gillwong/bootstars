import { useScrollTrigger } from "@mui/material";
import { cloneElement } from "react";

const SlideScroll = ({ children, windowPercent }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: document.documentElement.scrollHeight * windowPercent
  });
  return cloneElement(children, { in: trigger });
};

export default SlideScroll;