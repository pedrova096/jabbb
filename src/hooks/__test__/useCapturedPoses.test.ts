import { renderHook, act, waitFor } from '@testing-library/react-native';
import type { Pose } from '@tensorflow-models/pose-detection';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useCapturedPoses } from '../useCapturedPoses';

jest.mock('@react-native-async-storage/async-storage', () => ({
  useAsyncStorage: jest.fn(),
}));

const useAsyncStorageMocked = jest.mocked(useAsyncStorage);

describe('useCapturedPoses', () => {
  const getItemMock = jest.fn();

  beforeEach(() => {
    useAsyncStorageMocked.mockReturnValue({
      getItem: getItemMock,
      setItem: jest.fn(),
      mergeItem: jest.fn(),
      removeItem: jest.fn(),
    });

    jest.clearAllMocks();
  });

  it('should load and retrieve a captured pose', async () => {
    getItemMock.mockResolvedValueOnce(undefined);

    // Given
    const { result } = renderHook(() => useCapturedPoses());

    // Expect
    expect(result.current).toMatchObject({
      isLoading: true,
      isLoaded: false,
      capturedPoses: undefined,
      addCapturedPose: expect.any(Function),
    });

    // When
    await waitFor(() => result.current.isLoaded);

    // Expect
    expect(result.current).toMatchObject({
      isLoading: false,
      isLoaded: true,
      capturedPoses: [],
      addCapturedPose: expect.any(Function),
    });
  });

  it('should add a captured pose', async () => {
    getItemMock.mockResolvedValueOnce('');
    // Given
    const { result } = renderHook(() => useCapturedPoses());

    // When
    await waitFor(() => result.current.isLoaded);

    // Expect
    expect(result.current).toMatchObject({
      isLoading: false,
      isLoaded: true,
      capturedPoses: [],
      addCapturedPose: expect.any(Function),
    });

    // When
    const capturedPose: Pose = {
      score: 0.5,
      keypoints: [],
    };
    act(() => {
      result.current.addCapturedPose([capturedPose], false, false);
    });

    // Expect
    expect(result.current).toMatchObject({
      isLoading: false,
      isLoaded: true,
      capturedPoses: [
        {
          capturedAt: expect.any(Date),
          isBackCamera: false,
          isPortrait: false,
          pose: capturedPose,
        },
      ],
      addCapturedPose: expect.any(Function),
    });
  });
});
