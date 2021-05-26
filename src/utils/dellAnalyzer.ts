import cheerio from 'cheerio';
import fs from 'fs';
import { Analyzer } from './crawler';

interface Course {
  title: string;
  count: number
}

interface courseResult {
  time: number;
  data: Course[]
}

interface Content {
  [propName: number]: Course[]; // 时间戳：{ 标题：人数 }
}

export default class DellAnalyzer implements Analyzer {
	private static instance: DellAnalyzer;
	static getInstance() { // 该方法直接挂在类上面
		if(!this.instance) { 
			this.instance = new DellAnalyzer()
		}
		return this.instance;
	}

	private getCourseInfo(html: string) {
		const $ = cheerio.load(html); // 解析 html
		const courseItems = $('.course-item'); // 选择器，获取对应类中的数据
		const courseInfos: Course[] = [];

		courseItems.map((index, element) => { // 解析数据
			const descs = $(element).find('.course-desc'); // 进一步选择数据
			const title = descs.eq(0).text(); // 使用eq进行精确选择
			const count = parseInt(descs.eq(1).text().split('：')[1], 10);
			courseInfos.push({ title, count });
		});

		return { // 返回封装结果
			time: new Date().getTime(), // 获取当前时间对应人数
			data: courseInfos
		};
	}

	private generateJsonContent(result: courseResult, filePath: string) {
    let fileContent: Content = {}; // 初始化内容
    if (fs.existsSync(filePath)) { // 判断文件是否存在，如果存在就取出到 fileContent 中
      if(fs.readFileSync(filePath, 'utf-8') != '') {
				fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
			};		
    }
    fileContent[result.time] = result.data; // 将新的数据存入 fileContent
    return fileContent;
  }

	public analyze(html: string, filePath: string) {
		const result = this.getCourseInfo(html);
		const fileContent = this.generateJsonContent(result, filePath);
		return JSON.stringify(fileContent);
	}

	private constructor() {}
}