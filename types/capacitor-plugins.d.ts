export interface BottomHeightPlugin {
  /**
   * 获取当前底部高度（导航栏 + 输入法高度）
   */
  getCurrentBottomHeight(): Promise<{ height: number }>;

  /**
   * 开始监听底部高度变化
   */
  startListening(): Promise<void>;

  /**
   * 停止监听底部高度变化
   */
  stopListening(): Promise<void>;

  /**
   * 添加高度变化监听器
   */
  addListener(
    eventName: 'bottomHeightChanged',
    listenerFunc: (data: { height: number; timestamp: number }) => void,
  ): Promise<any>;

  /**
   * 移除监听器
   */
  removeAllListeners(): Promise<void>;
}

declare global {
  interface PluginRegistry {
    BottomHeight?: BottomHeightPlugin;
  }
}
