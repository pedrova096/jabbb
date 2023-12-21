import { Pose as PoseType } from '@tensorflow-models/pose-detection';
import { StyleSheet, View } from 'react-native';
import { IS_ANDROID } from '~/constants/config';
import { Circle, Polyline, Svg } from 'react-native-svg';
import { colors, addOpacity } from '~/constants/theme';
import React from 'react';
import { KeyPointName } from '~/types';
import {
  PoseObject,
  boundingBoxFromPose,
  centerBoundingBoxInViewport,
  changeHeightScale,
  convertPoseToPoseObject,
  findKeypointByName,
} from '~/utils/keypoints.handler';
import { Pose, PoseBase, PoseProps } from '~/components/Pose';

interface MatchPoseProps extends Omit<PoseProps, 'center' | 'centerColor'> {
  basePose: PoseType;
}

const styles = StyleSheet.create({});

const KEYPOINTS_RADIUS: {
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

const KeyPointArea: React.FC<{
  size: number;
  value: PoseObject[keyof PoseObject];
  color?: string;
  opacity?: number;
}> = ({ size, value, color = colors.primary, opacity = 0.4 }) => {
  if (value) {
    return (
      <Circle
        cx={value.cx}
        cy={value.cy}
        r={size}
        strokeWidth="0"
        fill={addOpacity(color, opacity)}
      />
    );
  } else {
    return null;
  }
};

export const MatchPose: React.FC<MatchPoseProps> = ({
  poses,
  basePose,
  isPortrait,
  isBackCamera,
  tensorWidth,
  tensorHeight,
}) => {
  if (poses.length > 0) {
    const flipX = IS_ANDROID || isBackCamera;

    const bHeight = boundingBoxFromPose(poses[0]).height;

    const { pose } = convertPoseToPoseObject({
      pose: changeHeightScale(basePose, bHeight),
      flipX,
      isPortrait,
      tensorWidth,
      tensorHeight,
    });

    const { pose: poseB } = convertPoseToPoseObject({
      pose: poses[0],
      flipX,
      isPortrait,
      tensorWidth,
      tensorHeight,
    });

    const comparePosesByName = (name: string) => {
      const point = pose[name as keyof PoseObject]!;
      const bpoint = poseB[name as keyof PoseObject]!;
      const radius = KEYPOINTS_RADIUS[name as keyof typeof KEYPOINTS_RADIUS];

      if (!bpoint || !point) {
        return 0.1;
      }

      const distance = Math.sqrt(
        Math.pow(point.cx - bpoint.cx, 2) + Math.pow(point.cy - bpoint.cy, 2)
      );

      if (distance < radius / 2) {
        return 1;
      } else if (distance < radius) {
        return 0.8;
      }
      return 0;
    };

    return (
      <PoseBase
        pose={pose}
        opacity={0.2}
        themeColors={{
          primary: colors.light,
          primaryDark: colors.primaryLight,
        }}>
        {Object.keys(pose).map((key) => {
          const keypoint = pose[key as keyof PoseObject];
          const size = KEYPOINTS_RADIUS[key as keyof typeof KEYPOINTS_RADIUS];

          return (
            <KeyPointArea
              key={key}
              value={keypoint}
              size={size}
              color={colors.green}
              opacity={comparePosesByName(key)}
            />
          );
        })}
      </PoseBase>
    );
  } else {
    return null;
  }
};
