package com.aiaipool.aigen;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // 注册底部高度检测插件
        registerPlugin(BottomHeightPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
