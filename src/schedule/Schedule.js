import { Box, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import PropTypes from "prop-types";
import React, { Fragment, useEffect } from "react";

import GridSchedule from "./GridSchedule";

const Schedule = ({
  onLoadPage,
  prevTableContent,
  tableContent,
  setPrevTableContent,
  setTableContent
}) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(onLoadPage, [onLoadPage]);

  // debug
  // useEffect(() => {
  //   console.log("render Schedule component");
  //   console.log({ prevTableContent, tableContent });
  // });

  return (
    <Box sx={{ flexGrow: 1, py: 1 }}>
      <Toolbar sx={{ mb: 2 }} />
      <Grid2
        container
        spacing={2}
        columns={8}
        sx={{
          margin: 0,
          "--Grid-borderWidth": "1px",
          borderTop: "var(--Grid-borderWidth) solid",
          borderLeft: "var(--Grid-borderWidth) solid",
          borderColor: "divider",
          "& > div": {
            borderRight: "var(--Grid-borderWidth) solid",
            borderBottom: "var(--Grid-borderWidth) solid",
            borderColor: "divider"
          }
        }}
      >

        {tableContent.map((row, i) =>
          <Fragment key={i}>
            {i === 0
              ? row.map((content, j) =>
                <Grid2 key={j} xs={1} textAlign="center">
                  {isMd
                    ? <Typography variant="button" color="text.secondary">{content}</Typography>
                    : <Typography variant="button" color="text.secondary">{content !== "Time" ? content.substring(0, 3) : content}</Typography>
                  }
                </Grid2>)
              : row.map((content, j) =>
                j === 0
                  ? <Grid2
                    key={j}
                    xs={1}
                    textAlign="right"
                    sx={{
                      pt: 2,
                    }}
                  >
                    <Typography variant="button" color="text.secondary" sx={{ display: "block", mt: 1, mb: -1, mr: -0.5 }}>{content}</Typography>
                  </Grid2>
                  : <GridSchedule
                    key={j}
                    pos={[i, j]}
                    prevTableContent={prevTableContent}
                    setPrevTableContent={setPrevTableContent}
                    tableContent={tableContent}
                    setTableContent={setTableContent}
                  >{content}</GridSchedule>
              )}
          </Fragment>
        )}

      </Grid2>
    </Box>
  );
};

Schedule.propTypes = {
  onLoadPage: PropTypes.func.isRequired,
  tableContent: PropTypes.array.isRequired,
  prevTableContent: PropTypes.array.isRequired,
  setTableContent: PropTypes.func.isRequired,
  setPrevTableContent: PropTypes.func.isRequired
};

export default Schedule;