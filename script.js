// DOM元素
const textInput = document.getElementById('textInput');
const fileInput = document.getElementById('fileInput');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const wordcloudContainer = document.getElementById('wordcloud');

// 文件上传处理
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const text = await file.text();
        textInput.value = text;
    }
});

// 重置功能
resetBtn.addEventListener('click', () => {
    textInput.value = '';
    fileInput.value = '';
    wordcloudContainer.innerHTML = '';
});

// 生成词云
generateBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (!text) {
        alert('请输入文本或上传文件！');
        return;
    }

    // 清空现有词云
    wordcloudContainer.innerHTML = '';

    // 分词并统计词频
    const words = text
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 1);

    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // 转换为词云数据格式
    const wordcloudData = Object.entries(wordCount).map(([text, size]) => ({
        text,
        size: 10 + size * 10 // 根据词频调整字体大小
    }));

    // 设置词云布局
    const width = wordcloudContainer.offsetWidth;
    const height = 400;

    const layout = d3.layout.cloud()
        .size([width, height])
        .words(wordcloudData)
        .padding(5)
        .rotate(() => (~~(Math.random() * 2) - 1) * 90)
        .fontSize(d => d.size)
        .on('end', draw);

    layout.start();

    // 绘制词云
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
}); 