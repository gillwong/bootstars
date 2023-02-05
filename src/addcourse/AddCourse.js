import { Add } from "@mui/icons-material";
import { Fab, Toolbar, Zoom } from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import PropTypes from "prop-types";
import React, { Fragment, useEffect,useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";
import { DashLg, PlusLg } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";

import coursesServices from "../services/courses";
import parseCourse from "../services/parser";
import AddSchedule from "./AddSchedule";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const AddCourse = ({
  mode,
  toolbarHeight,
  handleAdd,
  handleEdit,
  onLoadPage
}) => {
  let selectedIndex = new Set();
  const { id } = useParams();  // undefined if no parameter id exists

  const [ indexFilter, setIndexFilter ] = useState("");
  const [ htmlParse, setHtmlParse ] = useState(null);

  const [ addIndex, setAddIndex] = useState("");
  const [ hasFinals, toggleHasFinals ] = useState(false);

  const [ code, setCode ] = useState("");
  const [ title, setTitle ] = useState("");
  const [ school, setSchool ] = useState("");
  const [ au, setAu ] = useState(3);
  const [ grading, setGrading ] = useState("Letter-Graded");
  const [ prereqStr, setPrereqStr ] = useState("");
  const [ prereqNote, setPrereqNote ] = useState("");
  const [ exclusiveStr, setExclusiveStr ] = useState("");
  const [ progExc, setProgExc ] = useState("");
  const [ ayExc, setAyExc ] = useState("");
  const [ bde, toggleBde ] = useState(true);
  const [ gerpe, toggleGerpe ] = useState(true);
  const [ ue, toggleUe ] = useState(true);
  const [ examSchedule, setExamSchedule ] = useState(new Date());
  const [ duration, setDuration ] = useState(1);
  const [ schedules, setSchedules ] = useState(new Map());

  const navigate = useNavigate();

  useEffect(onLoadPage, [onLoadPage]);

  useEffect(() => {
    if(mode === "EDIT" || mode === "VIEW") {
      coursesServices.getData(id)
        .then(returnedCourse => {
          toggleHasFinals(returnedCourse.examSchedule !== "Not Applicable");
          setTitle(returnedCourse.title);
          setCode(returnedCourse.code);
          setAu(returnedCourse.au);
          setSchool(returnedCourse.school);
          setPrereqStr(returnedCourse.prereq);
          setPrereqNote(returnedCourse.prereqNote);
          setExclusiveStr(returnedCourse.exclusive);
          setProgExc(returnedCourse.programmeExclude);
          setAyExc(returnedCourse.ayExclude);
          toggleBde(returnedCourse.bde);
          toggleGerpe(returnedCourse.gerpe);
          setGrading(returnedCourse.grading);
          setExamSchedule(returnedCourse.examSchedule !== "Not Applicable" ? returnedCourse.examSchedule : new Date());
          setDuration(returnedCourse.examDuration);
          // Convert Object to Map
          returnedCourse.schedules = new Map(Object.entries(returnedCourse.schedules));

          setSchedules(returnedCourse.schedules);
        })
        .catch(err => console.error(err));
    }
  }, [id, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let newCourse = {
      code,
      title,
      school,
      au,
      grading,
      prereq: prereqStr,
      prereqNote: prereqNote,
      exclusive: exclusiveStr,
      programmeExclude: progExc,
      ayExclude: ayExc,
      bde,
      gerpe,
      ue,
      examSchedule: hasFinals ? examSchedule : "Not Applicable",
      examDuration: hasFinals ? duration : 0,
      schedules
    };

    switch(mode) {
    case "EDIT":
      newCourse["id"] = id;
      handleEdit(newCourse);
      navigate(-1);
      break;
    case "ADD":
      handleAdd(newCourse);
      navigate("/list");
      break;
    default:
      break;
    }
  };

  const changeSchedules = (index, subIndex, property, value) => {
    const updatedSchedules = new Map([...schedules]);
    let updatedGroups = updatedSchedules.get(index);
    updatedGroups[subIndex][property] = value;
    updatedSchedules.set(index, updatedGroups);
    setSchedules(updatedSchedules);
  };

  const handleParse = () => {
    const reader = new FileReader();
    reader.readAsText(htmlParse);
    reader.onload = (e) => {
      const htmlString = e.target.result;
      const courseParsed = parseCourse(htmlString);
      toggleHasFinals(courseParsed.hasFinals);
      setTitle(courseParsed.title);
      setCode(courseParsed.code);
      setAu(courseParsed.au);
      setSchool(courseParsed.school);
      setPrereqStr(courseParsed.prereq);
      setPrereqNote(courseParsed.prereqNote);
      setExclusiveStr(courseParsed.exclusive);
      setProgExc(courseParsed.programmeExc);
      setAyExc(courseParsed.ayExclude);
      toggleBde(courseParsed.bde);
      toggleGerpe(courseParsed.gerpe);
      toggleUe(courseParsed.ue);
      setGrading(courseParsed.grading);
      setExamSchedule(courseParsed.examSchedule);
      setDuration(courseParsed.examDuration);
      setSchedules(courseParsed.schedules);
    };
  };

  return (
    <Container className="py-4">
      <Toolbar sx={toolbarHeight ? { height: `${toolbarHeight}px` } : {}} />
      <h2>{mode === "EDIT" ? "Edit" : mode === "VIEW" ? "View" : "Add"} Course</h2>
      <hr />
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group>
            <Form.Label>Course Name</Form.Label>
            <Form.Control
              required
              disabled={mode === "VIEW"}
              type="text"
              placeholder="Enter Course Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Col><Form.Group>
            <Form.Label>Course Code</Form.Label>
            <Form.Control
              required
              disabled={mode === "VIEW"}
              type="text"
              placeholder="Enter Course Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Form.Text>Eg., ML0004</Form.Text>
          </Form.Group></Col>
          <Col><Form.Group>
            <Form.Label>No. of AU</Form.Label>
            <InputGroup>
              <Form.Control
                required
                disabled={mode === "VIEW"}
                type="number"
                min="0"
                value={au}
                onChange={(e) => setAu(e.target.valueAsNumber || 0)}
              />
              <InputGroup.Text>AU</InputGroup.Text>
            </InputGroup>
          </Form.Group></Col>
          <Col><Form.Group>
            <Form.Label>School/College</Form.Label>
            <Form.Control
              required
              disabled={mode === "VIEW"}
              type="text"
              placeholder="Enter School/College"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
            <Form.Text>Eg., CCEB</Form.Text>
          </Form.Group></Col>
        </Row>
        <Row className="mb-3">
          <Form.Group>
            <Form.Label>Course Prerequisite Note</Form.Label>
            <Form.Control
              required
              disabled={mode === "VIEW"}
              type="text"
              placeholder="Enter Course Name"
              value={prereqNote}
              onChange={(e) => setPrereqNote(e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Col><Form.Group>
            <Form.Label>Course Prerequisites</Form.Label>
            <Form.Control
              disabled={mode === "VIEW"}
              as="textarea"
              placeholder="Enter Note/Course(s)"
              value={prereqStr}
              onChange={(e) => setPrereqStr(e.target.value)}
            />
            <Form.Text>Eg., MH1810, SC1005</Form.Text>
          </Form.Group></Col>
          <Col><Form.Group>
            <Form.Label>Mutually Exclusive with</Form.Label>
            <Form.Control
              disabled={mode === "VIEW"}
              as="textarea"
              placeholder="Enter Course(s)"
              value={exclusiveStr}
              onChange={(e) => setExclusiveStr(e.target.value)}
            />
            <Form.Text>Eg., SC1003, CZ1103</Form.Text>
          </Form.Group></Col>
        </Row>
        <Row className="mb-3">
          <Col><Form.Group>
            <Form.Label>Not Available to programme</Form.Label>
            <Form.Control
              disabled={mode === "VIEW"}
              as="textarea"
              placeholder="Enter Programme(s)"
              value={progExc}
              onChange={(e) => setProgExc(e.target.value)}
            />
          </Form.Group></Col>
          <Col><Form.Group>
            <Form.Label>Not Available to all programmes</Form.Label>
            <Form.Control
              disabled={mode === "VIEW"}
              as="textarea"
              placeholder="Enter AY(s)"
              value={ayExc}
              onChange={(e) => setAyExc(e.target.value)}
            />
          </Form.Group></Col>
        </Row>
        <Row className="mb-3">
          <Col><Form.Group>
            <Form.Label className="me-3">Grading Type: </Form.Label>
            <Form.Check
              required
              inline
              checked={grading === "Letter-Graded"}
              type="radio"
              name="gradingType"
              label="Letter-Graded"
              value="Letter-Graded"
              onChange={(e) => {
                if(mode !== "VIEW") {
                  setGrading(e.target.value);
                }
              }}
            />
            <Form.Check
              inline
              checked={grading === "Pass/Fail"}
              type="radio"
              name="gradingType"
              label="Pass/Fail"
              value="Pass/Fail"
              onChange={(e) => {
                if(mode !== "VIEW") {
                  setGrading(e.target.value);
                }
              }}
            />
          </Form.Group></Col>
          <Col><Form.Group>
            <Form.Label className="me-3">Available as: </Form.Label>
            <Form.Check
              inline
              checked={bde}
              type="checkbox"
              label="Broadening and Deepening Elective"
              onChange={() => {
                if(mode !== "VIEW") {
                  toggleBde(!bde);
                }
              }}
            />
            <Form.Check
              inline
              checked={gerpe}
              type="checkbox"
              label="General Education Prescribed Elective"
              onChange={() => {
                if(mode !== "VIEW") {
                  toggleGerpe(!gerpe);
                }
              }}
            />
            <Form.Check
              inline
              checked={ue}
              type="checkbox"
              label="Unrestricted Elective"
              onChange={() => {
                if(mode !== "VIEW") {
                  toggleUe(!ue);
                }
              }}
            />
          </Form.Group></Col>
        </Row>
        <Row className="mb-3"><Form.Group>
          <Form.Check
            checked={hasFinals}
            type="switch"
            label="Final Exam"
            onChange={() => {
              if(mode !== "VIEW") {
                toggleHasFinals(!hasFinals);
              }
            }}
          />
        </Form.Group></Row>
        <Row className={`mb-3 ${!hasFinals && "d-none"}`}>
          <Col>
            <Form.Label>Exam Schedule</Form.Label>
            <Form.Control
              disabled={mode === "VIEW"}
              type="datetime-local"
              value={dayjs(examSchedule).format().substring(0, 16)}
              onChange={(e) => setExamSchedule(dayjs(e.target.value).toDate())}
            />
          </Col>
          <Col>
            <Form.Label>Duration</Form.Label>
            <InputGroup>
              <Form.Control
                disabled={mode === "VIEW"}
                type="number"
                value={duration}
                min="0"
                step="0.01"
                onChange={(e) => setDuration(e.target.valueAsNumber || 0)}
              />
              <InputGroup.Text>hour(s)</InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>
        <Row className="mb-3 mt-4"><Form.Group>
          <Form.Label className="mb-3"><p className="h3">{mode !== "VIEW" && "Set"} Course Schedule</p></Form.Label>
          <Row className="mb-3">
            <Col xs="auto"><InputGroup>
              <InputGroup.Text>Filter:</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="Index"
                value={indexFilter}
                onChange={(e) => setIndexFilter(e.target.value)}
              />
            </InputGroup></Col>
          </Row>
          <Table className="mb-3">
            <thead>
              <tr>
                <th></th>
                <th>Index</th>
                <th>Type</th>
                <th>Group</th>
                <th>Day</th>
                <th>Time</th>
                <th>Venue</th>
                <th>Remark</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...schedules.keys()]
                .filter(scheduleIndex => scheduleIndex.indexOf(indexFilter) !== -1)
                .map(scheduleIndex =>
                  <Fragment key={scheduleIndex}>
                    {schedules.get(scheduleIndex).map((_, i) =>
                      <tr key={i}>
                        {i === 0 && <>
                          <td rowSpan={schedules.get(scheduleIndex).length} className="align-middle">
                            {mode !== "VIEW" && <Form.Check
                              type="checkbox"
                              name="checkboxSchedules"
                              onClick={() => {
                                if(selectedIndex.has(scheduleIndex)) {
                                  selectedIndex.delete(scheduleIndex);
                                } else {
                                  selectedIndex.add(scheduleIndex);
                                }
                              }}
                            />}
                          </td>
                          <td rowSpan={schedules.get(scheduleIndex).length} className="align-middle position-relative">
                            <span className="me-4">{scheduleIndex}</span>
                            <Container className={`px-0 mt-2 ${schedules.get(scheduleIndex).length > 2 && "position-absolute bottom-0 start-0 pb-2 ms-2"}`}>
                              {mode !== "VIEW" && <Button
                                size="sm"
                                variant="outline-secondary"
                                className="d-flex align-items-center p-2"
                                onClick={() => {
                                  let newSchedules = new Map([...schedules]);
                                  newSchedules.set(scheduleIndex, [...newSchedules.get(scheduleIndex), {
                                    type: "",
                                    group: "",
                                    day: "",
                                    time: "",
                                    venue: "",
                                    remark: ""
                                  }]);
                                  setSchedules(newSchedules);
                                }}
                              ><PlusLg /></Button>}
                            </Container>
                          </td>
                        </>}
                        <AddSchedule scheduleMap={schedules} index={scheduleIndex} subIndex={i} changeSchedules={changeSchedules} mode={mode} />
                        <td className="align-middle">
                          {i !== 0 && mode !== "VIEW" && <Button
                            size="sm"
                            variant="danger"
                            className="d-flex align-items-center p-1"
                            onClick={() => {
                              let updatedSchedules = new Map([...schedules]);
                              const filteredGroups = updatedSchedules.get(scheduleIndex).filter((_, j) => j !== i);
                              updatedSchedules.set(scheduleIndex, filteredGroups);
                              setSchedules(updatedSchedules);
                            }}
                          ><DashLg /></Button>}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              }
            </tbody>
          </Table>
          {mode !== "VIEW" && <Row className="mb-1">
            <Col xs="auto" className="d-none"><Form.Label>Add Index: </Form.Label></Col>
            <Col xs="auto"><Form.Control
              type="number"
              placeholder="Add Index"
              value={addIndex}
              onChange={(e) => setAddIndex(e.target.value)}
            /></Col>
            <Col><Button
              variant="secondary"
              className="d-flex align-items-center h-100"
              onClick={() => {
                if(!isNaN(parseInt(addIndex))) {
                  let newSchedules = new Map([...schedules]);
                  newSchedules.set(addIndex.toString().trim(), [{
                    type: "",
                    group: "",
                    day: "",
                    time: "",
                    venue: "",
                    remark: ""
                  }]);
                  setSchedules(newSchedules);
                  setAddIndex("");
                }
              }}><PlusLg /></Button></Col>
            <Col className="d-flex align-items-center justify-content-end"><Button
              size="sm"
              variant="danger"
              onClick={() => {
                let updatedSchedules = new Map([...schedules]);
                selectedIndex.forEach(index => updatedSchedules.delete(index));
                setSchedules(updatedSchedules);
              }}
            >Delete Selected</Button></Col>
          </Row>}
        </Form.Group></Row>
        {mode !== "VIEW" && <><Row><Form.Label>Parse from HTML File</Form.Label></Row>
          <Row className="mb-4">
            <Col xs="auto"><Form.Control
              type="file"
              accept=".html"
              onChange={(e) => setHtmlParse(e.target.files[0])}
            /></Col>
            <Col><Button onClick={handleParse}>Parse</Button></Col>
          </Row></>}
        {mode === "ADD" && <Zoom
          in={true}
        >
          <Fab
            variant="extended"
            color="success"
            type="submit"
            sx={{
              margin: 0,
              position: "fixed",
              top: "auto",
              right: 20,
              bottom: 20,
              left: "auto",
              pr: 3
            }}
          >
            <Add sx={{ mr: 1 }} />Add Course
          </Fab>
        </Zoom>}
        {mode === "EDIT" && <>
          <Button variant="success" type="submit">Edit Course</Button>
          <Button variant="outline-danger" className="float-end" onClick={() => navigate(-1)}>Cancel</Button></>}
        {mode === "VIEW" && <Button variant="primary" onClick={() => navigate(-1)}>Back</Button>}
      </Form>
    </Container>
  );
};

AddCourse.propTypes = {
  mode: PropTypes.string,
  toolbarHeight: PropTypes.number.isRequired,
  handleAdd: PropTypes.func,
  handleEdit: PropTypes.func,
  onLoadPage: PropTypes.func
};

export default AddCourse;