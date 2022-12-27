import { Search } from "@mui/icons-material";
import { OutlinedInput } from "@mui/material";

const SearchCourseMUI = ({ courseFilter, setCourseFilter }) => {
  return (
    <OutlinedInput 
      type="text"
      startAdornment={<Search sx={{ mr: 1 }} />}
      placeholder="Search Course"
      value={courseFilter}
      onChange={e => setCourseFilter(e.target.value)}
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
}
 
export default SearchCourseMUI;