import Button from "react-bootstrap/esm/Button";
import { List, XLg } from 'react-bootstrap-icons';

const Hamburger = ({ handleClick, sideBarState }) => {
  return (
    <Button onClick={handleClick} size="lg" variant="outline-secondary" className="d-flex align-items-center">
      {!sideBarState && <List />}
      {sideBarState && <XLg />}
    </Button>
  );
}

export default Hamburger;