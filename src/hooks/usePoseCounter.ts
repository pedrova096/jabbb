import { Pose as PoseType } from '@tensorflow-models/pose-detection';
import { useEffect, useState } from 'react';
import * as poses from '~/constants/poses';
import { KeyPointName } from '~/types';

type PoseName = keyof typeof poses;

type BoundingBox = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  width: number;
  height: number;
};

export const usePoseCounter = (pose: PoseType[], enabled: boolean) => {
  const [status, setStatus] = useState<PoseName>('base');
  const [count, setCount] = useState(0);

  const boundingBoxFromPose = (pose: PoseType): BoundingBox => {
    const xs = pose.keypoints.map((k) => k.x);
    const ys = pose.keypoints.map((k) => k.y);
    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);
    const yMin = Math.min(...ys);
    const yMax = Math.max(...ys);
    return {
      xMin,
      xMax,
      yMin,
      yMax,
      width: xMax - xMin,
      height: yMax - yMin,
    };
  };

  const changeHeightScale = (pose: PoseType, height: number) => {
    const box = boundingBoxFromPose(pose);
    if (box.height === height) {
      return pose;
    }
    const ratio = height / box.height;
    const newPose: PoseType = {
      score: pose.score,
      keypoints: pose.keypoints.map((k) => ({
        ...k,
        // x: (k.x - box.xMin) * ratio,
        y: (k.y - box.yMin) * ratio,
      })),
    };
    return newPose;
  };

  const getPosesWithSameHeight = (poseA: PoseType, poseB: PoseType) => {
    let boxA = boundingBoxFromPose(poseA);
    let boxB = boundingBoxFromPose(poseB);
    const height = Math.min(boxA.height, boxB.height);

    const $poseA = changeHeightScale(removeOffset(poseA, boxA), height);
    const $poseB = changeHeightScale(removeOffset(poseB, boxB), height);
    boxA = boxA.height === height ? boxA : boundingBoxFromPose($poseA); // if already same height, use the original box
    boxB = boxB.height === height ? boxB : boundingBoxFromPose($poseB); // if already same height, use the original box

    return {
      poseA: $poseA,
      poseB: $poseB,
      boxA,
      boxB,
    };
  };

  const removeOffset = (pose: PoseType, box: BoundingBox): PoseType => {
    return {
      ...pose,
      keypoints: pose.keypoints.map((k) => ({
        ...k,
        x: k.x - box.xMin,
        y: k.y - box.yMin,
      })),
    };
  };

  useEffect(() => {
    if (pose.length && enabled) {
      let currentPose = poses[status];
      const errorRadius = 20;

      const isValid = pose.some((p, i) => {
        const { poseA, poseB } = getPosesWithSameHeight(p, currentPose);

        const aaa: {
          [key in KeyPointName]: number;
        } = {
          [KeyPointName.nose]: 80,
          [KeyPointName.left_eye]: 80,
          [KeyPointName.right_eye]: 80,
          [KeyPointName.left_ear]: 80,
          [KeyPointName.right_ear]: 80,

          [KeyPointName.left_shoulder]: 50,
          [KeyPointName.right_shoulder]: 50,
          [KeyPointName.left_elbow]: 50,
          [KeyPointName.right_elbow]: 50,
          [KeyPointName.left_wrist]: 50,
          [KeyPointName.right_wrist]: 50,

          [KeyPointName.left_hip]: 80,
          [KeyPointName.right_hip]: 80,

          [KeyPointName.left_knee]: 140,
          [KeyPointName.right_knee]: 140,
          [KeyPointName.left_ankle]: 140,
          [KeyPointName.right_ankle]: 140,
        };

        const result = poseA.keypoints.map((k, i) => {
          const keypointsB = poseB.keypoints.find((k) => k.name === k.name)!;
          const xError = Math.abs(k.x - keypointsB.x);
          const yError = Math.abs(k.y - keypointsB.y);

          const score = Math.sqrt(xError ** 2 + yError ** 2);
          //console.log('error', k.name, xError, yError);
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
