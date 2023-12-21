import { Pose as PoseType } from '@tensorflow-models/pose-detection';
import { useEffect, useState } from 'react';
import * as poses from '~/constants/poses';
import { KeyPointName } from '~/types';
import { getPosesWithSameHeight } from '~/utils/keypoints.handler';

type PoseName = keyof typeof poses;

export const usePoseCounter = (pose: PoseType[], enabled: boolean) => {
  const [status, setStatus] = useState<PoseName>('base');
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (pose.length && enabled) {
      let currentPose = poses[status];
      const errorRadius = 20;

      const isValid = pose.some((p, i) => {
        const { poseA, poseB } = getPosesWithSameHeight(p, currentPose);

        const aaa: {
          [key in KeyPointName]: number;
        } = {
          [KeyPointName.nose]: 15,
          [KeyPointName.left_eye]: 15,
          [KeyPointName.right_eye]: 15,
          [KeyPointName.left_ear]: 15,
          [KeyPointName.right_ear]: 15,

          [KeyPointName.left_shoulder]: 20,
          [KeyPointName.right_shoulder]: 20,
          [KeyPointName.left_elbow]: 25,
          [KeyPointName.right_elbow]: 25,
          [KeyPointName.left_wrist]: 15,
          [KeyPointName.right_wrist]: 15,

          [KeyPointName.left_hip]: 30,
          [KeyPointName.right_hip]: 30,

          [KeyPointName.left_knee]: 30,
          [KeyPointName.right_knee]: 30,
          [KeyPointName.left_ankle]: 30,
          [KeyPointName.right_ankle]: 30,
        };

        const result = poseA.keypoints.map((k, i) => {
          const keypointsB = poseB.keypoints.find((k) => k.name === k.name)!;
          const xError = Math.abs(k.x - keypointsB.x);
          const yError = Math.abs(k.y - keypointsB.y);

          const score = Math.sqrt(xError ** 2 + yError ** 2);
          console.log('error', k.name, xError, yError);
          return {
            name: k.name,
            score,
            isValid: score < aaa[k.name as KeyPointName],
          };
        });

        console.log('result', result);
        return result.every((r) => r.isValid);
      });

      console.log('isValid', isValid);

      if (isValid) {
        if (status === 'base') {
          setCount((c) => c + 1);
        }

        setStatus((s) => (s === 'base' ? 'punch' : 'base'));
      }
    }
  }, [pose, enabled]);

  return { count, status };
};
