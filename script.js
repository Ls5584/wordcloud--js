// DOM元素
const textInput = document.getElementById('textInput');
const fileInput = document.getElementById('fileInput');
const generateBtn = document.getElementById('generateBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const resetBtn = document.getElementById('resetBtn');
const saveBtn = document.getElementById('saveBtn');
const wordcloudContainer = document.getElementById('wordcloud');
const themeToggle = document.getElementById('themeToggle');
const wordStats = document.getElementById('wordStats');
const stopwordInput = document.getElementById('stopwordInput');
const addStopwordBtn = document.getElementById('addStopword');
const stopwordsList = document.getElementById('stopwordsList');
const analysisSection = document.querySelector('.analysis-section');
const charCount = document.querySelector('.char-count');

// 文本限制
const MAX_CHARS = 10000;

// 默认停用词（不显示给用户）
const defaultStopwords = new Set([
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

// 用户自定义停用词
let customStopwords = new Set();

// 当前文本的词频数据
let currentWordCount = null;

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

// 文本输入监控
textInput.addEventListener('input', () => {
    const text = textInput.value;
    const length = text.length;
    charCount.textContent = `${length} / ${MAX_CHARS}`;
    
    if (length > MAX_CHARS) {
        textInput.value = text.slice(0, MAX_CHARS);
        charCount.textContent = `${MAX_CHARS} / ${MAX_CHARS}`;
    }
});

// 文件上传处理
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const text = await file.text();
        if (text.length > MAX_CHARS) {
            alert(`文件内容超过${MAX_CHARS}字符限制，将只保留前${MAX_CHARS}字符`);
            textInput.value = text.slice(0, MAX_CHARS);
        } else {
            textInput.value = text;
        }
        charCount.textContent = `${textInput.value.length} / ${MAX_CHARS}`;
    }
});

// 统计词频
analyzeBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (!text) {
        alert('请先输入文本或上传文件！');
        return;
    }
    
    currentWordCount = processText(text);
    updateWordStats(currentWordCount);
    analysisSection.style.display = 'block';
    analyzeBtn.classList.add('active');
});

// 停用词管理
addStopwordBtn.addEventListener('click', () => {
    const word = stopwordInput.value.trim();
    if (word && !customStopwords.has(word) && !defaultStopwords.has(word)) {
        customStopwords.add(word);
        updateStopwordsList();
        stopwordInput.value = '';
        if (currentWordCount) {
            currentWordCount = processText(textInput.value.trim());
            updateWordStats(currentWordCount);
        }
    }
});

function updateStopwordsList() {
    stopwordsList.innerHTML = '';
    [...customStopwords].sort().forEach(word => {
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
    customStopwords.delete(word);
    updateStopwordsList();
    if (currentWordCount) {
        currentWordCount = processText(textInput.value.trim());
        updateWordStats(currentWordCount);
    }
}

// 文本处理
function processText(text) {
    if (!text) return null;

    const words = text
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 1 && !defaultStopwords.has(word) && !customStopwords.has(word));

    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return wordCount;
}

function updateWordStats(wordCount) {
    if (!wordCount) return;

    const sortedWords = Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    wordStats.innerHTML = sortedWords
        .map(([word, count]) => `
            <div class="word-stat-item">
                <span class="word">${word}</span>
                <span class="count">${count} 次</span>
            </div>
        `)
        .join('');
}

// 生成词云
generateBtn.addEventListener('click', () => {
    if (!currentWordCount) {
        alert('请先点击"统计词频"按钮进行词频分析！');
        return;
    }

    const wordcloudData = Object.entries(currentWordCount)
        .sort((a, b) => b[1] - a[1])
        .map(([text, count]) => ({
            text,
            size: Math.max(12, Math.min(60, 20 + count * 5)),
            count
        }));

    generateWordCloud(wordcloudData);
    saveBtn.style.display = 'block';
});

function generateWordCloud(words) {
    wordcloudContainer.innerHTML = '';
    
    const width = wordcloudContainer.offsetWidth;
    const height = 400;

    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words)
        .padding(5)
        .rotate(() => 0)
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

        const maxCount = Math.max(...words.map(d => d.count));
        const colorScale = d3.scaleLinear()
            .domain([1, maxCount])
            .range(['#7ec2f3', '#0071e3']);

        svg.selectAll('text')
            .data(words)
            .enter()
            .append('text')
            .style('font-size', d => `${d.size}px`)
            .style('font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI"')
            .style('fill', d => colorScale(d.count))
            .style('font-weight', '500')
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${d.x},${d.y})`)
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
    currentWordCount = null;
    customStopwords.clear();
    updateStopwordsList();
    analysisSection.style.display = 'none';
    saveBtn.style.display = 'none';
    analyzeBtn.classList.remove('active');
    charCount.textContent = `0 / ${MAX_CHARS}`;
});

// 初始化
updateStopwordsList(); 