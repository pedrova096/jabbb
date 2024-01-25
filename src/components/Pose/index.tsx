import { Pose as PoseType } from '@tensorflow-models/pose-detection';
import { StyleSheet, View } from 'react-native';
import { IS_ANDROID } from '~/constants/config';
import { Circle, G, Polyline, Svg } from 'react-native-svg';
import {
  CAM_PREVIEW_ASPECT_RATIO,
  CAM_PREVIEW_HEIGHT,
  CAM_PREVIEW_WIDTH,
} from '../TensorCamera';
import { colors, addOpacity } from '~/constants/theme';
import React from 'react';
import {
  PoseObject,
  centerBoundingBoxInViewport,
  convertPoseToPoseObject,
} from '~/utils/keypoints.handler';

export interface PoseProps {
  poses: PoseType[];
  isBackCamera: boolean;
  isPortrait: boolean;
  tensorWidth: number;
  tensorHeight: number;
  center?: boolean;
  centerColor?: string;

  themeColors?: ThemeColors;
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    aspectRatio: CAM_PREVIEW_ASPECT_RATIO,
    position: 'absolute',
    zIndex: 30,
  },
});

const KeyPointNodes: React.FC<{
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

const KeyLineEdges: React.FC<{
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
  centerColor,
  center,
  themeColors,
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

    const viewBox = center
      ? centerBoundingBoxInViewport(box, CAM_PREVIEW_WIDTH, CAM_PREVIEW_HEIGHT)
      : '';

    return (
      <PoseBase viewBox={viewBox} pose={pose} themeColors={themeColors}>
        {center && (
          <Polyline
            id="box"
            points={`${box.xMin},${box.yMin} ${box.xMax},${box.yMin} ${box.xMax},${box.yMax} ${box.xMin},${box.yMax} ${box.xMin},${box.yMin}`}
            stroke={addOpacity(centerColor ?? colors.primary, 0.1)}
            strokeWidth="4"
            fill="none"
          />
        )}
      </PoseBase>
    );
  } else {
    return <View></View>;
  }
};

type ThemeColors = {
  primary: string;
  primaryDark: string;
};
export interface PoseBaseProps {
  viewBox?: string;
  pose: PoseObject;
  children?: React.ReactNode;
  opacity?: number;
  themeColors?: ThemeColors;
}

export const PoseBase: React.FC<PoseBaseProps> = ({
  viewBox,
  pose,
  children,
  opacity = 1,
  themeColors = {
    primary: colors.primary,
    primaryDark: colors.primaryDark,
  },
}) => {
  return (
    <Svg viewBox={viewBox} style={styles.base}>
      <G opacity={opacity}>
        <KeyLineEdges
          points={[pose.left_shoulder, pose.right_shoulder]}
          color={addOpacity(themeColors.primaryDark, 0.1)}
        />

        <KeyLineEdges
          points={[pose.left_shoulder, pose.left_hip]}
          color={addOpacity(themeColors.primaryDark, 0.4)}
        />
        <KeyLineEdges
          points={[pose.left_hip, pose.left_knee, pose.left_ankle]}
          color={themeColors.primaryDark}
        />

        <KeyLineEdges
          points={[pose.right_shoulder, pose.right_hip]}
          color={addOpacity(themeColors.primaryDark, 0.4)}
        />
        <KeyLineEdges
          points={[pose.right_hip, pose.right_knee, pose.right_ankle]}
          color={themeColors.primaryDark}
        />

        <KeyLineEdges
          points={[pose.left_wrist, pose.left_elbow, pose.left_shoulder]}
          color={themeColors.primary}
        />
        <KeyLineEdges
          points={[pose.right_wrist, pose.right_elbow, pose.right_shoulder]}
          color={themeColors.primary}
        />

        {Object.entries(pose).map(([key, value]) => (
          <KeyPointNodes
            key={key}
            value={value}
            color={
              {
                head: addOpacity(themeColors.primary, 0.4),
                leg: themeColors.primaryDark,
                arm: themeColors.primary,
              }[value.type!]
            }
          />
        ))}
      </G>

      {children}
    </Svg>
  );
};
