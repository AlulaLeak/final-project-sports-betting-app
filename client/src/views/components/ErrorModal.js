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
        <p className='error-message'>You cannot place bets on the same team, in a single parlay.</p>
        <p className='error-message'>Finish placing your bet above or add bets from other games before adding another to your bet slip.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button className="error-header" onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ErrorModal;