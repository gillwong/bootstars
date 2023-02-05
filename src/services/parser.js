import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const evalXPath = (xpath, evalDoc, snapshot = false) => snapshot
  ? evalDoc
    .evaluate(xpath, evalDoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
  : evalDoc
    .evaluate(xpath, evalDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
    .singleNodeValue;

const row1XPath = "//td[.//*[contains(text(),\"[+]\")]]";
const timeFormatRegex = /([0-9]{2})([0-9]{2})to([0-9]{2})([0-9]{2})/;

const parseCourse = (htmlStr) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlStr, "text/html");

  let course = Object();

  course.code = evalXPath("//td[.//*[contains(text(),\"[+]\")]]", doc)
    .innerText
    .trim()
    .substring(4);

  course.title = evalXPath(`${row1XPath}/following-sibling::*[1]`, doc)
    .innerText
    .trim();

  course.au = parseInt(evalXPath(`${row1XPath}/following-sibling::*[2]`, doc)
    .innerText
    .trim()
    .split(" ")[0]);

  course.school = evalXPath(`${row1XPath}/following-sibling::*[3]`, doc)
    .innerText
    .trim();

  const prereqLabelNode = evalXPath("//td[.//*[contains(text(),\"Prerequisite:\")]]/following-sibling::*", doc);
  const prereqCoursesLabelNode = evalXPath("//td[.//*[contains(text(),\"Prerequisite Course(s):\")]]/following-sibling::*", doc);
  const prereqNoteLabelNode = evalXPath("//td[.//*[contains(text(),\"Prerequisite Note:\")]]/following-sibling::*", doc);

  if(prereqLabelNode) {
    course.prereq = prereqLabelNode.innerText.trim();  // id = 0

    const prereqParentSiblings = evalXPath("//td[.//*[contains(text(),\"Prerequisite:\")]]/parent::node()/following-sibling::*", doc, true);

    for(let id = 1; id < prereqParentSiblings.snapshotLength; id++) {
      if(prereqParentSiblings.snapshotItem(id).firstElementChild.innerText === "") {
        course.prereq += " " + prereqParentSiblings.snapshotItem(id).innerText.trim();
      } else {
        break;
      }
    }
  } else if(prereqCoursesLabelNode) {
    course.prereq = prereqCoursesLabelNode.innerText.trim();

    const prereqParentSiblings = evalXPath("//td[.//*[contains(text(),\"Prerequisite Course(s):\")]]/parent::node()/following-sibling::*", doc, true);

    for(let id = 1; id < prereqParentSiblings.snapshotLength; id++) {
      if(prereqParentSiblings.snapshotItem(id).firstElementChild.innerText === "") {
        course.prereq += " " + prereqParentSiblings.snapshotItem(id).innerText.trim();
      } else {
        break;
      }
    }
  } else {
    course.prereq = "";
  }

  course.prereqNote = prereqNoteLabelNode
    ? prereqNoteLabelNode.innerText.trim()
    : "";

  const exclusiveLabelNode = evalXPath("//td[.//*[contains(text(),\"Mutually exclusive with:\")]]/following-sibling::*", doc);
  course.exclusive = exclusiveLabelNode
    ? exclusiveLabelNode.innerText.trim()
    : "";

  const programmeExcludeLabelNode = evalXPath("//td[.//*[contains(text(),\"Not available to Programme:\")]]/following-sibling::*", doc);
  course.programmeExc = programmeExcludeLabelNode
    ? programmeExcludeLabelNode.innerText.trim()
    : "";

  // rename to allProgrammeExcludeLabelNode for clarity
  const ayExcludeLabelNode = evalXPath("//td[.//*[contains(text(),\"Not available to all Programme:\")]]/following-sibling::*", doc);
  // rename to course.allProgrammeExclude for clarity
  course.ayExclude = ayExcludeLabelNode
    ? ayExcludeLabelNode.innerText.trim()
    : "";

  const peExcludeLabelNode = evalXPath("//td[.//*[contains(text(),\"Not available as PE to Programme:\")]]/following-sibling::*", doc);
  course.peExclude = peExcludeLabelNode
    ? peExcludeLabelNode.innerText.trim()
    : "";

  const ueExcludeLabelNode = evalXPath("//td[.//*[contains(text(),\"Not available as UE to Programme:\")]]/following-sibling::*", doc);
  course.ueExclude = ueExcludeLabelNode
    ? ueExcludeLabelNode.innerText.trim()
    : "";

  course.grading = evalXPath("//td[.//*[contains(text(),\"Grading Type\")]]/following-sibling::*", doc)
    .innerText
    .trim();

  const examScheduleStr = evalXPath("//td[.//*[contains(text(),\"Exam Schedule\")]]/following-sibling::*", doc)
    .innerText
    .trim();

  if(examScheduleStr !== "Not Applicable") {
    course.examSchedule = dayjs.tz(
      examScheduleStr,
      "DD-MM-YYYY HHmm",
      "Asia/Singapore")
      .toDate();

    const examTime = examScheduleStr.match(/([0-9]{4})to([0-9]{4})/);
    const startTime = dayjs(examTime[1], "HHmm");
    const endTime = dayjs(examTime[2], "HHmm");
    course.examDuration = endTime.diff(startTime, "h", true);

    course.hasFinals = true;
  } else {
    course.examSchedule = new Date();
    course.examDuration = 0;
    course.hasFinals = false;
  }

  course.gerpe = Boolean(
    evalXPath("//td[.//*[contains(text(),\"Course is available as General Education Prescribed Elective\")]]/following-sibling::*", doc)
  );

  course.bde = Boolean(
    evalXPath("//td[.//*[contains(text(),\"Course is available as Broadening and Deepening Elective\")]]/following-sibling::*", doc)
  );

  course.ue = Boolean(
    evalXPath("//td[.//*[contains(text(),\"Course is available as Unrestricted Elective\")]]/following-sibling::*", doc)
  ) || Boolean(
    evalXPath("//td[.//*[contains(text(),\"Course is available as Broadening and Deepening/Unrestricted Elective\")]]/following-sibling::*", doc)
  );

  const scheduleNodesSnapshot = evalXPath("//table[@border=\"1\"]/tbody/tr[1]/following-sibling::tr", doc, true);

  let schedulesMap = new Map();
  let courseIndex = undefined;

  for(let id = 0; id < scheduleNodesSnapshot.snapshotLength; id++) {
    const scheduleNode = scheduleNodesSnapshot.snapshotItem(id);
    if(!isNaN(parseInt(scheduleNode.children[0].innerText.trim()))) {
      courseIndex = scheduleNode.children[0].innerText.trim();
      schedulesMap.set(courseIndex, []);
    }

    const match = scheduleNode.children[4].innerText.trim().match(timeFormatRegex);

    schedulesMap.set(courseIndex,
      [...schedulesMap.get(courseIndex), {
        type: scheduleNode.children[1].innerText.trim(),
        group: scheduleNode.children[2].innerText.trim(),
        day: scheduleNode.children[3].innerText.trim(),
        time: `${match[1]}.${match[2]} - ${match[3]}.${match[4]}`,
        venue: scheduleNode.children[5].innerText.trim(),
        remark: scheduleNode.children[6].innerText.trim()
      }]);
  }

  course.schedules = schedulesMap;

  return course;
};

export default parseCourse;