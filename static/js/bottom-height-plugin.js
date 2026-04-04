import { registerPlugin } from '@capacitor/core';

/**
 * Bottom Height Plugin for detecting navigation bar and keyboard height
 *
 * Methods:
 * - getCurrentBottomHeight(): Promise<{ height: number }>
 * - startListening(): Promise<void>
 * - stopListening(): Promise<void>
 * - addListener(eventName: 'bottomHeightChanged', callback: Function): Promise<any>
 * - removeAllListeners(): Promise<void>
 */
const BottomHeight = registerPlugin('BottomHeightPlugin');

export default BottomHeight;