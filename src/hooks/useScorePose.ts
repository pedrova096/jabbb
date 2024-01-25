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

export const useScorePose = (poseName: PoseName, pose: PoseType): number => {
  // score 0 to 1, trimmed to 2 decimal places
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!pose) {
      return;
    }
    const { poseA, poseB } = getPosesWithSameHeight(
      adjustPose_VERY_CRAZY_(poses[poseName], pose),
      pose
    );

    let score = 0;
    let total = 0;

    for (const kA of poseA.keypoints) {
      if (kA.name?.endsWith('_ear') || kA.name?.endsWith('_eye')) {
        continue;
      }

      const kb = poseB.keypoints.find((kb) => kb.name === kA.name);

      if (!kb) {
        continue;
      }

      const radius = KEYPOINT_RADIUS[kA.name as KeyPointName];
      const distance = Math.sqrt(
        Math.pow(kA.x - kb.x, 2) + Math.pow(kA.y - kb.y, 2)
      );

      const percentage = Math.max(0, 1 - distance / radius);
      console.log(kA.name, percentage.toFixed(2), distance.toFixed(2), radius);

      score += percentage;
      total++;
    }

    score /= total;

    setScore(Math.round(score * 100) / 100);
  }, [poseName, pose]);

  return score;
};
