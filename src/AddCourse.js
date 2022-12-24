import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup';
import { Fragment, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import AddSchedule from './AddSchedule';
import { DashLg, PlusLg } from 'react-bootstrap-icons';
import { useNavigate, useParams } from 'react-router-dom';
import coursesServices from './services/courses';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const AddCourse = ({ handleAdd, handleEdit, onLoadPage, mode }) => {
  let selectedIndex = new Set();
  const { id: editId } = useParams();  // undefined if no parameter id exists

  const [ indexFilter, setIndexFilter ] = useState("");
  const [ htmlParse, setHtmlParse ] = useState(null);

  const [ addIndex, setAddIndex] = useState("");
  const [ hasFinals, toggleHasFinals ] = useState(false);
  const [ name, setName ] = useState("");
  const [ code, setCode ] = useState("");
  const [ au, setAu ] = useState(3);
  const [ school, setSchool ] = useState("");
  const [ prereqStr, setPrereqStr ] = useState("");
  const [ exclusiveStr, setExclusiveStr ] = useState("");
  const [ progExc, setProgExc ] = useState("");
  const [ ayExc, setAyExc ] = useState("");
  const [ bde, toggleBde ] = useState(true); 
  const [ gerpe, toggleGerpe ] = useState(true); 
  const [ grading, setGrading ] = useState("Letter-Graded");
  const [ examSchedule, setExamSchedule ] = useState(new Date());
  const [ duration, setDuration ] = useState(1);
  const [ schedules, setSchedules ] = useState({});

  const navigate = useNavigate();

  useEffect(onLoadPage, [onLoadPage]);

  useEffect(() => {
    if(mode === "EDIT" || mode === "VIEW") {
      coursesServices.getData(editId)
        .then(returnedCourse => {
          toggleHasFinals(returnedCourse.examSchedule !== "Not Applicable");
          setName(returnedCourse.title);
          setCode(returnedCourse.code);
          setAu(returnedCourse.au);
          setSchool(returnedCourse.school);
          setPrereqStr(returnedCourse.prereq.join(", "));
          setExclusiveStr(returnedCourse.exclusive.join(", "));
          setProgExc(returnedCourse.programmeExclude);
          setAyExc(returnedCourse.ayExclude);
          toggleBde(returnedCourse.bde);
          toggleGerpe(returnedCourse.gerpe);
          setGrading(returnedCourse.grading);
          setExamSchedule(returnedCourse.examSchedule !== "Not Applicable" ? returnedCourse.examSchedule : new Date());
          setDuration(returnedCourse.examDuration);
          setSchedules(returnedCourse.schedules);
        })
        .catch(err => console.error(err));
    }
  }, [editId, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let newCourse = {
      code,
      title: name,
      school,
      au,
      grading,
      prereq: prereqStr.split(", ").join(" & ").split(" & "),
      exclusive: exclusiveStr.split(", ").join(" & ").split(" & "),
      programmeExclude: progExc,
      ayExclude: ayExc,
      bde,
      gerpe,
      examSchedule: hasFinals ? examSchedule : "Not Applicable",
      examDuration: hasFinals ? duration : 0,
      schedules
    }
    switch(mode) {
      case "EDIT":
        newCourse["id"] = editId;
        handleEdit(newCourse);
        navigate(-1);
        break;
      case "ADD":
        handleAdd(newCourse);
        navigate("/");
        break;
    }
  }

  const changeSchedules = (index, subIndex, property, value) => {
    const updatedSchedules = {...schedules};
    updatedSchedules[index][subIndex][property] = value;
    setSchedules(updatedSchedules);
  }

  const handleParse = () => {
    const reader = new FileReader();
    reader.readAsText(htmlParse);
    reader.onload = (e) => {
      const htmlString = e.target.result;
      const parser = new DOMParser();
      const parsedDocument = parser.parseFromString(htmlString, "text/html");
      const evalXPath = (xpath) => {
        return parsedDocument.evaluate(xpath, parsedDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }

      const codeParsed = evalXPath(`//td[.//*[contains(text(),"[+]")]]`).innerText.trim().substring(4);

      const nameParsed = evalXPath(`//td[.//*[contains(text(),"[+]")]]/following-sibling::*[1]`).innerText.trim();

      const auParsed = parseInt(evalXPath(`//td[.//*[contains(text(),"[+]")]]/following-sibling::*[2]`).innerText.trim().split(' ')[0]);

      const schoolParsed = evalXPath(`//td[.//*[contains(text(),"[+]")]]/following-sibling::*[3]`).innerText.trim();

      const prereqParsedNode = evalXPath(`//td[.//*[contains(text(),"Prerequisite")]]/following-sibling::*`);
      const prereqParsed = prereqParsedNode ? prereqParsedNode.innerText.trim() : "";

      const excParsedNode = evalXPath(`//td[.//*[contains(text(),"Mutually exclusive")]]/following-sibling::*`);
      const excParsed = excParsedNode ? excParsedNode.innerText.trim() : "";

      const progExcParsedNode = evalXPath(`//td[.//*[contains(text(),"Not available to Programme")]]/following-sibling::*`);
      const progExcParsed = progExcParsedNode ? progExcParsedNode.innerText.trim() : "";

      const ayExcParsedNode = evalXPath(`//td[.//*[contains(text(),"Not available to all Programme")]]/following-sibling::*`);
      const ayExcParsed = ayExcParsedNode ? ayExcParsedNode.innerText.trim() : "";

      const gradingTypeParsed = evalXPath(`//td[.//*[contains(text(),"Grading Type")]]/following-sibling::*`).innerText.trim();

      const examScheduleParsed = evalXPath(`//td[.//*[contains(text(),"Exam Schedule")]]/following-sibling::*`).innerText.trim();

      const bdeRemarkParsed = evalXPath(`//tr[.//*[contains(text(),"Remark")]]/following-sibling::*[1]`).innerText.trim();

      const gerpeRemarkParsed = evalXPath(`//tr[.//*[contains(text(),"Remark")]]/following-sibling::*[2]`).innerText.trim();

      const scheduleNodesSnapshot = parsedDocument.evaluate(`//table[@border="1"]/tbody/tr[1]/following-sibling::tr`, parsedDocument, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      
      let schedulesParsed = {};
      let indexParsed;
      const regexpTime = /([0-9]{2})([0-9]{2})to([0-9]{2})([0-9]{2})/;
      
      for(let i=0; i < scheduleNodesSnapshot.snapshotLength; i++) {
        const scheduleNode = scheduleNodesSnapshot.snapshotItem(i);
        if(!isNaN(parseInt(scheduleNode.children[0].innerText.trim()))) {
          indexParsed = scheduleNode.children[0].innerText.trim();
          schedulesParsed[parseInt(indexParsed)] = [];
        }

        const match = scheduleNode.children[4].innerText.trim().match(regexpTime);
        schedulesParsed[parseInt(indexParsed)].push({
          type: scheduleNode.children[1].innerText.trim(),
          group: scheduleNode.children[2].innerText.trim(),
          day: scheduleNode.children[3].innerText.trim(),
          time: `${match[1]}.${match[2]} - ${match[3]}.${match[4]}`,
          venue: scheduleNode.children[5].innerText.trim(),
          remark: scheduleNode.children[6].innerText.trim()
        });
      }

      let examScheduleParsedProcessed, examDurationProcessed;
      if(examScheduleParsed !== "Not Applicable") {
        examScheduleParsedProcessed = dayjs.tz(examScheduleParsed, "DD-MMM-YYYY HHmm", "Asia/Singapore").toDate();

        const examTime = examScheduleParsed.match(/([0-9]{4})to([0-9]{4})/);
        const startTime = dayjs(examTime[1], "HHmm");
        const endTime = dayjs(examTime[2], "HHmm");
        examDurationProcessed = endTime.diff(startTime, "h");
      }

      toggleHasFinals(examScheduleParsed !== "Not Applicable");
      setName(nameParsed);
      setCode(codeParsed);
      setAu(auParsed);
      setSchool(schoolParsed);
      setPrereqStr(prereqParsed);
      setExclusiveStr(excParsed);
      setProgExc(progExcParsed);
      setAyExc(ayExcParsed);
      toggleBde(!bdeRemarkParsed.includes("not available"));
      toggleGerpe(!gerpeRemarkParsed.includes("not available"));
      setGrading(gradingTypeParsed);
      setExamSchedule(examScheduleParsed !== "Not Applicable" ? examScheduleParsedProcessed : new Date());
      setDuration(examScheduleParsed !== "Not Applicable" ? examDurationProcessed : 0);
      setSchedules(schedulesParsed);
    }
  }

  return (
    <Container className="py-4">
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
              value={name} 
              onChange={(e) => setName(e.target.value)}
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
          <Col><Form.Group>
            <Form.Label>Course Prerequisites</Form.Label>
            <Form.Control 
              disabled={mode === "VIEW"}
              type="text" 
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
              type="text" 
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
              type="text" 
              placeholder="Enter Programme(s)" 
              value={progExc} 
              onChange={(e) => setProgExc(e.target.value)}
            />
          </Form.Group></Col>
          <Col><Form.Group>
            <Form.Label>Not Available to all programmes</Form.Label>
            <Form.Control 
              disabled={mode === "VIEW"}
              type="text" 
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
              {Object.keys(schedules).filter(scheduleIndex => scheduleIndex.toString().indexOf(indexFilter) !== -1).map(scheduleIndex => <Fragment key={scheduleIndex}>{
                schedules[scheduleIndex].map((_, i) => 
                  <tr key={i}>
                    {i === 0 && <>
                      <td rowSpan={schedules[scheduleIndex].length} className="align-middle">
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
                      <td rowSpan={schedules[scheduleIndex].length} className="align-middle position-relative">
                        <span className="me-4">{scheduleIndex}</span>
                        <Container className={`px-0 mt-2 ${schedules[scheduleIndex].length > 2 && "position-absolute bottom-0 start-0 pb-2 ms-2"}`}>
                          {mode !== "VIEW" && <Button 
                            size="sm" 
                            variant="outline-secondary" 
                            className="d-flex align-items-center p-2" 
                            onClick={() => {
                              let newSchedules = {...schedules};
                              newSchedules[scheduleIndex].push({
                                type: "",
                                group: "",
                                day: "",
                                time: "",
                                venue: "",
                                remark: ""
                              });
                              setSchedules(newSchedules);
                            }}
                          ><PlusLg /></Button>}
                        </Container>
                      </td>
                    </>}
                    <AddSchedule scheduleObj={schedules} index={scheduleIndex} subIndex={i} changeSchedules={changeSchedules} mode={mode} />
                    <td className="align-middle">
                      {i !== 0 && mode !== "VIEW" && <Button 
                        size="sm" 
                        variant="danger" 
                        className="d-flex align-items-center p-1" 
                        onClick={() => {
                          let updatedSchedules = {...schedules};
                          const filtered = updatedSchedules[scheduleIndex].filter((_, j) => j !== i);
                          updatedSchedules[scheduleIndex] = filtered;
                          setSchedules(updatedSchedules);
                        }}
                      ><DashLg /></Button>}
                    </td>
                  </tr>
                )
              }</Fragment>)}
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
                  let newSchedules = {...schedules};
                  newSchedules[parseInt(addIndex)] = [{
                    type: "",
                    group: "",
                    day: "",
                    time: "",
                    venue: "",
                    remark: ""
                  }];
                  setSchedules(newSchedules);
                  setAddIndex('');
                }
            }}><PlusLg /></Button></Col>
            <Col className="d-flex align-items-center justify-content-end"><Button 
              size="sm"
              variant="danger" 
              onClick={() => {
                let updatedSchedules = {...schedules};
                selectedIndex.forEach((index) => {
                  delete updatedSchedules[index];  // does not free memory
                });
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
        {mode === "ADD" && <Button variant="success" type="submit">Add Course</Button>}
        {mode === "EDIT" && <>
        <Button variant="success" type="submit">Edit Course</Button>
        <Button variant="outline-danger" className="float-end" onClick={() => navigate(-1)}>Cancel</Button></>}
        {mode === "VIEW" && <Button variant="primary" onClick={() => navigate(-1)}>Back</Button>}
      </Form>
    </Container>
  );
}

export default AddCourse;