import { Pose as PoseType } from '@tensorflow-models/pose-detection';
import { useEffect, useState } from 'react';
import * as poses from '~/constants/poses';
import { KeyPointName } from '~/types';
import {
  adjustPose_VERY_CRAZY_,
  getPosesWithSameHeight,
} from '~/utils/keypoints.handler';

type PoseName = keyof typeof poses;

const KEYPOINT_RADIUS: {
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

export const usePoseCounter = (pose: PoseType[], enabled: boolean) => {
  const [status, setStatus] = useState<PoseName>('base');
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (pose.length && enabled) {
      const { poseA, poseB } = getPosesWithSameHeight(
        adjustPose_VERY_CRAZY_(poses[status], pose[0]),
        pose[0]
      );

      let score = 0;
      let total = 0;

      for (const kA of poseA.keypoints) {
        if (kA.name?.endsWith('_ear') || kA.name?.endsWith('_eye')) {
          continue;
        }

        const kb = poseB.keypoints.find((kb) => kb.name === kA.name);
        total++;

        if (!kb) {
          continue;
        }

        const radius = KEYPOINT_RADIUS[kA.name as KeyPointName];
        const distance = Math.sqrt(
          Math.pow(kA.x - kb.x, 2) + Math.pow(kA.y - kb.y, 2)
        );

        const percentage = Math.max(0, 1 - distance / radius);
        // console.log(
        //   `[${new Date().toISOString()}]]`,
        //   kA.name,
        //   percentage.toFixed(2),
        //   distance.toFixed(2),
        //   radius
        // );

        score += percentage;
      }

      score /= total;

      const isValid = score > 0.7;
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
