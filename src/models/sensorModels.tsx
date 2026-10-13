import type { ComponentType } from 'react';
import type { SensorId } from '../content/types';
import { GnssModel } from './GnssAntenna';
import { HCSR04_FLOOR_Y, HcSr04Model } from './HcSr04';
import { IMU_FLOOR_Y, ImuBoardModel } from './ImuBoard';
import { RADAR_PLACEHOLDER, RadarPlaceholderModel } from './RadarPlaceholder';
import { ZED, Zed2iModel } from './Zed2i';

/**
 * Built-in procedural model for each sensor, its lowest point and its largest
 * dimension (both mm). `size` lets line-ups show every sensor at a readable size.
 */
export const sensorModels: Record<SensorId, { Model: ComponentType; floorY: number; size: number }> = {
  zed2i: { Model: Zed2iModel, floorY: -ZED.height / 2, size: ZED.width },
  radar: { Model: RadarPlaceholderModel, floorY: -RADAR_PLACEHOLDER.height / 2 - 5, size: RADAR_PLACEHOLDER.width + 10 },
  gnss: { Model: GnssModel, floorY: 0, size: 150 },
  imu: { Model: ImuBoardModel, floorY: IMU_FLOOR_Y, size: 26 },
  ultrasonic: { Model: HcSr04Model, floorY: HCSR04_FLOOR_Y, size: 45 },
};
