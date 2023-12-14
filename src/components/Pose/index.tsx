import { Pose as PoseType } from '@tensorflow-models/pose-detection';
import { View } from 'react-native';
import { IS_ANDROID } from '../../constants/config';
import { Circle, Svg } from 'react-native-svg';
import { CAM_PREVIEW_HEIGHT, CAM_PREVIEW_WIDTH } from '../TensorCamera';

interface PoseProps {
  poses: PoseType[];
  isBackCamera: boolean;
  isPortrait: boolean;
  tensorWidth: number;
  tensorHeight: number;
}

// The score threshold for pose detection results.
const MIN_KEYPOINT_SCORE = 0.3;

export const Pose: React.FC<PoseProps> = ({
  poses,
  isPortrait,
  isBackCamera,
  tensorWidth,
  tensorHeight,
}) => {
  if (poses != null && poses.length > 0) {
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

    return <Svg>{keypoints}</Svg>;
  } else {
    return <View></View>;
  }
};
