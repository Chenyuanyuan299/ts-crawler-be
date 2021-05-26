import express from 'express';
import cookieSession from 'cookie-session';
import './controller/LoginController';
import './controller/CrawlerController';
import router from './router';

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: 'session', // Cookie的名称
    keys: ['teacher Wang'], // 用于签名和验证Cookie值的键列表
    maxAge: 24 * 60 * 60 * 1000 // 有效时间
  })
)
app.use(router);

app.listen(7001, () => {
  console.log('server is running');
})