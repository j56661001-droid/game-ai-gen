
# Telegram 机器人与 Mini App 设置指南

创建 Telegram 机器人并关联 Mini App 的简明操作步骤。

## 第一步：创建机器人

1.  在 Telegram 搜索并打开官方的 **BotFather**。
2.  发送 `/newbot` 命令。
3.  按照提示，依次为机器人设置一个**名称 (Name)** 和一个**用户名 (Username)**。
    *   **重要**：用户名必须以 `_bot` 结尾，例如 `seseai_bot`。
4.  创建成功后，请记下您的**机器人用户名**， 以及**API TOKEN**。

## 第二步：创建/关联 Mini App (通过 /newapp)

在 Telegram 中，通过 @BotFather 使用 /newapp 指令创建 Mini App（小程序/Web App）的流程非常标准化。

**具体创建流程**

1.  **启动指令**
    打开与 @BotFather 的对话框，发送指令：
    `/newapp`
2.  **选择关联的 Bot**
    BotFather 会列出你名下的 Bot，点击你要关联该 App 的 Bot 用户名。
3.  **输入标题 (Title)**
    输入 App 的名称（例如：My Super Game）。这是用户打开 App 时看到的标题。
4.  **输入描述 (Description)**
    输入一段简短的介绍。当用户分享这个 App 链接时，这段文字会显示在预览中。
5.  **上传演示图/封面 (Photo/Video)**
    上传一张图片或 GIF。
    要求：尺寸通常建议为 640x360 像素。
    这是用户在点击链接前看到的预览图。
6.  **输入 Web App URL**
    输入你的外部网页地址（必须是 https:// 开头）。
    这是用户点击 App 后实际加载的网页。
7.  **设置短名 (Short Name)**
    输入一个短标识符（例如：shop）。
    这会构成你的 Mini App 直接访问链接：`t.me/你的Bot用户名/shop`。

## 第三步：关联 Mini App (通过 Menu Button)

这是将我们应用配置为您专属小程序的关键步骤。

1.  在 **BotFather** 中，发送 `/mybots` 命令，然后选择您刚刚创建的机器人。
2.  依次点击 `Bot Settings` -> `Menu Button`。
3.  点击 `Configure Menu Button`，BotFather 会要求您提供应用链接。
    **构造并发送以下格式的链接**：
    ```
    [应用主地址]?ctx=[您的机器人用户名]_bot_[您为小程序设置的简称]

    ```
    **关于 `ctx` 参数**: `ctx` 参数用于在打开 Mini App 时向您的 Web App 传递tg机器人和应用名，以便推广分析功能正确生成分享链接。

    *   **[应用主地址]**: 主站域名，或一级分销商的带二级域名的主站域名。
    *   **[您的机器人用户名]**: 您在第一步中创建的用户名。
    *   **[您为小程序设置的简称]**: 一个自定义的简短名称（纯英文，例如 `seseai`），您将在下一步中设置它。

    **示例**：
    如果我们的应用地址是 `https://seseai.com`，您的机器人用户名是 `seseai_bot`，您打算使用 `seseai` 作为小程序简称，那么您需要发送给 BotFather 的完整链接是：
    `https://seseai.com?ctx=seseai_bot_bot_seseai`

5.  发送上述链接后，BotFather 会要求您为小程序设置一个 **简称 (Short Name)**。请输入您在上一步链接中使用的简称（例如 `seseai`）。

## 第四步：

向后端提供创建bot时生成的 api token
