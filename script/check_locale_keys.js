const fs = require('fs');
const path = require('path');

const localeDir = './locale';
const languages = ['en', 'hi', 'jp', 'zh-hans', 'zh-hant', 'pt-br', 'pt-pt'];

/**
 * 递归获取对象所有扁平化的 key
 */
function getKeys(obj, prefix = '') {
  let keys = new Set();
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      getKeys(obj[key], fullKey).forEach(k => keys.add(k));
    } else {
      keys.add(fullKey);
    }
  }
  return keys;
}

async function checkLocaleKeys() {
  const allLanguageKeys = {};

  // 1. 读取所有文件并提取 Keys
  for (const lang of languages) {
    const filePath = path.join(localeDir, `${lang}.uts`);
    try {
      const fileContent = await fs.promises.readFile(filePath, 'utf8');
      
      // 移除 import 语句以防止 eval 报错
      // 注意：这里的正则匹配原本的 apiError import，如果文件有其他 import 可能需要调整
      const cleanedContent = fileContent.replace(/import apiError from "\.\/api-error\/(.*?)\.uts";/, '');
      
      // 提取 export default 的对象部分
      const match = cleanedContent.match(/export default\s*({[\s\S]*?});/);
      
      if (match && match[1]) {
        // 定义 eval 上下文中需要的变量 mock
        const apiError = {}; 
        
        // 使用 eval 解析对象 (注意安全风险，仅限本地受信任代码使用)
        const obj = eval(`(${match[1]})`); 
        allLanguageKeys[lang] = getKeys(obj);
      } else {
        console.warn(`⚠️  Could not extract default export from ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Error reading or parsing ${filePath}:`, error);
    }
  }

  // 2. 构建所有可能的 Keys 的集合 (并集)
  const allKeys = new Set();
  for (const lang in allLanguageKeys) {
    allLanguageKeys[lang].forEach(key => allKeys.add(key));
  }

  // 3. 按文件检查缺失的 Keys
  let hasMisalignment = false;
  console.log(`\n🔍 Checking locale keys alignment across [${languages.join(', ')}]...\n`);

  for (const lang of languages) {
    const currentLangKeys = allLanguageKeys[lang];
    
    // 如果文件没解析成功，跳过
    if (!currentLangKeys) continue;

    const missingKeys = [];

    // 对比总集，找出当前语言缺失的 key
    for (const key of allKeys) {
      if (!currentLangKeys.has(key)) {
        missingKeys.push(key);
      }
    }

    // 4. 输出结果
    if (missingKeys.length > 0) {
      hasMisalignment = true;
      console.log(`------------------------------------------------------------`);
      console.log(`📁 File: ${lang}.uts (Missing ${missingKeys.length} keys)`);
      console.log(`------------------------------------------------------------`);
      missingKeys.forEach(key => {
        console.log(`  - ${key}`);
      });
      console.log(''); // 空行分隔
    } else {
        // 如果想看哪些文件是完美的，可以取消下面这行的注释
        // console.log(`✅ ${lang}.uts is perfect.\n`);
    }
  }

  // 5. 最终总结
  if (!hasMisalignment) {
    console.log('🎉 Success: All locale keys are aligned across all languages.');
  } else {
    console.log('⚠️  Finished. Please fix the missing keys above.');
  }
}

checkLocaleKeys();