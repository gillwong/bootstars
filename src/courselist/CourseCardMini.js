import { Card, CardContent, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React, { useState } from "react";

const CourseCardMini = ({
  course,
  index,
  timing,
  mt,
  height,
  group
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      sx={{
        backgroundColor: "secondary.main",
        color: "white",
        position: "absolute",
        overflow: "hidden",
        mt: mt,
        width: 1,
        height: hovered ? "auto" : `${height * 100}%`,
        zIndex: hovered ? 2 : 1
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardContent sx={{ padding: 1 }}>
        <Typography
          variant="subtitle2"
        >
          {course.code}
        </Typography>
        <Typography
          variant="body1"
        >
          {timing}
        </Typography>
        <Typography
          variant="body1"
        >
          {index}
        </Typography>
        <Typography
          variant="body1"
        >
          {group.type} {group.group}
        </Typography>
        <Typography
          variant="body1"
        >
          {group.venue}
        </Typography>
      </CardContent>

    </Card>
  );
};

CourseCardMini.propTypes = {
  course: PropTypes.object,
  index: PropTypes.number,
  timing: PropTypes.string,
  mt: PropTypes.number,
  height: PropTypes.number,
  group: PropTypes.object
};

export default CourseCardMini;