/* eslint-disable @typescript-eslint/no-explicit-any */
// import PQueue from 'p-queue';
import { formatTime } from './util';
import { logger } from './logger';

/**
 * 通用请求封装
 */
export abstract class BaseCraw {
  insertCount = 0;

  updateCount = 0;

  status: 'idle' | 'error' | 'finished' = 'idle'; // 爬取状态(idle: 未开始，error：异常退出，finished：已完成)

  errors: any[] = []; // 错误列表

  startTime = 0;

  endTime = 0;

  // 请求限速
  // queue = new PQueue({ concurrency: 20, interval: 1000, intervalCap: 5 }); // 一秒内最多发起五个请求，最多有十个请求

  // 运行
  abstract run(): Promise<void>;

  // 开始
  async start() {
    logger.info('start...');

    // 记录开始时间
    this.startTime = Date.now();

    await this.run();

    // 记录结束时间
    this.endTime = Date.now();

    // 打印请求状态
    this.logStat();

    logger.info('\nover~');
  }

  // 打印请求状态
  logStat = async () => {
    const stat = (txt: string) => {
      logger.verbose(txt);
    };
    const endTime = Date.now();
    const cost = Math.ceil((endTime - this.startTime) / 1000); // s
    stat(`${formatTime(this.startTime)} - ${formatTime(endTime)}`);
    stat(`cost: ${cost}s (${(cost / 60).toFixed(2)}min)`);
    stat(`inserted: ${this.insertCount} items`);
    stat(`updated: ${this.updateCount} items`);
    stat(`total: ${this.insertCount + this.updateCount}`);
    stat(`error count: ${this.errors.length}`);
  };

  // 错误记录
  logError = (error: any, args: any[] = []) => {
    const message = error.message || error;
    logger.error(message + '\n' + JSON.stringify(args));
    this.errors.push(error);
  };

  // 错误处理
  withErrorHandler = <T extends (...args: any[]) => any>(func: T): T => {
    const resFun = async (...args: Parameters<T>) => {
      try {
        const res = await func(...args);
        return res;
      } catch (error) {
        this.logError(error);
        throw error;
      }
    };
    return resFun as T;
  };
}
