import Button from "react-bootstrap/esm/Button";
import { List, XLg } from 'react-bootstrap-icons';
import { ON } from "../services/constants";

const Hamburger = ({ handleHamburger, sidebarState }) => {
  return (
    <Button onClick={handleHamburger} size="lg" variant="outline-secondary" className="d-flex align-items-center">
      {sidebarState === ON ? <XLg /> : <List />}
    </Button>
  );
}

export default Hamburger;