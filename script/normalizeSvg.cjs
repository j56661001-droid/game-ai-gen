const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');


const PRECISION_THRESHOLD = 1e-10; 


function createIdentityMatrix() { return [1, 0, 0, 1, 0, 0]; }
function matrixMultiply(m1, m2) { const [a1, b1, c1, d1, e1, f1] = m1; const [a2, b2, c2, d2, e2, f2] = m2; return [a1 * a2 + c1 * b2, b1 * a2 + d1 * b2, a1 * c2 + c1 * d2, b1 * c2 + d1 * d2, a1 * e2 + c1 * f2 + e1, b1 * e2 + d1 * f2 + f1]; }
function parseTransform(transformStr) { if (!transformStr) return []; const transforms = []; const regex = /(\w+)\s*\(([^)]+)\)/g; let match; while ((match = regex.exec(transformStr)) !== null) { const type = match[1].trim(); const values = match[2].split(/[,\s]+/).map(s => s.trim()).filter(Boolean).map(parseFloat); if (values.every(v => !isNaN(v))) { transforms.push({ type, values }); } } return transforms; }
function transformsToMatrix(transforms) {
    let finalMatrix = createIdentityMatrix();
    for (const transform of transforms) {
        let matrix = createIdentityMatrix();
        const v = transform.values;
        switch (transform.type) {
            case 'translate': matrix[4] = v[0] || 0; matrix[5] = v[1] || 0; break;
            case 'scale': matrix[0] = v[0] || 1; matrix[3] = v[1] || v[0] || 1; break;
            case 'rotate': const angle = (v[0] || 0) * (Math.PI / 180); const cos = Math.cos(angle); const sin = Math.sin(angle); const x = v[1] || 0; const y = v[2] || 0; if (x !== 0 || y !== 0) { const t1 = [1, 0, 0, 1, x, y]; const r = [cos, sin, -sin, cos, 0, 0]; const t2 = [1, 0, 0, 1, -x, -y]; matrix = matrixMultiply(t1, matrixMultiply(r, t2)); } else { matrix = [cos, sin, -sin, cos, 0, 0]; } break;
            case 'matrix': matrix = [...v]; break;
        }
        finalMatrix = matrixMultiply(finalMatrix, matrix);
    }
    return finalMatrix;
}

/** 
 * 【优化 2 & 1】将矩阵转换为 transform 字符串。
 * - 增加精度阈值处理，将极小值视为0。
 * - 返回 null 如果是单位矩阵。
 */
function matrixToTransformString(matrix) {
    const format = (n) => (Math.abs(n) < PRECISION_THRESHOLD ? 0 : parseFloat(n.toPrecision(12)));
    const formattedMatrix = matrix.map(format);

    
    const identity = createIdentityMatrix();
    const isIdentity = formattedMatrix.every((val, i) => val == identity[i]);
    if (isIdentity) {
        return null; 
    }

    return `matrix(${formattedMatrix.join(' ')})`;
}

/**
 * 辅助函数：将 transform 属性设置到元素上，如果 transform 无效（如单位矩阵），则移除该属性
 * @param {Cheerio<Element>} $element 
 * @param {string | null} transformString 
 */
function setOrRemoveTransform($element, transformString) {
    if (transformString) {
        $element.attr('transform', transformString);
    } else {
        $element.removeAttr('transform');
    }
}



/**
 * Processes SVG content to flatten a global transform group into descendant elements
 * that have large translation offsets. This version robustly checks the final
 * translation component of an element's combined local transforms.
 *
 * @param {string} svgContent The raw SVG string content.
 * @returns {string} The processed SVG string content.
 *
 * Assumes the following helper functions are defined elsewhere:
 * - cheerio.load: from the 'cheerio' library.
 * - parseTransform(string): Parses a transform attribute string into an array of transform objects.
 * - transformsToMatrix(Array): Converts an array of transform objects to a single 3x2 SVG matrix.
 * - matrixMultiply(m1, m2): Multiplies two 3x2 matrices.
 * - matrixToTransformString(Matrix): Converts a 3x2 matrix back to a "matrix(...)" string.
 * - setOrRemoveTransform(cheerioElement, transformString): Sets the transform or removes it if it's an identity matrix.
 * - postProcessPaths($): A function for further path optimizations.
 */
