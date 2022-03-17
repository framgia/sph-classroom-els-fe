import React, { useEffect, useState } from 'react';
import style from './index.module.css';
import { FaUserEdit } from 'react-icons/fa';
import { BsCardChecklist } from 'react-icons/bs';
import { RiUserAddLine } from 'react-icons/ri';
import Moment from 'react-moment';
import Cookies from 'js-cookie';

import StudentApi from '../../../../api/Student';
import DashboardApi from '../../../../api/Dashboard';

const ProfileDetail = () => {
  const loggedInUserId = Cookies.get('user_id');

  const ACTIVITY_TYPE = 'App\\Models\\Quiz';

  const [studentDetails, setStudentDetails] = useState(null);
  const [overallQuizTaken, setOverallQuizTaken] = useState(0);
  const [friendsActivities, setFriendsActivities] = useState(null);
  const [recentActivities, setRecentActivities] = useState(null);

  useEffect(() => {
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
    </center>
  );
};

export default ProfileDetail;
