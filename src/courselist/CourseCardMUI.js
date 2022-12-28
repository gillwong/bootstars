import { DeleteOutline, InfoOutlined, ModeEditOutlineOutlined } from "@mui/icons-material";
import { Card, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import { useDrag } from "react-dnd";
import { Link } from "react-router-dom";
import { ItemTypes } from "../services/constants";

const CourseCardMUI = ({ course, handleDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COURSE,
    item: () => ({ 
      ...course
    }),
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return (
    <Card 
      ref={drag} 
      sx={{ 
        margin: 1, 
        opacity: isDragging ? 0.5 : 1 
      }}
    >
      <CardContent>
        <Typography 
          color="text.secondary" 
          sx={{ fontWeight: "light" }} 
          gutterBottom
        >
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
}
 
export default CourseCardMUI;