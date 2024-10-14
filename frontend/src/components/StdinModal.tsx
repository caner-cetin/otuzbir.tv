import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface StdinModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (stdin: string) => void;
}

const StdinModal: React.FC<StdinModalProps> = ({ show, onHide, onSubmit }) => {
  const [stdin, setStdin] = useState('');

  const handleSubmit = () => {
    onSubmit(stdin);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Stdin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          as="textarea"
          rows={3}
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          placeholder="can be submitted blank"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StdinModal;