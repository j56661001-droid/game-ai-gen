#!/bin/bash

# =============================================================================
# 自动化打包脚本
# 流程:
# 1. 构建 APKPure 的 Android 包, 产物: seseai_apkpure.apk
# 2. 构建标准版 APP 的 Android 包, 产物: seseai.apk
# 3. 构建 Web 包, 并将 seseai.apk 放入其中
# 4. 压缩 Web 包为 web.zip
# =============================================================================

set -e
BUILD_ENV=${1:-test} # 接受第一个参数作为构建环境，默认为 'test'

NO_APKPURE=false
if [ "$2" == "noapkpure" ]; then
    NO_APKPURE=true
fi

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $@"; }
success() { echo -e "${GREEN}✅ ${NC}"; }
error() { echo -e "${RED}❌ ${NC}"; exit 1; }

# 确保在项目根目录执行
cd "$(dirname "$0")"

echo -e "${GREEN}========== AI-Gen 自动化打包 ==========${NC}"

# 1. 清理
log "清理旧的构建产物..."
rm -rf unpackage/dist/build
mkdir -p unpackage/dist/build

if [ "$NO_APKPURE" == "false" ]; then
    # 2. 构建 APKPure 版本
    log "Step 1/6: 准备构建 APKPure 资源..."
    npm run build:app -- --source=APKPURE || error "APKPURE 版本资源编译失败"

    log "Step 2/6: 构建 APKPure APK..."
    (cd android && ./gradlew clean && ./gradlew assembleRelease) || error "APKPure APK 构建失败"

    log "Step 3/6: 处理 APKPure APK..."
    # 在 android/app/build/outputs/apk/release/ 目录下查找apk
    APK_PATH_APKPURE=$(find android/app/build/outputs/apk -name "*.apk" -path "*/release/*" | head -1)
    if [ -z "$APK_PATH_APKPURE" ]; then error "未找到 APKPure APK"; fi
    mv "$APK_PATH_APKPURE" "unpackage/dist/build/seseai_apkpure.apk" || error "移动 APKPure APK 失败"
    success "APKPure 版本 APK 处理完成 -> unpackage/dist/build/seseai_apkpure.apk"
else
    log "跳过 APKPure 版本打包。"
fi

# 3. 构建标准 APP 版本
log "Step 4/6: 准备构建标准 APP 资源..."
npm run build:app -- --source=APP || error "标准 APP 版本资源编译失败"

log "Step 5/6: 构建标准 APP APK..."
(cd android && ./gradlew clean && ./gradlew assembleRelease) || error "标准 APP APK 构建失败"

# 查找新生成的APK
APK_PATH_APP=$(find android/app/build/outputs/apk -name "*.apk" -path "*/release/*" | head -1)
if [ -z "$APK_PATH_APP" ]; then error "未找到标准 APP APK"; fi

# 暂时移动标准APK，以防被下一步清理掉
mv "$APK_PATH_APP" "unpackage/dist/build/seseai.apk.tmp" || error "暂存标准 APP APK 失败"
success "标准 APP 版本 APK 构建完成"

# 4. 构建 Web 版本并组合最终产物
log "Step 6/6: 构建 Web 版本并组合最终产物..."
npm run build || error "Web 构建失败"

# 将标准APK移入Web目录
mkdir -p unpackage/dist/build/web/static || error "创建 web/static 目录失败"
mv "unpackage/dist/build/seseai.apk.tmp" "unpackage/dist/build/web/static/seseai.apk" || error "移动标准 APK 到 Web 目录失败"

WEB_FOLDER_NAME="web_${BUILD_ENV}"
log "重命名 web 文件夹为 ${WEB_FOLDER_NAME}..."
mv unpackage/dist/build/web "unpackage/dist/build/${WEB_FOLDER_NAME}" || error "重命名 web 文件夹失败"
success "Web 文件夹已重命名为 ${WEB_FOLDER_NAME}"

log "创建 ${WEB_FOLDER_NAME}.zip..."
(cd unpackage/dist/build && zip -qr "${WEB_FOLDER_NAME}.zip" "${WEB_FOLDER_NAME}") || error "压缩 ${WEB_FOLDER_NAME} 失败"
success "${WEB_FOLDER_NAME}.zip 创建成功"

log "清空并复制 ${WEB_FOLDER_NAME} 内容到 script/docker/dist..."
mkdir -p script/docker/dist || error "创建 script/docker/dist 目录失败"
rm -rf script/docker/dist/* || error "清空 script/docker/dist 失败"
cp -r unpackage/dist/build/${WEB_FOLDER_NAME}/* script/docker/dist/ || error "复制 ${WEB_FOLDER_NAME} 内容到 script/docker/dist 失败"
success "Web 内容已复制到 script/docker/dist"

BUILD_DATE=$(date +%Y%m%d-%H%M)
log "执行 script/docker/build.sh ${BUILD_ENV}-${BUILD_DATE}..."
(cd script/docker && ./build.sh "${BUILD_ENV}-${BUILD_DATE}") || error "执行 script/docker/build.sh 失败"
success "script/docker/build.sh 执行成功"

success "打包完成！"
echo "文件位置:"
if [ "$NO_APKPURE" == "false" ]; then
    echo "  • seseai_apkpure.apk: $(pwd)/unpackage/dist/build/seseai_apkpure.apk"
fi
echo "  • ${WEB_FOLDER_NAME}.zip: $(pwd)/unpackage/dist/build/${WEB_FOLDER_NAME}.zip"
echo "  • web 内容已复制到: /Users/wl/project/docker/dist"
echo "  • docker 脚本已执行: build.sh ${BUILD_ENV}-${BUILD_DATE}"