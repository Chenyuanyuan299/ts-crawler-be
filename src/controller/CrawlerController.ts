import fs from 'fs';
import path from 'path';
import 'reflect-metadata'; 
import { Request, Response, NextFunction } from 'express';
import { controller, get, use } from '../decorator';
import Crawler from '../utils/crawler';
import DellAnalyzer from '../utils/dellAnalyzer';
import { getResponseData } from '../utils/util';

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}

// 对访问所有操作的登录状态进行管理
const checkLogin = (req: Request, res: Response, next: NextFunction): void => {
  const isLogin = !!(req.session ? req.session.login : false);
  if(isLogin) {
    // 登录后才可以进行下一步操作
    next();
  } else {
    res.json(getResponseData(null, '请登录'));
  }
}

@controller('/api')
export class CrawlerController {
  @get('/getData')
  @use(checkLogin)
  getData(req: BodyRequest, res: Response): void {
    const secret = 'x3b174jsx'; // 此处是鉴权部分，secret 要写  Dell 老师给的
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = DellAnalyzer.getInstance();
    new Crawler(url, analyzer);
    res.json(getResponseData<responseResult.getData>(true));
  };

  @get('/showData')
  @use(checkLogin)
  showData(req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, '../../data/course.json');
      const result = fs.readFileSync(position, 'utf8');
      res.json(getResponseData<responseResult.showData>(JSON.parse(result)));
    } catch (e) {
      res.json(getResponseData<responseResult.showData>(false, '数据不存在'));
    }
  };
}