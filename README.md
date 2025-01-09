# 词云生成器 (Word Cloud Generator)

这是一个现代化的词云生成工具，可以将输入的文本转换成美观的词云图片。支持深色/浅色主题切换，实时词频统计，以及自定义停用词管理。

## 功能特点

### 基础功能
- 支持文本直接输入或粘贴
- 支持文件上传（.txt格式）
- 一键生成词云图片
- 支持重置输入内容
- 简洁直观的用户界面

### 高级特性
- 深色/浅色主题切换
- 响应式布局，适配各种屏幕尺寸
- 实时词频统计（Top 10）
- 自定义停用词管理
- 词云图片导出（JPG格式）

## 使用方法

### 基本操作
1. 打开网页应用
2. 选择输入方式：
   - 直接在文本框中输入文字
   - 或点击"上传文件"按钮上传txt文件
3. 文本会自动处理并显示词频统计
4. 点击"生成词云"按钮生成词云图片
5. 可以点击"保存图片"将词云保存为JPG格式
6. 如需重新开始，点击"重置"按钮清空所有内容

### 主题切换
- 点击右上角的主题切换按钮
- 支持深色和浅色两种主题
- 主题选择会自动保存

### 停用词管理
1. 在"停用词管理"区域查看当前停用词列表
2. 添加新的停用词：
   - 在输入框中输入要过滤的词
   - 点击"添加"按钮
3. 删除停用词：
   - 点击停用词标签上的"×"按钮
4. 修改停用词后词云会自动更新

## 自动过滤规则

应用会自动过滤以下内容：
- 标点符号（中英文）
- 语气词（啊、哎、嗯等）
- 虚词（的、了、着等）
- 代词（这、那、什么等）
- 单个字符和纯数字

## 技术实现

- 使用原生HTML/CSS/JavaScript构建
- 使用d3-cloud库实现词云生成
- 响应式设计，支持各种设备访问
- 使用CSS变量实现主题切换
- 本地存储保存用户主题偏好

## 浏览器兼容性

- 支持所有现代浏览器
- 推荐使用最新版本的Chrome、Firefox、Safari或Edge
- 需要启用JavaScript 