import { RemoveCircle } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React, { useState } from "react";

const CourseCardMini = ({
  course,
  index,
  timing,
  mt,
  height,
  group,
  tableContent,
  setTableContent
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
        pb: 0,
        width: 1,
        height: hovered ? "auto" : `${height * 100}%`,
        zIndex: hovered ? 2 : 1
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardContent
        sx={{
          padding: 1,
          "&:last-child": { pb: 1.5 }
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Typography
            variant="subtitle2"
            display="inline"
          >
            {course.code}
          </Typography>
          <Typography
            variant="caption"
            display="inline"
          >
            {index}
          </Typography>
        </Box>
        <Typography
          variant="body2"
        >
          {timing}
        </Typography>
        <Typography
          variant="body2"
        >
          {group.type} {group.group}
        </Typography>
        <Typography
          variant="body2"
        >
          {group.venue}
        </Typography>
        <Typography
          variant="body2"
        >
          {group.remark}
        </Typography>
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<RemoveCircle />}
            size="small"
            display="flex"
            sx={{ mt: 1, flexGrow: 1 }}
            onClick={() => setTableContent(
              [...tableContent]
                .map(row => row
                  .map(val => {
                    if(val instanceof(Object)
                      && val.course === course
                      && val.indexDrop === index) {
                      return "";
                    }
                    return val;
                  })
                )
            )}
          >Remove</Button>
        </Box>
      </CardContent>

    </Card>
  );
};

CourseCardMini.propTypes = {
  course: PropTypes.object,
  index: PropTypes.string,
  timing: PropTypes.string,
  mt: PropTypes.number,
  height: PropTypes.number,
  group: PropTypes.object,
  tableContent: PropTypes.array,
  setTableContent: PropTypes.func
};

export default CourseCardMini;