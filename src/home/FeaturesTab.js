import { useScrollTrigger } from "@mui/material";
import { cloneElement } from "react";

const FeaturesTab = ({ children }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: window.innerHeight * 0.1
  });
  return cloneElement(children, { value: trigger ? 1 : 0 });
};

export default FeaturesTab;