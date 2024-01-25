import { renderHook, act } from '@testing-library/react-native';
import { CameraType } from 'expo-camera';
import { useCameraType } from '../useCameraType';

describe('useCameraType', () => {
  it('should toggle camera type', () => {
    const { result } = renderHook(() => useCameraType());

    // Initial camera type should be 'front'
    expect(result.current.cameraType).toBe(CameraType.front);

    // Toggle camera type
    act(() => {
      result.current.toggleCameraType();
    });

    // Camera type should now be 'back'
    expect(result.current.cameraType).toBe(CameraType.back);

    // Toggle camera type again
    act(() => {
      result.current.toggleCameraType();
    });

    // Camera type should now be 'front' again
    expect(result.current.cameraType).toBe(CameraType.front);
  });
});
