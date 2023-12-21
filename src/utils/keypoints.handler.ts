import { Pose as PoseType } from '@tensorflow-models/pose-detection';
import {
  CAM_PREVIEW_HEIGHT,
  CAM_PREVIEW_WIDTH,
} from '~/components/TensorCamera';
import { KeyPointName } from '~/types';

export type BoundingBox = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  width: number;
  height: number;
};

export type PoseObject = {
  [key in KeyPointName]?: {
    cx: number;
    cy: number;
    score: number;
    type?: 'head' | 'arm' | 'leg';
  };
};

export const boundingBoxFromPose = (pose: PoseType): BoundingBox => {
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

export const removePoseOffset = (
  pose: PoseType,
  box: BoundingBox
): PoseType => {
  return {
    ...pose,
    keypoints: pose.keypoints.map((k) => ({
      ...k,
      x: k.x - box.xMin,
      y: k.y - box.yMin,
    })),
  };
};

export const applyNoseOffset = (
  pose: PoseType,
  noseX: number,
  noseY: number
): PoseType => {
  const nose = findKeypointByName(pose, KeyPointName.nose);
  const dx = noseX - nose.x;
  const dy = noseY - nose.y;
  return {
    ...pose,
    keypoints: pose.keypoints.map((k) => ({
      ...k,
      x: k.x + dx,
      y: k.y + dy,
    })),
  };
};

export const changeHeightScale = (pose: PoseType, height: number): PoseType => {
  const box = boundingBoxFromPose(pose);
  if (box.height === height) {
    return pose;
  }
  const ratio = height / box.height;
  console.log({ ratio });
  const newPose: PoseType = {
    score: pose.score,
    keypoints: pose.keypoints.map((k) => ({
      ...k,
      // x: (k.x - box.xMin) * ratio,
      y: k.y * ratio,
    })),
  };
  return newPose;
};

export const getPosesWithSameHeight = (poseA: PoseType, poseB: PoseType) => {
  let boxA = boundingBoxFromPose(poseA);
  let boxB = boundingBoxFromPose(poseB);
  const height = Math.min(boxA.height, boxB.height);

  const $poseA = changeHeightScale(removePoseOffset(poseA, boxA), height);
  const $poseB = changeHeightScale(removePoseOffset(poseB, boxB), height);
  boxA = boxA.height === height ? boxA : boundingBoxFromPose($poseA); // if already same height, use the original box
  boxB = boxB.height === height ? boxB : boundingBoxFromPose($poseB); // if already same height, use the original box

  return {
    poseA: $poseA,
    poseB: $poseB,
    boxA,
    boxB,
  };
};

export const findKeypointByName = (pose: PoseType, name: string) => {
  return pose.keypoints.find((k) => k.name === name)!;
};

export const convertPoseToPoseObject = ({
  pose,
  flipX,
  isPortrait,
  tensorWidth,
  tensorHeight,
}: {
  pose: PoseType;
  flipX: boolean;
  isPortrait: boolean;
  tensorWidth: number;
  tensorHeight: number;
}) => {
  // The score threshold for pose detection results.
  const MIN_KEYPOINT_SCORE = 0.3;

  const poseObject: PoseObject = {};

  const box: BoundingBox = {
    xMin: tensorWidth * 2,
    xMax: 0,
    yMin: tensorHeight * 2,
    yMax: 0,
    width: 0,
    height: 0,
  };

  pose.keypoints.forEach((k) => {
    if (k.score && k.score > MIN_KEYPOINT_SCORE) {
      // Flip horizontally on android or when using back camera on iOS.
      const x = flipX ? tensorWidth - k.x : k.x;
      const y = k.y;
      const cx =
        (x / tensorWidth) *
        (isPortrait ? CAM_PREVIEW_WIDTH : CAM_PREVIEW_HEIGHT);
      const cy =
        (y / tensorHeight) *
        (isPortrait ? CAM_PREVIEW_HEIGHT : CAM_PREVIEW_WIDTH);

      if (cx < box.xMin) {
        box.xMin = cx;
      }
      if (cx > box.xMax) {
        box.xMax = cx;
      }
      if (cy < box.yMin) {
        box.yMin = cy;
      }
      if (cy > box.yMax) {
        box.yMax = cy;
      }

      poseObject[k.name as KeyPointName] = {
        cx,
        cy,
        score: k.score,
        type: ['eye', 'ear', 'nose'].some((t) => k.name!.includes(t))
          ? 'head'
          : ['wrist', 'elbow', 'shoulder'].some((t) => k.name!.includes(t))
          ? 'arm'
          : 'leg',
      };
    }
  });

  box.width = box.xMax - box.xMin;
  box.height = box.yMax - box.yMin;

  return { pose: poseObject, box };
};

export const centerBoundingBoxInViewport = (
  box: Omit<BoundingBox, 'width' | 'height'>,
  viewportWidth: number,
  viewportHeight: number
): string => {
  const boxWidth = box.xMax - box.xMin;
  const boxHeight = box.yMax - box.yMin;
  const originX = box.xMin + (boxWidth - viewportWidth) / 2;
  const originY = box.yMin + (boxHeight - viewportHeight) / 2;

  return `${originX} ${originY} ${viewportWidth} ${viewportHeight}`;
};
