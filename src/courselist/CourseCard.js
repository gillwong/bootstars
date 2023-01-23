import { DeleteOutline, DragHandle, InfoOutlined, ModeEditOutlineOutlined } from "@mui/icons-material";
import { Card, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import PropTypes from "prop-types";
import React from "react";
import { useDrag } from "react-dnd";
import { Link } from "react-router-dom";

import { ItemTypes } from "../services/constants";

const CourseCard = ({ course, handleDelete }) => {
  const [{ isDragging }, dragSource, dragPreview] = useDrag(() => ({
    type: ItemTypes.COURSE,
    item: () => ({
      code: course.code,
      title: course.title,
      schedules: course.schedules
    }),
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  return (
    <Card
      ref={dragPreview}
      sx={{
        margin: 1,
        backgroundColor: blueGrey[50],
        opacity: isDragging ? 0.5 : 1
      }}
    >
      <CardContent>
        <Typography
          ref={dragSource}
          color="text.secondary"
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            fontWeight: "light"
          }}
          gutterBottom
        >
          <DragHandle sx={{ ml: -0.5, mr: 1 }} />
          {course.grading}
        </Typography>
        <Typography
          variant="h6"
          sx={{ lineHeight: 1.25 }}
          gutterBottom
        >
          {course.title}
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
        >
          {course.code}
        </Typography>
        <Typography
          variant="body1"
          display="inline"
        >
          by {course.school}
        </Typography>
        <Typography
          variant="body1"
          display="inline"
          sx={{ float: "right" }}
        >
          {course.au} AU
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Link to={`/view/${course.id}`}><IconButton><InfoOutlined /></IconButton></Link>
        <Link to={`/edit/${course.id}`}><IconButton><ModeEditOutlineOutlined /></IconButton></Link>
        <IconButton
          color="warning"
          onClick={() => handleDelete(course.id)}
          sx={{ ml: "auto" }}
        >
          <DeleteOutline />
        </IconButton>
      </CardActions>
    </Card>
  );
};

CourseCard.propTypes = {
  course: PropTypes.object,
  handleDelete: PropTypes.func
};

export default CourseCard;