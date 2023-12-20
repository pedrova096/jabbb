import { Keypoint, Pose as PoseType } from '@tensorflow-models/pose-detection';
import { StyleSheet, View } from 'react-native';
import { IS_ANDROID } from '~/constants/config';
import { Circle, Polyline, Svg } from 'react-native-svg';
import {
  CAM_PREVIEW_ASPECT_RATIO,
  CAM_PREVIEW_HEIGHT,
  CAM_PREVIEW_WIDTH,
} from '../TensorCamera';
import { colors, addOpacity } from '~/constants/theme';
import React from 'react';
import { KeyPointName } from '~/types';

interface PoseProps {
  poses: PoseType[];
  isBackCamera: boolean;
  isPortrait: boolean;
  tensorWidth: number;
  tensorHeight: number;
  center?: boolean;
}

type PoseObject = {
  [key in KeyPointName]?: {
    cx: number;
    cy: number;
    score: number;
    type?: 'head' | 'arm' | 'leg';
  };
};

// The score threshold for pose detection results.
const MIN_KEYPOINT_SCORE = 0.3;

const styles = StyleSheet.create({
  base: {
    width: '100%',
    aspectRatio: CAM_PREVIEW_ASPECT_RATIO,
    position: 'absolute',
    zIndex: 30,
  },
});

const convertPoseToPoseObject = ({
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
  const poseObject: PoseObject = {};
  const box = {
    xMin: tensorWidth,
    xMax: 0,
    yMin: tensorHeight,
    yMax: 0,
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

  return { pose: poseObject, box };
};

const PoseDot: React.FC<{
  value: PoseObject[keyof PoseObject];
  color?: string;
}> = ({ value, color = colors.primary }) => {
  if (value) {
    return (
      <Circle
        cx={value.cx}
        cy={value.cy}
        r="4"
        strokeWidth="4"
        stroke={color}
        fill="white"
      />
    );
  } else {
    return null;
  }
};

const PoseLine: React.FC<{
  points: Array<PoseObject[keyof PoseObject]>;
  color?: string;
}> = ({ points, color = colors.primary }) => {
  if (points.length > 1) {
    const pointsString = points
      .filter((p) => p)
      .map((p) => `${p!.cx},${p!.cy}`)
      .reduce((acc, p) => `${acc} ${p}`, '');

    if (pointsString.length === 0) {
      return null;
    }

    return (
      <Polyline
        points={pointsString}
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="3"
        fill="none"
      />
    );
  } else {
    return null;
  }
};

export const Pose: React.FC<PoseProps> = ({
  poses,
  isPortrait,
  isBackCamera,
  tensorWidth,
  tensorHeight,
  center,
}) => {
  if (poses.length > 0) {
    const flipX = IS_ANDROID || isBackCamera;

    const { pose, box } = convertPoseToPoseObject({
      pose: poses[0],
      flipX,
      isPortrait,
      tensorWidth,
      tensorHeight,
    });

    const boxWidth = box.xMax - box.xMin;
    const boxHeight = box.yMax - box.yMin;
    // console.log(boxWidth, boxHeight);

    const originX = box.xMin + (boxWidth - CAM_PREVIEW_WIDTH) / 2;
    const originY = box.yMin + (boxHeight - CAM_PREVIEW_HEIGHT) / 2;

    const head = Object.values(pose).filter((p) => p?.type === 'head');
    const averageYHead = head.reduce((acc, h) => acc + h!.cy, 0) / head.length;
    const averageXHead = head.reduce((acc, h) => acc + h!.cx, 0) / head.length;

    return (
      <Svg
        viewBox={
          center
            ? `${originX} ${originY} ${CAM_PREVIEW_WIDTH} ${CAM_PREVIEW_HEIGHT}`
            : ''
        }
        style={styles.base}>
        <Circle
          cx={averageXHead}
          cy={averageYHead}
          r="20"
          strokeWidth="4"
          stroke={addOpacity(colors.primaryDark, 0.1)}
          fill="white"
        />
        <PoseLine
          points={[pose.left_shoulder, pose.right_shoulder]}
          color={addOpacity(colors.primaryDark, 0.1)}
        />

        <PoseLine
          points={[pose.left_shoulder, pose.left_hip]}
          color={addOpacity(colors.primaryDark, 0.4)}
        />
        <PoseLine
          points={[pose.left_hip, pose.left_knee, pose.left_ankle]}
          color={colors.primaryDark}
        />

        <PoseLine
          points={[pose.right_shoulder, pose.right_hip]}
          color={addOpacity(colors.primaryDark, 0.4)}
        />
        <PoseLine
          points={[pose.right_hip, pose.right_knee, pose.right_ankle]}
          color={colors.primaryDark}
        />

        <PoseLine
          points={[pose.left_wrist, pose.left_elbow, pose.left_shoulder]}
        />
        <PoseLine
          points={[pose.right_wrist, pose.right_elbow, pose.right_shoulder]}
        />

        {Object.entries(pose)
          .filter((f) => f[1].type !== 'head')
          .map(([key, value]) => (
            <PoseDot
              key={key}
              value={value}
              color={value.type === 'arm' ? colors.primary : colors.primaryDark}
            />
          ))}
      </Svg>
    );
  } else {
    return <View></View>;
  }
};
