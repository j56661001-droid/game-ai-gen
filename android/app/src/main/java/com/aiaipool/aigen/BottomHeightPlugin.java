package com.aiaipool.aigen;

import android.app.Activity;
import android.graphics.Rect;
import android.os.Build;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.WindowInsets;
import android.view.WindowManager;
import android.util.DisplayMetrics;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;

@CapacitorPlugin(name = "BottomHeightPlugin")
public class BottomHeightPlugin extends Plugin implements ViewTreeObserver.OnGlobalLayoutListener {

    private int lastBottomHeight = 0;
    private ViewTreeObserver.OnGlobalLayoutListener layoutListener;
    private int screenHeight = 0;

    @Override
    public void load() {
        super.load();
        // 初始化屏幕高度
        initScreenHeight();
        // 开始监听布局变化
        startListening();
    }

    @PluginMethod
    public void getCurrentBottomHeight(PluginCall call) {
        int currentHeight = calculateBottomHeight();
        JSObject ret = new JSObject();
        ret.put("height", currentHeight);
        call.resolve(ret);
    }

    @PluginMethod
    public void startListening(PluginCall call) {
        startListening();
        call.resolve();
    }

    @PluginMethod
    public void stopListening(PluginCall call) {
        stopListening();
        call.resolve();
    }

    private void initScreenHeight() {
        Activity activity = getActivity();
        if (activity != null) {
            DisplayMetrics displayMetrics = new DisplayMetrics();
            activity.getWindowManager().getDefaultDisplay().getRealMetrics(displayMetrics);
            screenHeight = displayMetrics.heightPixels;
        }
    }

    private void startListening() {
        Activity activity = getActivity();
        if (activity != null && layoutListener == null) {
            View rootView = activity.findViewById(android.R.id.content);
            if (rootView != null) {
                layoutListener = this;
                rootView.getViewTreeObserver().addOnGlobalLayoutListener(layoutListener);
            }
        }
    }

    private void stopListening() {
        if (getActivity() != null && layoutListener != null) {
            View rootView = getActivity().findViewById(android.R.id.content);
            if (rootView != null) {
                rootView.getViewTreeObserver().removeOnGlobalLayoutListener(layoutListener);
                layoutListener = null;
            }
        }
    }

    @Override
    public void onGlobalLayout() {
        int currentHeight = calculateBottomHeight();
        if (currentHeight != lastBottomHeight) {
            lastBottomHeight = currentHeight;

            // 发送高度变化事件到前端
            JSObject data = new JSObject();
            data.put("height", currentHeight);
            data.put("timestamp", System.currentTimeMillis());

            notifyListeners("bottomHeightChanged", data);
        }
    }

    private int calculateBottomHeight() {
        Activity activity = getActivity();
        if (activity == null) return 0;

        View rootView = activity.findViewById(android.R.id.content);
        if (rootView == null) return 0;

        // 获取屏幕密度（用于 px → dp 或 px → CSS px）
        DisplayMetrics metrics = activity.getResources().getDisplayMetrics();
        float density = metrics.density; // 例如 2.75

        int rawHeightPx = 0;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowInsets insets = rootView.getRootWindowInsets();
            if (insets != null) {
                boolean isImeVisible = insets.isVisible(WindowInsets.Type.ime());
                if (isImeVisible) {
                    rawHeightPx = insets.getInsets(WindowInsets.Type.ime()).bottom;
                } else {
                    rawHeightPx = insets.getInsets(WindowInsets.Type.navigationBars()).bottom;
                }
            }
        }

        // 转换为 CSS 像素（逻辑像素）
        int heightInCssPx = Math.round(rawHeightPx / density);

        // 限制：不能超过屏幕高度的 45%
        if (screenHeight > 0) {
            int maxHeightInPx = Math.round(screenHeight * 0.45f);
            int maxHeightInCssPx = Math.round(maxHeightInPx / density);
            if (heightInCssPx > maxHeightInCssPx) {
                heightInCssPx = maxHeightInCssPx;
            }
        }

        return heightInCssPx;
    }

    @Override
    protected void handleOnDestroy() {
        stopListening();
        super.handleOnDestroy();
    }
}