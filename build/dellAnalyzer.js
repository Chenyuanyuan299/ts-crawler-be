"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var fs_1 = __importDefault(require("fs"));
var DellAnalyzer = /** @class */ (function () {
    function DellAnalyzer() {
    }
    DellAnalyzer.getInstance = function () {
        if (!this.instance) {
            this.instance = new DellAnalyzer();
        }
        return this.instance;
    };
    DellAnalyzer.prototype.getCourseInfo = function (html) {
        var $ = cheerio_1.default.load(html); // 解析 html
        var courseItems = $('.course-item'); // 选择器，获取对应类中的数据
        var courseInfos = [];
        courseItems.map(function (index, element) {
            var descs = $(element).find('.course-desc'); // 进一步选择数据
            var title = descs.eq(0).text(); // 使用eq进行精确选择
            var count = parseInt(descs.eq(1).text().split('：')[1], 10);
            courseInfos.push({ title: title, count: count });
        });
        return {
            time: new Date().getTime(),
            data: courseInfos
        };
    };
    DellAnalyzer.prototype.generateJsonContent = function (result, filePath) {
        var fileContent = {}; // 初始化内容
        if (fs_1.default.existsSync(filePath)) { // 判断文件是否存在，如果存在就取出到 fileContent 中
            if (fs_1.default.readFileSync(filePath, 'utf-8') != '') {
                fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
            }
            ;
        }
        fileContent[result.time] = result.data; // 将新的数据存入 fileContent
        return fileContent;
    };
    DellAnalyzer.prototype.analyze = function (html, filePath) {
        var result = this.getCourseInfo(html);
        var fileContent = this.generateJsonContent(result, filePath);
        return JSON.stringify(fileContent);
    };
    return DellAnalyzer;
}());
exports.default = DellAnalyzer;