function processSvgContent(svgContent) {
    const $ = cheerio.load(svgContent, { xmlMode: true, selfClosingTags: true });

    // 移除所有颜色相关的属性和样式
    $('*').each(function() {
        const $el = $(this);
        // 移除 fill, stroke, color 属性
        $el.removeAttr('fill');
        $el.removeAttr('stroke');
        $el.removeAttr('color');

        // 检查并处理内联 style 属性
        const style = $el.attr('style');
        if (style) {
            // 通过正则表达式移除颜色相关的样式
            let newStyle = style
                .replace(/fill:\s*[^;]+;?/g, '')
                .replace(/stroke:\s*[^;]+;?/g, '')
                .replace(/color:\s*[^;]+;?/g, '')
                .trim();
            
            // 如果样式属性变空，则移除该属性
            if (newStyle) {
                $el.attr('style', newStyle);
            } else {
                $el.removeAttr('style');
            }
        }
    });

    // 清理 <style> 标签
    $('style').each(function() {
        const $style = $(this);
        let cssText = $style.html() || '';

        // 移除 CSS 规则中的颜色定义
        cssText = cssText
            .replace(/fill:\s*[^;}]+/g, '')
            .replace(/stroke:\s*[^;}]+/g, '')
            .replace(/color:\s*[^;}]+/g, '');

        // 清理可能变为空的样式块，例如 .a { }
        cssText = cssText.replace(/([^{]*)\{\s*\}/g, '');

        // 如果 <style> 标签内容为空，则移除该标签
        if (cssText.trim()) {
            $style.html(cssText);
        } else {
            $style.remove();
        }
    });

    // 1. 查找所有 <clipPath> 元素并获取它们的 ID
    const $clipPaths = $('defs clipPath');
    const clipPathIds = $clipPaths
        .map((i, el) => $(el).attr('id'))
        .get() // 将 Cheerio 对象转换为普通数组
        .filter(Boolean); // 确保 ID 存在，过滤掉 undefined 或空字符串

    // 2. 如果找到了带 ID 的 clipPath，则开始清理 <style> 标签
    if (clipPathIds.length > 0) {
        $('style').each((_, styleEl) => {
            const $style = $(styleEl);
            let cssText = $style.html(); // 获取 <style> 标签内的文本内容

            // 3. 遍历所有找到的 clipPath ID
            for (const id of clipPathIds) {
                // 构建正则表达式来匹配 "clip-path: url(#id);" 这样的 CSS 属性。
                //  - `\s*` 匹配任意数量的空格
                //  - `\\(` 和 `\\)` 匹配括号
                //  - `;?` 匹配一个可选的分号
                //  - 'g' 标志表示全局匹配，以防一个 ID 在多处被引用
                const ruleRegex = new RegExp(`clip-path:\\s*url\\(\\s*#${id}\\s*\\);?`, 'g');
                
                // 4. 从 CSS 文本中移除匹配的规则
                cssText = cssText.replace(ruleRegex, '');
            }

            // 5. 将清理后的 CSS 内容写回到 <style> 标签
            // 如果一个样式块（如 .c{...}）因此变空，它可能会留下空的 .c{}。这通常是无害的。
            $style.html(cssText);
        });
    }

    // 6. 最后，移除 <clipPath> 元素本身
    $clipPaths.remove();

    
    const $svg = $('svg');
    let maxWH = 1000; 

    const viewBox = $svg.attr('viewBox');
    if (viewBox) {
        const parts = viewBox.split(/[,\s]+/).map(parseFloat);
        if (parts.length == 4) {
            maxWH = Math.max(parts[2], parts[3]);
        }
    } else {
        const width = parseFloat($svg.attr('width'));
        const height = parseFloat($svg.attr('height'));
        if (!isNaN(width) && !isNaN(height)) {
            maxWH = Math.max(width, height);
        }
    }

    const threshold = maxWH * 2;

    
    const $worldFixGroup = $('svg > g[transform]').first();
    if ($worldFixGroup.length) {
        const worldFixMatrix = transformsToMatrix(parseTransform($worldFixGroup.attr('transform')));

        const recursiveApplyTransform = ($element, matrixToApply) => {
            const transformStr = $element.attr('transform') || '';

            
            if (!transformStr) {
                $element.children().each((_, child) => {
                    recursiveApplyTransform($(child), matrixToApply);
                });
                return; 
            }

            
            
            const localTransforms = parseTransform(transformStr);
            const localMatrix = transformsToMatrix(localTransforms);

            
            
            const hasLargeOffset = Math.abs(localMatrix[4]) > threshold || Math.abs(localMatrix[5]) > threshold;

            if (hasLargeOffset) {
                
                const newMatrix = matrixMultiply(matrixToApply, localMatrix);
                setOrRemoveTransform($element, matrixToTransformString(newMatrix));
            } else {
                
                
                $element.children().each((_, child) => {
                    recursiveApplyTransform($(child), matrixToApply);
                });
            }
        };
        if (Math.abs(worldFixMatrix[4]) > threshold || Math.abs(worldFixMatrix[5]) > threshold) {
            
            $worldFixGroup.children().each((_, child) => {
                recursiveApplyTransform($(child), worldFixMatrix);
            });
            
            $worldFixGroup.removeAttr('transform');
        }



    }

    
    
    
    postProcessPaths($);

    return $.xml();
}
/**
 * 【优化 3】后处理函数，用于将大偏移量 path 的 translate 合并到 'd' 属性中
 * 此版本重构了路径数据(d)的处理方式，以解决原版正则表达式的缺陷。
 * @param {CheerioAPI} $
 */
