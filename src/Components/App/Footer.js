import { VscGithub } from "react-icons/vsc"
import { GrLinkedin, GrMail } from "react-icons/gr"
import pursuit from "../../Assets/pursuit-logo.png"
import "./Footer.css";

export default function Footer() {

  return (
    <footer className="nav-footer">
    <span className="nav-dev">destinyjoyner@pursuit.org</span>
    <span className="pursuit-nav">
    <a 
    href="https://www.pursuit.org/mission-vision" target="_blank"> <img src={pursuit} alt="pursuit-logo" /></a>
    </span>
    
    <div>
    <span>
          <a href= "https://github.com/DestinyJoyner" target="blank">
              <VscGithub/>
          </a>
      </span>
      <span>
          <a href= "https://www.linkedin.com/in/destiny-joyner-934846243/" target="blank">
              <GrLinkedin  />
          </a>
          </span>
      <span>
          <a href= "mailto:destinyjoyner@pursuit.org" target="blank">
              <GrMail  />
          </a>
      </span>
    </div>
  </footer>
  );
}
