## 代码格式化

使用[vscode](https://code.visualstudio.com/)编写代码时，使用 `prettier` 进行代码格式化，配置如下：

### 配置步骤：

- Step 1. vscode 安装 `Prettier - Code formatter` ;

- Step 2. 项目根目录下安装npm包： `prettier`

  ```ts
  npm i prettier --save-dev
  ```

- Step 3. vscode 格式化配置

1. 使用快捷键 Ctrl + Shift + P（Windows/Linux）或 Cmd + Shift + P（macOS）打开命令面板
2. 输入 Preferences: Open Settings (JSON) 或 打开设置（JSON），然后回车
3. 在打开的settings.json中，加入如下配置：
   ```ts
   {
        "editor.formatOnSave": true,
        "[uvue]": {
            "editor.defaultFormatter": "esbenp.prettier-vscode"
        },
        "prettier.documentSelectors": ["**/*.uvue", "**/*.uts"],
        "prettier.requireConfig": true
    }
   ```
4. 项目根目录下新建 `prettier-plugin-uts.js` 文件，代码如下：
   ```ts
   const languages = [
     {
       name: "uts",
       parsers: ["typescript"],
       vscodeLanguageIds: ["uts"],
     },
   ];
   module.exports = { languages };
   ```
5. 项目根目录下新建 `.prettierrc` 文件，代码如下：
   ```ts
   {
        "plugins": [
            "./prettier-plugin-uts.js"
        ],
        "overrides": [
            {
            "files": "*.uvue",
            "options": {
                "parser": "vue"
            }
            },
            {
            "files": "*.uts",
            "options": {
                "parser": "typescript"
            }
            }
        ]
    }
   ```

#### 配置好上述内容后，即可使用格式化功能
