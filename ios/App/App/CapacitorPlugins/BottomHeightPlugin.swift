import Foundation
import Capacitor
import UIKit

@objc(BottomHeightPlugin)
public class BottomHeightPlugin: CAPPlugin, CAPBridgedPlugin {

    private var lastBottomHeight: CGFloat = 0
    private var screenHeight: CGFloat = 0

    public let identifier = "BottomHeightPlugin"
    public let jsName = "BottomHeightPlugin"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getCurrentBottomHeight", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startListening", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopListening", returnType: CAPPluginReturnPromise)
    ]


    public override func load() {
        super.load()
        initScreenHeight()
        startListening()
    }

    @objc func getCurrentBottomHeight(_ call: CAPPluginCall) {
        let currentHeight = calculateBottomHeight()
        call.resolve(["height": currentHeight])
    }

    @objc func startListening(_ call: CAPPluginCall) {
        startListening()
        call.resolve()
    }

    @objc func stopListening(_ call: CAPPluginCall) {
        stopListening()
        call.resolve()
    }

    private func initScreenHeight() {
        DispatchQueue.main.async {
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first {
                self.screenHeight = window.screen.bounds.height
            }
        }
    }

    private func startListening() {
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(keyboardWillChangeFrame),
                                               name: UIResponder.keyboardWillChangeFrameNotification, 
                                               object: nil)
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(keyboardWillHide),
                                               name: UIResponder.keyboardWillHideNotification,
                                               object: nil)
    }

    private func stopListening() {
        NotificationCenter.default.removeObserver(self,
                                                  name: UIResponder.keyboardWillChangeFrameNotification,
                                                  object: nil)
        NotificationCenter.default.removeObserver(self,
                                                  name: UIResponder.keyboardWillHideNotification,
                                                  object: nil)
    }

    @objc private func keyboardWillChangeFrame(notification: NSNotification) {
        guard let userInfo = notification.userInfo,
              let keyboardFrame = (userInfo[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue else {
            return
        }

        let currentHeight = calculateBottomHeight(keyboardFrame: keyboardFrame)
        if currentHeight != lastBottomHeight {
            lastBottomHeight = currentHeight
            notifyListeners("bottomHeightChanged", data: ["height": currentHeight, "timestamp": Date().timeIntervalSince1970 * 1000])
        }
    }

    @objc private func keyboardWillHide(notification: NSNotification) {
        let currentHeight = calculateBottomHeight(keyboardFrame: .zero) // 键盘隐藏时，高度为0
        if currentHeight != lastBottomHeight {
            lastBottomHeight = currentHeight
            notifyListeners("bottomHeightChanged", data: ["height": currentHeight, "timestamp": Date().timeIntervalSince1970 * 1000])
        }
    }

    private func calculateBottomHeight(keyboardFrame: CGRect? = nil) -> CGFloat {
        if Thread.isMainThread {
            return _calculateBottomHeight(keyboardFrame: keyboardFrame)
        } else {
            return DispatchQueue.main.sync {
                return _calculateBottomHeight(keyboardFrame: keyboardFrame)
            }
        }
    }

    private func _calculateBottomHeight(keyboardFrame: CGRect? = nil) -> CGFloat {
        var height: CGFloat = 0

        if let keyboardFrame = keyboardFrame, keyboardFrame.height > 0 {
            // 键盘可见时，取键盘高度
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first {
                let intersection = window.frame.intersection(keyboardFrame)
                height = intersection.height
            }
        } else {
            // 键盘不可见时，取底部安全区域高度
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first {
                height = window.safeAreaInsets.bottom
            }
        }

        // 转换为逻辑像素（点）
        let scale = UIScreen.main.scale // 物理像素与逻辑像素的比例
        let heightInPoints = height / scale

        // 限制：不能超过屏幕高度的 45%
        if screenHeight > 0 {
            let maxHeightInPoints = screenHeight * 0.45
            if heightInPoints > maxHeightInPoints {
                return maxHeightInPoints
            }
        }

        return heightInPoints
    }

    deinit {
        stopListening()
    }
}
