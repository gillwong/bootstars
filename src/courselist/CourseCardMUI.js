import { DeleteOutline, InfoOutlined, ModeEditOutlineOutlined } from "@mui/icons-material";
import { Card, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const CourseCardMUI = ({ course, handleDelete }) => {
  return (
    <Card sx={{ margin: 1 }}>
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