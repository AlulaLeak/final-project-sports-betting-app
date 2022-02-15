import Modal from 'react-bootstrap/Modal';
import { Button } from '@material-ui/core';
import '../../styles/ModalMessage.css';

function ModalMessage(props) {
  const { type, header, message1, message2, } = props;
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="error-header">
        <Modal.Title id="contained-modal-title-vcenter" className="error-header">
          {header}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className={`${type}-message`}>{message1}</p>
        <p className={`${type}-message`}>{message2}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button className="error-header" onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalMessage;