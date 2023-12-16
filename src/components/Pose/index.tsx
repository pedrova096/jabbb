import { Keypoint, Pose as PoseType } from '@tensorflow-models/pose-detection';
import { StyleSheet, View } from 'react-native';
import { IS_ANDROID } from '~/constants/config';
import { Circle, Polyline, Svg } from 'react-native-svg';
import { CAM_PREVIEW_HEIGHT, CAM_PREVIEW_WIDTH } from '../TensorCamera';
import { colors, addOpacity } from '~/constants/theme';
import React from 'react';

export enum KeyPointName {
  nose = 'nose',
  left_eye = 'left_eye',
  right_eye = 'right_eye',

  left_ear = 'left_ear',
  right_ear = 'right_ear',

  left_shoulder = 'left_shoulder',
  right_shoulder = 'right_shoulder',

  left_elbow = 'left_elbow',
  right_elbow = 'right_elbow',

  left_wrist = 'left_wrist',
  right_wrist = 'right_wrist',

  left_hip = 'left_hip',
  right_hip = 'right_hip',

  left_knee = 'left_knee',
  right_knee = 'right_knee',

  left_ankle = 'left_ankle',
  right_ankle = 'right_ankle',
}

interface PoseProps {
  poses: PoseType[];
  isBackCamera: boolean;
  isPortrait: boolean;
  tensorWidth: number;
  tensorHeight: number;
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
    height: '100%',
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

  return poseObject;
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
}) => {
  if (poses.length > 0) {
    const flipX = IS_ANDROID || isBackCamera;

    const pose = convertPoseToPoseObject({
      pose: poses[0],
      flipX,
      isPortrait,
      tensorWidth,
      tensorHeight,
    });

    const head = Object.values(pose).filter((p) => p?.type === 'head');
    const averageYHead = head.reduce((acc, h) => acc + h!.cy, 0) / head.length;
    const averageXHead = head.reduce((acc, h) => acc + h!.cx, 0) / head.length;

    return (
      <Svg style={styles.base}>
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
