import { Button, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const Icon = ({ edge }) => {
  return (
    <Button
      component={RouterLink}
      to="/"
      color="inherit"
      underline="none"
      variant="text"
      sx={{
        ml: edge === "start" ? -1 : 0,
        "&:hover": {
          color: "inherit"
        }
      }}
    >
      <Typography variant="h6">
        Material STARS
      </Typography>
    </Button>
  );
};

Icon.propTypes = { edge: PropTypes.string };

export default Icon;