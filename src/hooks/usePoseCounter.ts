import { Pose } from '@tensorflow-models/pose-detection';
import { useCapturedPoses } from './useCapturedPoses';
import { useEffect, useState } from 'react';

export const usePoseCounter = (pose: Pose[], enabled: boolean) => {
  const { capturedPoses, isLoaded } = useCapturedPoses();
  const [status, setStatus] = useState<0 | 1>(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isLoaded && pose.length && enabled) {
      const currentPose = capturedPoses![status].pose;
      const errorRange = 50;
      const currentNose = currentPose.keypoints.find((k) => k.name === 'nose')!;

      const isValid = pose.some((p, i) => {
        const poseNose = p.keypoints.find((k) => k.name === 'nose')!;
        const offsetX = Math.abs(poseNose.x - currentNose.x);
        const offsetY = Math.abs(poseNose.y - currentNose.y);
        return p.keypoints.every((k, j) => {
          const currentKeyPoint = currentPose.keypoints.find(
            (ck) => ck.name === k.name
          )!;
          const distanceX = Math.abs(currentKeyPoint.x - k.x - offsetX);
          const distanceY = Math.abs(currentKeyPoint.y - k.y - offsetY);
          console.log('in_point', k.name, distanceX, distanceY);
          return distanceX <= errorRange && distanceY <= errorRange;
        });
      });

      if (isValid) {
        if (status === 1) {
          setCount((c) => c + 1);
        }

        setStatus((s) => (s === 0 ? 1 : 0));
      }
    }
  }, [pose, isLoaded, enabled]);

  return { count, status };
};
