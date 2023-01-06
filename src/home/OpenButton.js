import { Button } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router-dom";

const OpenButton = ({ size, variant, sx }) => {
  const navigate = useNavigate();
  return (
    <Button
      size={size}
      variant={variant}
      color="primary"
      onClick={() => navigate("/list")}
      sx={sx}
    >
      Open bootSTARS
    </Button>
  );
};

OpenButton.propTypes = {
  size: PropTypes.string,
  variant: PropTypes.string,
  sx: PropTypes.object
};

export default OpenButton;