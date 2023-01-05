import { Search } from "@mui/icons-material";
import { OutlinedInput } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

import { ON } from "../services/constants";

const SearchCourse = ({
  courseFilter,
  setCourseFilter,
  setRightSidebarState
}) => {
  return (
    <OutlinedInput
      type="text"
      startAdornment={<Search sx={{ mr: 1 }} />}
      placeholder="Search Course"
      value={courseFilter}
      onChange={e => setCourseFilter(e.target.value)}
      onFocus={() => setRightSidebarState(ON)}
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
  setCourseFilter: PropTypes.func,
  setRightSidebarState: PropTypes.func
};

export default SearchCourse;