function postProcessPaths($) {
    const $svg = $('svg');
    let maxWH = 1000; 

    const viewBox = $svg.attr('viewBox');
    if (viewBox) {
        const parts = viewBox.split(/[,\s]+/).map(parseFloat);
        if (parts.length == 4) {
            maxWH = Math.max(parts[2], parts[3]);
        }
    } else {
        const width = parseFloat($svg.attr('width'));
        const height = parseFloat($svg.attr('height'));
        if (!isNaN(width) && !isNaN(height)) {
            maxWH = Math.max(width, height);
        }
    }

    
    const threshold = maxWH * 2;

    $('path[transform]').each((_, el) => {
        const $path = $(el);
        const d = $path.attr('d');
        const transformAttr = $path.attr('transform');

        if (!d || !d.trim() || !transformAttr) {
            return;
        }

        const transforms = parseTransform(transformAttr);
        const matrix = transformsToMatrix(transforms);
        const [a, b, c, d_m, tx, ty] = matrix;

        
        const isPrimarilyTranslate =
            Math.abs(a - 1) < PRECISION_THRESHOLD &&
            Math.abs(b) < PRECISION_THRESHOLD &&
            Math.abs(c) < PRECISION_THRESHOLD &&
            Math.abs(d_m - 1) < PRECISION_THRESHOLD;

        
        if (isPrimarilyTranslate && (Math.abs(tx) > threshold || Math.abs(ty) > threshold)) {
            const newD = applyTranslateToPathData(d, tx, ty);
            if (newD) {
                $path.attr('d', newD);
                $path.removeAttr('transform');
            }
        }
    });
}


/**
 * 辅助函数：将平移变换(tx, ty)应用到SVG路径数据(d)上。
 * 它会解析路径数据，只修改绝对坐标命令，并重新组装成新的路径字符串。
 * 
 * @param {string} dString 原始的 'd' 属性字符串
 * @param {number} tx X轴平移量
 * @param {number} ty Y轴平移量
 * @returns {string | null} 返回新的 'd' 属性字符串，如果解析失败则返回 null
 */
