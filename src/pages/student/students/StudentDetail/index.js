import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../../../../hooks/useToast';
import style from './index.module.scss';
import Button from '@restart/ui/esm/Button';
import Moment from 'react-moment';

import StudentApi from '../../../../api/Student';
import QuizTaken from '../../../../api/QuizTaken';

const StudentDetail = () => {
  const ACTIVITY_TYPE = 'App\\Models\\Quiz';

  const { id } = useParams('id');
  const [studentDetails, setStudentDetails] = useState(null);
  const [overallQuizTaken, setOverallQuizTaken] = useState(0);
  const [quizzesTaken, setQuizzesTaken] = useState(null);
  const [recentActivities, setRecentActivities] = useState(null);
  const [status, setStatus] = useState(false);

  const toast = useToast();

  useEffect(() => {
    StudentApi.getDetails(id).then(({ data }) => {
      setStudentDetails(data.details);
      setOverallQuizTaken(data.quizzesTaken);
    });

    StudentApi.getRecentActivities(id).then(({ data }) => {
      setRecentActivities(data.data);
    });

    QuizTaken.getRecent(id).then(({ data }) => {
      setQuizzesTaken(data.data);
    });
  }, [status]);

  const onFollowClick = (userid, name) => {
    toast('Processing', `Following ${name}...`);

    StudentApi.follow(userid).then(() => {
      toast('Success', `Successfully Followed ${name}.`);
      setStatus(!status);
    });
  };

  const onUnfollowClick = (userid, name) => {
    toast('Processing', `Unfollowing ${name}...`);

    StudentApi.unfollow(userid).then(() => {
      toast('Success', `Successfully Unfollowed ${name}.`);
      setStatus(!status);
    });
  };

  const displayFollowUnfollowButton = (status, userid, name) => {
    if (status) {
      return (
        <Button
          className={style.followUnfollowButton}
          variant="success"
          onClick={() => {
            onUnfollowClick(userid, name);
          }}
        >
          Unfollow
        </Button>
      );
    } else {
      return (
        <Button
          className={style.followUnfollowButton}
          variant="success"
          onClick={() => {
            onFollowClick(userid, name);
          }}
        >
          Follow
        </Button>
      );
    }
  };

  const iconDisplay = (activityDetail) => {
    return (
      <img
        className={style.tableIcon}
        src={
          activityDetail === ACTIVITY_TYPE
            ? 'https://pxl02-scueduau.terminalfour.net/fit-in/800x10000/filters:quality(95)/prod01/channel_1/media/campaigns/evaluation2x.png'
            : 'https://www.toprecursoshumanos.com.br/images/svg-colado-124643x123.svg?crc=3915734253'
        }
        alt="add"
        height="20px"
        width="20px"
      />
    );
  };

  return (
    <div className="container">
      <div className={style.student}>
        <div className={style.headerStyle}>
          <div>
            <div className={style.studentDetailsPosition}>
              <p className="mb-0">{studentDetails?.name}</p>
              <p className={style.studentDetailsPosition}>
                {overallQuizTaken} Total Quizzes Taken
              </p>
              <div className="d-flex gap-5 mt-2">
                <p className={style.studentDetailsPositionFollowers}>
                  {studentDetails?.followers_count} Followers
                </p>
                <p className={style.studentDetailsPositionFollowers}>
                  {studentDetails?.followings_count} Following
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          {displayFollowUnfollowButton(
            studentDetails?.has_followed,
            studentDetails?.id,
            studentDetails?.name
          )}
        </div>
      </div>
      <div className={style.activityTables}>
        <div>
          <div className={style.tableHeader}>
            <p className={style.tableTitle}>Quizzes</p>
          </div>
          <div className={style.tableBody}>
            {quizzesTaken?.length > 0 ? (
              quizzesTaken?.map((quizTaken, idx) => {
                return (
                  <div key={idx} className={style.activityInfoAlignment}>
                    <h6 className={style.activityInfo}>
                      <img
                        src="https://pxl02-scueduau.terminalfour.net/fit-in/800x10000/filters:quality(95)/prod01/channel_1/media/campaigns/evaluation2x.png"
                        alt="add user"
                        width="20px"
                        height="20px"
                      />
                      <span
                        title={quizTaken.title}
                        className={style.activityDescription}
                      >
                        Answered {quizTaken.title}
                      </span>
                    </h6>
                    <div id={style.timestamp}>
                      <Moment fromNow>{quizTaken.created_at}</Moment>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={style.noActivityMessage}>
                <span>No Quizzes Taken</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className={style.tableHeader}>
            <p className={style.tableTitle}>Activities</p>
          </div>
          <div className={style.tableBody}>
            {recentActivities?.length > 0 ? (
              recentActivities?.map((recentActivity, idx) => {
                return (
                  <div className={style.activityInfoAlignment} key={idx}>
                    <h6 className={style.activityInfo}>
                      {iconDisplay(recentActivity.subject_type)}
                      <span
                        title={recentActivity.properties.quiz?.title}
                        className={style.activityDescription}
                      >
                        {recentActivity.description}
                      </span>
                    </h6>
                    <div id={style.timestamp}>
                      <Moment fromNow>{recentActivity.created_at}</Moment>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={style.noActivityMessage}>
                <span>No Recent Activities</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
