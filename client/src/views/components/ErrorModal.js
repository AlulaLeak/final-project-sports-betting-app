import Modal from 'react-bootstrap/Modal';
import { Button } from '@material-ui/core';
import '../../styles/ErrorModal.css';

function ErrorModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="error-header">
        <Modal.Title id="contained-modal-title-vcenter" className="error-header">
          Error message
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <h4>Centered Modal</h4> */}
        <h4>
          You have already added this bet to your slip.
        </h4>
      </Modal.Body>
      <Modal.Footer>
        <Button className="error-header" onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ErrorModal;