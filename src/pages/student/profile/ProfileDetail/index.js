import React, { useEffect, useState, props } from 'react';
import style from './index.module.css';
import { FaUserEdit } from 'react-icons/fa';
import { BsPencilSquare } from 'react-icons/bs';
import { BsCardChecklist } from 'react-icons/bs';
import { RiUserAddLine } from 'react-icons/ri';
import Moment from 'react-moment';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import { useToast } from '../../../../hooks/useToast';

import MyVerticallyCenteredModal from 'react-bootstrap/Modal';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import StudentApi from '../../../../api/Student';
import DashboardApi from '../../../../api/Dashboard';
import ProfileEditApi from '../../../../api/ProfileEdit';

const ProfileDetail = () => {
  const loggedInUserId = Cookies.get('user_id');

  const ACTIVITY_TYPE = 'App\\Models\\Quiz';

  const [studentDetails, setStudentDetails] = useState(null);
  const [overallQuizTaken, setOverallQuizTaken] = useState(0);
  const [friendsActivities, setFriendsActivities] = useState(null);
  const [recentActivities, setRecentActivities] = useState(null);
  const [modalShow, setModalShow] = useState(null);
  const { control, handleSubmit } = useForm();
  const [successMessage, setSuccessMessage] = useState('');
  const [status, setStatus] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(false);
  const [error, setError] = useState('');
  const [avatar, setAvatar] = useState([]);
  const toast = useToast();

  const handleOnSubmit = async (image) => {
    let data = new FormData();
    data.append('image', image.image);
    toast('Processing', 'Uploading image...');
    try {
      await ProfileEditApi.uploadImage(data);
      toast('Success', 'Successfully Upload.');
      setSuccessMessage('Upload Successful');
      setStatus(true);
      StudentApi.getDetails(loggedInUserId).then(({ data }) => {
        setAvatar(data.avatar);
      });
    } catch (error) {
      if (error?.response?.data?.errors) {
        toast('Error', 'Please enter a valid input to successfully upload.');
        setError(error?.response?.data?.errors);}
      setSubmitStatus(false);
    }
  };

  useEffect(() => {
    StudentApi.getDetails(loggedInUserId).then(({ data }) => {
      setAvatar(data.avatar);
    });

    StudentApi.getDetails(loggedInUserId).then(({ data }) => {
      setStudentDetails(data.details);
      setOverallQuizTaken(data.quizzesTaken);
    });

    StudentApi.getRecentActivities(loggedInUserId).then(({ data }) => {
      setRecentActivities(data.data);
    });

    DashboardApi.getFriendsActivities().then(({ data }) => {
      setFriendsActivities(data.data);
    });
  }, []);

  const activitiesIconDisplay = (activityDetail) => {
    return activityDetail === ACTIVITY_TYPE ? (
      <BsCardChecklist size="20px"/>
    ) : (
      <RiUserAddLine size="20px" />
    );
  };

  return (
    <center className={style.userProfileContainer}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: '50px',
          paddingLeft: '10%',
          marginBottom: '100px',
        }}
      >
        <div style={{ display: 'flex' }}>
          <div>
            <div>
              <div>
                {studentDetails?.avatar ? (
                  <div>
                    <img src={avatar} className={style.biUserPosition} />
                  </div>
                ) : (
                  <div>
                    <img className={style.biUserPosition1} src="https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png"/>
                  </div>
                )} 
              </div>
              <a onClick={() => setModalShow(true)}>
                <BsPencilSquare
                  size="20px"
                  style={{
                    marginLeft: '170px',
                    strokeWidth: '0px',
                    marginTop: '0px',
                  }}
                  className={style.iconcursor}
                />
              </a>
              <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </div>
          </div>
          <div style={{ marginLeft: '40px' }}>
            <div style={{ marginTop: '33px' }} className={style.userInfo}>
              <div className={style.userEditText}>
                <h2 style={{ fontSize: '32px', fontWeight: 'Bold' }}>
                  {studentDetails?.name}
                </h2>
                <a href="/profile/view">
                  <FaUserEdit size="40px" className={style.userEdit} />
                </a>
              </div>
              <h4
                style={{
                  fontSize: '24px',
                  marginBottom: '20px',
                  color: '#48535B',
                }}
              >
                {overallQuizTaken} Total Quizzes Taken
              </h4>
              <div>
                <p className={style.followersText}>
                  {studentDetails?.followers_count} Followers
                </p>
                <p className={style.followingText}>
                  {studentDetails?.followings_count} Following
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={style.activitiesTableContainer}
        style={{ marginTop: '40px' }}
      >
        <div>
          <div className={style.cardHeader}>
            <p style={{ float: 'left', marginLeft: '12px', marginTop: '10px' }}>
              Recent Activities
            </p>
          </div>
          <div className={style.cardBody}>
            {recentActivities?.length > 0 ? (
              recentActivities?.map((recentActivity, idx) => {
                return (
                  <div className={style.tableContainer} key={idx}>
                    <h6 className={style.activityInfo}>
                      {activitiesIconDisplay(recentActivity.subject_type)}
                      <span className={style.activityDescription}>
                        {' '}
                        {recentActivity.description.replace(
                          studentDetails?.name,
                          'You'
                        )}{' '}
                      </span>{' '}
                    </h6>
                    <div id={style.timestamp}>
                      <Moment fromNow>{recentActivity.created_at}</Moment>{' '}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={style.noQuizzesTakenMessage}>
                <span>No Recent Activities</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className={style.cardHeader}>
            <p style={{ float: 'left', marginLeft: '12px', marginTop: '10px' }}>
              Friend’s Activities
            </p>
          </div>
          <div className={style.cardBody}>
            {friendsActivities?.length > 0 ? (
              friendsActivities?.map((friendActivity, idx) => {
                return (
                  <div className={style.tableContainer} key={idx}>
                    <h6 className={style.activityInfo}>
                      {activitiesIconDisplay(friendActivity.subject_type)}
                      <span className={style.activityDescription}>
                        {' '}
                        {friendActivity.description}{' '}
                      </span>{' '}
                    </h6>
                    <div id={style.timestamp}>
                      <Moment fromNow>{friendActivity.created_at}</Moment>{' '}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={style.noQuizzesTakenMessage}>
                <span>No Recent Activities</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        {...props}
        size="50"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
      >
        <Modal.Header closeButton className={style.header}>
          <Modal.Title id="contained-modal-title-vcenter">
            Upload Your Profile
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(handleOnSubmit)}>
          {status === false ? (
            <Form.Group controlId="formBasicEmail">
              <Controller
                control={control}
                name="image"
                defaultValue=""
                render={({ field }) => (
                  <Form.Control
                    onChange={(e) => {
                      field.onChange(e.target.files[0]);
                    }}
                    className={style.controllerstyle}
                    type="file"
                    isInvalid={!!error?.image}
                    required
                    maxLength={1024}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {error?.image}
              </Form.Control.Feedback>
              <Modal.Footer>
                <Button id={style.Btncolor} type="submit" disabled={submitStatus}>
                  <p style={{ fontSize: '14px' }}>Upload</p>
                </Button>
              </Modal.Footer>
            </Form.Group>
          ) : (
            <center>
              <div className={style.successMessageContainer}>
                <span>{successMessage}</span>
              </div>
            </center>
          )}
        </Form>
      </Modal>
    </center>
  );
};

export default ProfileDetail;
