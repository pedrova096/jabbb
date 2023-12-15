import { Pose as PoseType } from '@tensorflow-models/pose-detection';
import { StyleSheet, View } from 'react-native';
import { IS_ANDROID } from '~/constants/config';
import { Circle, Svg } from 'react-native-svg';
import { CAM_PREVIEW_HEIGHT, CAM_PREVIEW_WIDTH } from '../TensorCamera';

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

// The score threshold for pose detection results.
const MIN_KEYPOINT_SCORE = 0.3;

const styles = StyleSheet.create({
  base: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 30,
    backgroundColor: '#ff00001D',
  },
});

export const Pose: React.FC<PoseProps> = ({
  poses,
  isPortrait,
  isBackCamera,
  tensorWidth,
  tensorHeight,
}) => {
  if (poses.length > 0) {
    console.log(poses[0].keypoints.map((k) => k.name).join(', '));
    const keypoints = poses[0].keypoints
      .filter((k) => (k.score ?? 0) > MIN_KEYPOINT_SCORE)
      .map((k) => {
        // Flip horizontally on android or when using back camera on iOS.
        const flipX = IS_ANDROID || isBackCamera;
        const x = flipX ? tensorWidth - k.x : k.x;
        const y = k.y;
        const cx =
          (x / tensorWidth) *
          (isPortrait ? CAM_PREVIEW_WIDTH : CAM_PREVIEW_HEIGHT);
        const cy =
          (y / tensorHeight) *
          (isPortrait ? CAM_PREVIEW_HEIGHT : CAM_PREVIEW_WIDTH);

        return (
          <Circle
            key={`skeletonkp_${k.name}`}
            cx={cx}
            cy={cy}
            r="4"
            strokeWidth="2"
            fill="#00AA00"
            stroke="white"
          />
        );
      });

    return <Svg style={styles.base}>{keypoints}</Svg>;
  } else {
    return <View></View>;
  }
};
