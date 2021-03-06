import React, { Fragment, useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from '../Button';

import style from './index.module.scss';

import Location from './component/Location';

const ChangeLocation = ({
  show,
  handleClose,
  location,
  setLocation,
  setLocationPathDisplay,
  modalHeaderTitle='Choose Location',
  type,
  isSaved,
  setIsSaved,
  buttonLabel,
}) => {
  const [isRootCategory, setIsRootCategory] = useState(true);
  const [backButtonClicked, setBackButtonClicked] = useState(false);

  useEffect(() => {
    if (!show) {
      setIsRootCategory(true);
      setIsSaved(false);
    }
  }, [show]);

  return (
    <Fragment>
      <Modal
        className={style.modalContainer}
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className={style.modalHeader}>
          <Modal.Title className={style.modalTitle}>
            {modalHeaderTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={style.modalBody}>
          <Location
            isRootCategory={setIsRootCategory}
            backToParentCategory={backButtonClicked}
            setBackButtonStatus={setBackButtonClicked}
            location={location}
            setLocation={setLocation}
            setLocationPathDisplay={setLocationPathDisplay}
            isSaved={isSaved}
            type={type}
          />
        </Modal.Body>
        <Modal.Footer className="d-flex gap-3">
          {isRootCategory ? (
            ''
          ) : (
            <Button
              onClick={() => setBackButtonClicked(true)}
              className={style.backButton}
              buttonLabel="Go Back"
              buttonSize="sm"
            />
          )}
          <div className={style.ButtonStyle}>
            <Button
              onClick={() => {
                setLocation(null);
                handleClose();
              }}
              buttonLabel="Cancel"
              buttonSize="sm"
              outline={true}
            />
            <Button
              onClick={() => {
                setIsSaved(true);
                handleClose();
              }}
              buttonLabel={buttonLabel}
              buttonSize="sm"
            />
          </div>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

ChangeLocation.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  location: PropTypes.object,
  setLocation: PropTypes.func,
  setLocationPathDisplay: PropTypes.func,
  type: PropTypes.string,
  isSaved: PropTypes.bool,
  setIsSaved: PropTypes.func,
  modalHeaderTitle: PropTypes.string,
  buttonLabel: PropTypes.string,
};

export default ChangeLocation;
