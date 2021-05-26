import fs from 'fs';
import path from 'path';
import superagent from 'superagent';

export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

class Crawler {
  private filePath = path.resolve(__dirname, '../../data/course.json'); // 爬到的数据存储地

  private async getRawHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  }
  // 将 fileContent 转为字符串并写入对应路径下的文件
  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content); 
  }

  private async initSpiderProcess() {
    const html = await this.getRawHtml();
    const fileContent = this.analyzer.analyze(html, this.filePath);
    this.writeFile(fileContent);
  }

  constructor(private url: string, private analyzer: Analyzer) {
    this.initSpiderProcess();
  }
}
export default Crawler;



