const { generateFonts } = require('fantasticon');
const fs = require('fs').promises;
const path = require('path');
const { batchProcessSvg } = require('./normalizeSvg.cjs');

// --- 配置 ---
// 原始SVG图标的输入目录
const INPUT_SVG_ORIGIN_DIR = path.resolve(__dirname, './svg_origin');
// 经过 normalizeSvg.cjs 清理后的SVG输出目录 (也将作为字体生成器的输入)
const NORMALIZED_SVG_DIR = path.resolve(__dirname, './svg_normalized');
// 最终字体文件和元数据的输出目录
const OUTPUT_FONT_DIR = path.resolve(__dirname, '../static/fonts');
// UTS 类型定义文件的输出路径
const OUTPUT_UTS_FILE = path.resolve(__dirname, '../common/iconfont.uts');
// 字体文件的基础名称
const FONT_NAME = 'iconfont';
// --- 配置结束 ---


/**
 * 从 fantasticon 生成的 codepoints.json 生成 iconfont.uts 文件
 * (按照项目现有格式)
 */
async function generateUtsFile(codepoints) {
    console.log('Step 3: Generating iconfont.uts file (matching project format)...');

    // 按照原始文件要求，对 key (图标名) 进行字母排序
    const iconNames = Object.keys(codepoints).sort();

    // 构建 IconFontMap 对象的条目
    const objectEntries = iconNames.map(name => {
        const codepoint = codepoints[name];
        // 将十进制码点转换为 \uXXXX 格式的字符串
        const unicodeEscape = '\\u' + codepoint.toString(16);
        // 格式化为 `  key: '\uXXXX'`
        return `  ${name}: '${unicodeEscape}'`;
    }).join(',\n');

    // 组合最终的文件内容
    const utsContent = `// 定义 IconFontMap，将图标类名映射到其 Unicode 值\n// 请按照key首字母排序\nexport const IconFontMap = {\n${objectEntries}\n};\n`;

    await fs.writeFile(OUTPUT_UTS_FILE, utsContent, 'utf8');
    console.log(`✅ Successfully created: ${OUTPUT_UTS_FILE}`);
}


/**
 * 主执行函数
 */
async function main() {
    try {
        console.log('🚀 Starting icon font generation process...');

        // 确保输出目录存在
        // 在生成前清空标准化SVG目录
        await fs.rm(NORMALIZED_SVG_DIR, { recursive: true, force: true });
        await fs.mkdir(NORMALIZED_SVG_DIR, { recursive: true });
        await fs.mkdir(OUTPUT_FONT_DIR, { recursive: true });

        // --- 步骤 1: 运行SVG标准化脚本 ---
        console.log('Step 1: Normalizing SVG files...');
        await batchProcessSvg(INPUT_SVG_ORIGIN_DIR, NORMALIZED_SVG_DIR);
        console.log(`✅ SVG normalization complete. Output in: ${NORMALIZED_SVG_DIR}`);

        // --- 步骤 2: 从标准化的SVG生成字体文件 ---
        console.log('Step 2: Generating TTF font from normalized SVGs...');
        const result = await generateFonts({
            inputDir: NORMALIZED_SVG_DIR,
            outputDir: OUTPUT_FONT_DIR,
            name: FONT_NAME,
            fontTypes: ['ttf'], // 只生成 ttf
            assetTypes: [], // 不生成 css, html 等资文件
            normalize: true, // 使用 fantasticon 的标准化来确保一致性
            fontHeight: 1000, // 字体高度
            descent: 150, // 设置下降基线，改善对齐
        });
        
        console.log(`✅ Font file generated: ${result.writeResults[0].path}`);

        // --- 步骤 3: 生成 UTS 文件 ---
        // fantasticon 的结果中直接包含了 codepoints
        await generateUtsFile(result.codepoints);

        // --- 步骤 4: 清理临时的标准化SVG目录 ---
        // console.log('Step 4: Cleaning up temporary files...');
        // await fs.rm(NORMALIZED_SVG_DIR, { recursive: true, force: true });
        // console.log(`✅ Temporary directory removed: ${NORMALIZED_SVG_DIR}`);


        console.log('\n🎉 Icon font generation process completed successfully!');

    } catch (error) {
        console.error('❌ An error occurred during the icon font generation process:', error);
        // 如果出错，也尝试清理临时目录
        try {
            await fs.rm(NORMALIZED_SVG_DIR, { recursive: true, force: true });
        } catch (cleanupError) {
            // ignore
        }
        process.exit(1);
    }
}

main();