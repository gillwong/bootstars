import { Masonry } from "@mui/lab";
import { Toolbar, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import CourseCard from "./CourseCard";

const CourseList = ({
  columns,
  courses,
  courseFilter,
  toolbarHeight,
  handleDelete,
  onLoadPage
}) => {

  useEffect(onLoadPage, [onLoadPage]);

  return (<>
    {!columns && <Toolbar sx={toolbarHeight ? { height: `${toolbarHeight}px` } : {}} />}
    {courses.length === 0 && <Typography variant="h5" align="center" color="text.secondary" sx={{ mt: 2 }}>No courses have been added.</Typography>}
    <Masonry
      columns={columns || { xs: 1, sm: 2, md: 3, lg: 4 }}
      spacing="2"
      sx={{ margin: 0, pt: 1 }}
    >

      {courses
        .filter(course =>
          course.code.toLowerCase().indexOf(courseFilter.toLowerCase()) !== -1 ||
          course.title.toLowerCase().indexOf(courseFilter.toLowerCase()) !== -1)
        .map(course => <CourseCard key={course.id} course={course} handleDelete={handleDelete} />)}

    </Masonry>
  </>);
};

CourseList.propTypes = {
  columns: PropTypes.number,
  courses: PropTypes.array.isRequired,
  courseFilter: PropTypes.string.isRequired,
  toolbarHeight: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
  onLoadPage: PropTypes.func.isRequired
};

export default CourseList;