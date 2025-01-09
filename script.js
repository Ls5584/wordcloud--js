// DOM元素
const textInput = document.getElementById('textInput');
const fileInput = document.getElementById('fileInput');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const saveBtn = document.getElementById('saveBtn');
const wordcloudContainer = document.getElementById('wordcloud');
const themeToggle = document.getElementById('themeToggle');
const wordStats = document.getElementById('wordStats');
const stopwordInput = document.getElementById('stopwordInput');
const addStopwordBtn = document.getElementById('addStopword');
const stopwordsList = document.getElementById('stopwordsList');

// 默认停用词
let stopwords = new Set([
    '的', '了', '和', '是', '就', '都', '而', '及', '与', '着',
    '之', '用', '于', '把', '等', '去', '又', '能', '好', '在',
    '还', '没', '要', '这', '那', '有', '我', '你', '他', '她',
    '它', '们', '个', '们', '为', '以', '很', '但', '吧', '啊',
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have',
    'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you',
    'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they',
    'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one',
    'all', 'would', 'there', 'their'
]);

// 主题切换
themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// 初始化主题
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// 文件上传处理
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const text = await file.text();
        textInput.value = text;
        processText(text);
    }
});

// 停用词管理
addStopwordBtn.addEventListener('click', () => {
    const word = stopwordInput.value.trim();
    if (word && !stopwords.has(word)) {
        stopwords.add(word);
        updateStopwordsList();
        stopwordInput.value = '';
        processText(textInput.value);
    }
});

function updateStopwordsList() {
    stopwordsList.innerHTML = '';
    [...stopwords].sort().forEach(word => {
        const tag = document.createElement('div');
        tag.className = 'stopword-tag';
        tag.innerHTML = `
            ${word}
            <button onclick="removeStopword('${word}')">&times;</button>
        `;
        stopwordsList.appendChild(tag);
    });
}

function removeStopword(word) {
    stopwords.delete(word);
    updateStopwordsList();
    processText(textInput.value);
}

// 文本处理
function processText(text) {
    if (!text) return;

    const words = text
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 1 && !stopwords.has(word));

    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // 更新词频统计
    updateWordStats(wordCount);

    // 生成词云数据
    const wordcloudData = Object.entries(wordCount)
        .map(([text, size]) => ({
            text,
            size: 10 + size * 10
        }));

    // 生成词云
    generateWordCloud(wordcloudData);
}

function updateWordStats(wordCount) {
    const sortedWords = Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    wordStats.innerHTML = sortedWords
        .map(([word, count]) => `
            <div class="word-stat-item">
                <span>${word}</span>
                <span>${count}</span>
            </div>
        `)
        .join('');
}

// 生成词云
function generateWordCloud(words) {
    wordcloudContainer.innerHTML = '';
    
    const width = wordcloudContainer.offsetWidth;
    const height = 400;

    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words)
        .padding(5)
        .rotate(() => (~~(Math.random() * 2) - 1) * 90)
        .fontSize(d => d.size)
        .on('end', draw);

    layout.start();

    function draw(words) {
        const svg = d3.select('#wordcloud')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width/2},${height/2})`);

        svg.selectAll('text')
            .data(words)
            .enter()
            .append('text')
            .style('font-size', d => `${d.size}px`)
            .style('font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI"')
            .style('fill', () => `hsl(${Math.random() * 360}, 70%, 50%)`)
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
            .text(d => d.text);
    }
}

// 保存图片
saveBtn.addEventListener('click', async () => {
    const canvas = await html2canvas(wordcloudContainer);
    const link = document.createElement('a');
    link.download = 'wordcloud.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
});

// 重置功能
resetBtn.addEventListener('click', () => {
    textInput.value = '';
    fileInput.value = '';
    wordcloudContainer.innerHTML = '';
    wordStats.innerHTML = '';
});

// 实时处理输入文本
textInput.addEventListener('input', debounce(() => {
    processText(textInput.value);
}, 500));

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 初始化停用词列表
updateStopwordsList(); 