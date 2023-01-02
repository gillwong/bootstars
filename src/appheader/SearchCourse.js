import { Search } from "@mui/icons-material";
import { OutlinedInput } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

const SearchCourse = ({
  courseFilter,
  mouseLeft,
  setCourseFilter,
  setRightSidebarState,
  setFocused
}) => {
  return (
    <OutlinedInput
      type="text"
      startAdornment={<Search sx={{ mr: 1 }} />}
      placeholder="Search Course"
      value={courseFilter}
      onChange={e => setCourseFilter(e.target.value)}
      onFocus={() => {
        setFocused(true);
        setRightSidebarState(true);
      }}
      onBlur={() => {
        setFocused(false);
        if(mouseLeft) {
          setRightSidebarState(false);
        }
      }}
      sx={{
        input: { padding: 0 },
        px: 2,
        py: 1,
        mr: -1,
        color: "inherit",
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" }
      }}
    />
  );
};

SearchCourse.propTypes = {
  courseFilter: PropTypes.string,
  mouseLeft: PropTypes.bool,
  setCourseFilter: PropTypes.func,
  setRightSidebarState: PropTypes.func,
  setFocused: PropTypes.func
};

export default SearchCourse;