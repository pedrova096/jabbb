import {
  MoveNetModelConfig,
  Pose,
  PoseDetector,
  SupportedModels,
  createDetector,
  movenet,
} from '@tensorflow-models/pose-detection';
import { Camera } from 'expo-camera';
import { useEffect, useReducer, useRef, useState } from 'react';
import tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { ExpoWebGLRenderingContext } from 'expo-gl';

enum ModelStatus {
  LOADING,
  LOADED,
  FAILED,
}

enum StreamStatus {
  IDLE = 'IDLE',
  READY = 'READY',
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
}

export const usePoseDetectionModel = (
  {
    autorender = true,
    autostart = true,
  }: {
    autorender?: boolean;
    autostart?: boolean;
  } = {
    autorender: true,
    autostart: true,
  }
) => {
  const [{ model, status }, setModel] = useState<{
    status: ModelStatus;
    model?: PoseDetector;
  }>({
    status: ModelStatus.LOADING,
  });
  const [latency, setLatency] = useState(0);
  const [poses, setPoses] = useState<Pose[]>();
  const streamStatusRef = useRef(StreamStatus.IDLE);
  const [streamStatus, setStreamStatus] = useReducer(
    (_: unknown, action: StreamStatus) => {
      streamStatusRef.current = action;
      return action;
    },
    StreamStatus.IDLE
  );

  // - null: unset (initial value).
  // - 0: animation frame/loop has been canceled.
  // - >0: animation frame has been scheduled.
  const rafId = useRef<number | null>(null);
  const loopRef = useRef<() => void>();

  useEffect(() => {
    async function prepare() {
      rafId.current = null;

      // Camera permission.
      await Camera.requestCameraPermissionsAsync();

      console.log('Initializing tfjs...');
      // Wait for tfjs to initialize the backend.
      await tf.ready();

      // Load movenet model.
      // https://github.com/tensorflow/tfjs-models/tree/master/pose-detection
      const movenetModelConfig: MoveNetModelConfig = {
        modelType: movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
      };

      console.log('Loading model...');

      const modelJson = require('../constants/pose_model/model.json');
      const modelWeights1 = require('../constants/pose_model/group1-shard1of2.bin');
      const modelWeights2 = require('../constants/pose_model/group1-shard2of2.bin');
      movenetModelConfig.modelUrl = bundleResourceIO(modelJson, [
        modelWeights1,
        modelWeights2,
      ]);
      const model = await createDetector(
        SupportedModels.MoveNet,
        movenetModelConfig
      );
      console.log('Model loaded.');
      setModel({
        status: ModelStatus.LOADED,
        model,
      });
    }

    prepare();

    // Called when the app is unmounted.
    return () => {
      if (rafId.current != null && rafId.current !== 0) {
        cancelAnimationFrame(rafId.current);
        rafId.current = 0;
      }
    };
  }, []);

  // useEffect(() => {
  //   if (dateTrigger != null) {
  //     setDateTrigger(Date.now());
  //     console.log('Triggering camera stream...');
  //   }
  // }, [dateTrigger]);

  // TODO: Check if we could get updatePreview and gl from the ref.
  const onCameraStream = async (
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void,
    gl: ExpoWebGLRenderingContext
  ) => {
    console.log('Camera stream is ready!');

    setStreamStatus(StreamStatus.READY);

    loopRef.current = async () => {
      // Get the tensor and run pose detection.
      const imageTensor = images.next().value as tf.Tensor3D;

      const startTs = Date.now();
      const poses = await model!.estimatePoses(
        imageTensor,
        undefined,
        Date.now()
      );
      const latency = Date.now() - startTs;
      console.log(`Latency: ${latency}ms`);
      // setLatency(latency);
      setPoses(poses);
      tf.dispose([imageTensor]);

      if (rafId.current === 0) {
        return;
      }

      // Render camera preview manually when autorender=false.
      if (!autorender) {
        updatePreview();
        gl.endFrameEXP();
      }

      if (streamStatusRef.current !== StreamStatus.STOPPED) {
        rafId.current = requestAnimationFrame(loopRef.current!);

        if (streamStatusRef.current !== StreamStatus.RUNNING) {
          setStreamStatus(StreamStatus.RUNNING);
        }
      }
    };

    if (autostart) {
      loopRef.current();
    }
  };

  const isLoading = status === ModelStatus.LOADING;
  const isLoaded = status === ModelStatus.LOADED;

  const handleCameraReady = () => {};

  const runStream = () => {
    if (loopRef.current != null) {
      if (streamStatus !== StreamStatus.RUNNING) {
        setStreamStatus(StreamStatus.READY);
        loopRef.current();
      }
    }
  };

  const stopStream = () => {
    setStreamStatus(StreamStatus.STOPPED);
  };

  return {
    poses,
    latency,
    isLoading,
    isLoaded,
    onCameraStream,
    handleCameraReady,
    runStream,
    stopStream,
  };
};
