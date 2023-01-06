import { useScrollTrigger } from "@mui/material";
import { cloneElement } from "react";

const FeaturesTab = ({ setActiveTab, children }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: window.innerHeight * 0.1
  });
  if(trigger) {
    setActiveTab(1);
  } else {
    setActiveTab(0);
  }
  return cloneElement(children);
};

export default FeaturesTab;