function applyTranslateToPathData(dString, tx, ty) {
    if (!dString || (tx == 0 && ty == 0)) {
        return dString;
    }

    
    const commandRegex = /([A-Za-z])([^A-Za-z]*)/g;

    
    
    const numberRegex = /-?\d*\.?\d+(?:[eE][+-]?\d+)?/g;

    const newPathParts = [];
    let match;

    try {
        
        commandRegex.lastIndex = 0;
        while ((match = commandRegex.exec(dString)) !== null) {
            let command = match[1];
            const paramString = (match[2] || '').trim();

            
            const paramStrings = paramString.match(numberRegex) || [];
            let params = paramStrings.map(parseFloat);

            
            if (params.some(isNaN)) {
                console.warn(`路径命令 '${command}' 的参数解析失败，含有 NaN: "${paramString}"`);
                
                return null;
            }

            const absoluteCommands = 'MLHVCSTQA';
            if (absoluteCommands.includes(command)) {
                
                switch (command) {
                    case 'M': 
                    case 'L': 
                    case 'T': 
                        for (let i = 0; i < params.length; i += 2) {
                            params[i] += tx;
                            params[i + 1] += ty;
                        }
                        break;
                    case 'H': 
                        for (let i = 0; i < params.length; i++) {
                            params[i] += tx;
                        }
                        break;
                    case 'V': 
                        for (let i = 0; i < params.length; i++) {
                            params[i] += ty;
                        }
                        break;
                    case 'C': 
                    case 'S': 
                    case 'Q': 
                        for (let i = 0; i < params.length; i += 2) {
                            params[i] += tx;
                            params[i + 1] += ty;
                        }
                        break;
                    case 'A': 
                        for (let i = 0; i < params.length; i += 7) {
                            if (params.length >= i + 7) {
                                params[i + 5] += tx;
                                params[i + 6] += ty;
                            }
                        }
                        break;
                }
            }

            
            const formattedParams = params.map(p => parseFloat(p.toPrecision(12)));
            newPathParts.push(command + ' ' + formattedParams.join(' '));
        }

        if (newPathParts.length == 0 && dString.trim().length > 0) {
            console.warn(`无法解析路径数据: "${dString.substring(0, 50)}..."`);
            return null;
        }

        return newPathParts.join(' ').trim();

    } catch (error) {
        console.error(`在处理路径数据时发生严重错误: d="${dString.substring(0, 50)}..."`, error);
        return null;
    }
}


/** 批量处理SVG文件夹 (无变化) */
async function batchProcessSvg(inputDir, outputDir) {
    try {
        await fs.mkdir(outputDir, { recursive: true });
        const files = await fs.readdir(inputDir);
        const svgFiles = files.filter(file => file.toLowerCase().endsWith('.svg'));
        if (svgFiles.length == 0) { console.log(`在目录 ${inputDir} 中未找到SVG文件。`); return; }
        for (const file of svgFiles) {
            const inputPath = path.join(inputDir, file);
            const outputPath = path.join(outputDir, file);
            try {
                const svgContent = await fs.readFile(inputPath, 'utf8');
                const processedContent = processSvgContent(svgContent);
                await fs.writeFile(outputPath, processedContent, 'utf8');
            } catch (error) { console.error(`处理文件 ${file} 时出错:`, error); }
        }
    } catch (error) {
        if (error.code == 'ENOENT') { console.error(`错误: 输入目录不存在 -> ${inputDir}`); }
        else { console.error('批量处理SVG时出错:', error); }
    }
}


if (require.main == module) {
    // These paths are for standalone execution of this script.
    // The main workflow uses `generateIconFont.cjs` which passes paths directly.
    const INPUT_FOLDER = './svg_origin';
    const OUTPUT_FOLDER = './svg_normalized';
    const currentDir = __dirname;
    const inputDir = path.resolve(currentDir, INPUT_FOLDER);
    const outputDir = path.resolve(currentDir, OUTPUT_FOLDER);

    batchProcessSvg(inputDir, outputDir);
}

module.exports = {
    batchProcessSvg,
    processSvgContent
};
