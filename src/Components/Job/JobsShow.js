import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useJobProvider } from "../../Providers/JobProvider";
import { v4 as uuidv4 } from "uuid";
import SkillsComponent from "./SkillsComponent";
import Header from "./Header";
import { convertDate, convertCities } from "./Functions/JobFunctions";
import { convertSkills } from "./Functions/SkillsFunctions";
import { jobCompany, jobLocation, jobApplied } from "./Data/Icons";
import { GrEdit } from "react-icons/gr";
import "./JobsShow.css";

function JobsShow() {
  const {
    API,
    axios,
    jobID,
    userID,
    recruiterID,
    TASK,
    access,
    setAccess,
    isRecruiterAcc,
    setIsRecruiterAcc,
    isSignedIn,
  } = useJobProvider();
  const navigate = useNavigate();
  const [jobDetails, setJobDetails] = useState({});
  const [skillIdArr, setSkillIdArr] = useState([]);
  const [reload, setReload] = useState(false);
  const [applied, setApplied] = useState(false);

  const applyButtonClick =
    !isSignedIn && !isRecruiterAcc
      ? null
      : isRecruiterAcc
      ? () => navigate(`/jobs/${jobID}/edit`)
      : applied 
      ? () =>  navigate("/user")
      : () =>  applyToJob();

  const appliedButtonView =
    !isSignedIn && !isRecruiterAcc
      ? null
      : isRecruiterAcc && !isSignedIn
      ? "EDIT"
      : !applied && isSignedIn
      ? "APPLY"
      : "APPLIED";

  const appliedButtonClass = isRecruiterAcc && !isSignedIn
    ? "job-show-header-apply job-show-edit"
    : !applied && isSignedIn
    ? "job-show-header-apply"
    : "job-show-header-applied";

  function applyToJob() {
    const obj = {
      user_id: userID,
      job_id: jobID,
    };
    axios
      .post(`${API}/user-jobs`, obj)
      .then(() => setReload(!reload))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    setIsRecruiterAcc(false)
    axios
      .get(`${API}/user-jobs/${userID}`)
      .then(({ data }) => {
        const match = data.find(({ id }) => id === +jobID);
        setApplied(match);
      })
      .catch((err) => console.log(data));

    axios
      .get(`${API}/jobs/${jobID}`)
      .then(({ data }) => {
        data["recruiter_id"] === recruiterID
          ? setAccess(true)
          : setAccess(false);

        setJobDetails(data);
        setSkillIdArr(convertSkills(data.skills));
      })
      .catch((err) => console.log(err));
  }, [reload, jobID, applied]);

  return (
    <div className="job-show">
      <section className="job-show-header">
        <Header header={jobDetails.title} />
        <div className="job-show-header-details">
          <span className="job-show-company">
            {jobCompany}
            <span>{jobDetails.company}</span>
          </span>
          <span className="job-show-location">
            {jobLocation}
            <span>{jobDetails.city && convertCities(jobDetails.city)}</span>
          </span>
        </div>
        <hr />
        {jobDetails.full_remote && (
          <span className="job-show-remote">
            <span>REMOTE</span>
          </span>
        )}
        {
          isSignedIn  || (isRecruiterAcc && access) ?
          <button onClick={applyButtonClick} className={appliedButtonClass}>
          <span>
            {appliedButtonView}
            {!isSignedIn && isRecruiterAcc && access && (
              <GrEdit size={"25px"} color={"#ffde59"} />
            )}
          </span>
        </button>
        :
        null
        }
      </section>

      <SkillsComponent skillsArr={skillIdArr} justList={true} />

      <section className="job-show-details">
        <div className="job-show-description">
          <span className="job-show-label">Description:</span>
          <span>{jobDetails.details}</span>
        </div>

        <div className="job-show-description">
          <span className="job-show-label">Tasks:</span>
          <span className="job-show-role-list">
            {jobDetails.tasks &&
              jobDetails.tasks.split(`${TASK}`).map((el) => {
                if (el) {
                  return (
                    <li key={uuidv4()}>
                      <span>{el}</span>
                    </li>
                  );
                }
              })}
          </span>
        </div>
      </section>

      {
       isRecruiterAcc || (isSignedIn && !applied ) ? (
        <button
          onClick={applyButtonClick}
          className={(isRecruiterAcc && !access) || !isSignedIn && !isRecruiterAcc  ? "hide" : "job-show-apply"}
        >
          {appliedButtonView}
        </button>
      ) : 
        isSignedIn && applied ?
        (
          <div className="job-show-applied">
            {jobApplied}
            <span onClick={applyButtonClick}>
              APPLIED ON {convertDate(applied["date_applied"])}
            </span>
          </div>
        ) :
          null
      }
    </div>
  );
}

export default JobsShow;
