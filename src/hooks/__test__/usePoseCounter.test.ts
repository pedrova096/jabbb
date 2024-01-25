import { renderHook, act } from '@testing-library/react-native';
import { usePoseCounter } from '../usePoseCounter';
import { Pose as PoseType } from '@tensorflow-models/pose-detection';
import {
  adjustPose_VERY_CRAZY_,
  getPosesWithSameHeight,
} from '~/utils/keypoints.handler';
import * as React from 'react';

jest.mock('react', () => {
  const originalModule = jest.requireActual('react');

  return {
    ...originalModule,
    useState: jest.fn(),
    useEffect: jest.fn().mockImplementation((f) => f()),
  };
});

jest.mock('~/utils/keypoints.handler', () => ({
  adjustPose_VERY_CRAZY_: jest.fn(),
  getPosesWithSameHeight: jest.fn(),
}));

describe('usePoseCounter', () => {
  beforeEach(() => {
    (React.useState as jest.Mock).mockImplementation((init) => [
      init,
      jest.fn(),
    ]);
  });

  it('should return initial count and status', () => {
    const { result } = renderHook(() => usePoseCounter([], false));
    expect(result.current.count).toBe(0);
    expect(result.current.status).toBe('base');
  });

  it('should increment count and toggle status when pose is valid and enabled', () => {
    (React.useState as jest.Mock)
      .mockImplementationOnce((init) => [init, jest.fn()])
      .mockImplementationOnce((init) => [init, jest.fn((c) => c + 1)])
      .mockImplementationOnce((init) => [
        init,
        jest.fn((s) => (s === 'base' ? 'punch' : 'base')),
      ]);

    const pose: PoseType[] = [
      // mock pose data here
    ];

    const { result } = renderHook(() => usePoseCounter(pose, true));

    // mock implementation of adjustPose_VERY_CRAZY_ and getPosesWithSameHeight to return valid pose

    act(() => {
      // trigger useEffect
    });

    expect(result.current.count).toBe(1);
    expect(result.current.status).toBe('punch');
  });

  // add more test cases as needed
});
