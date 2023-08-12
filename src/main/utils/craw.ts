import { formatTime } from './util';
import { logger } from './logger';
import PQueue from "p-queue";

/**
 * 通用请求封装
 */
export abstract class BaseCraw {
  protected insertCount = 0;
  protected updateCount = 0;
  protected startTime = 0;
  protected endTime = 0;
  protected errors: any[] = []; // 错误列表

  protected readonly queue = new PQueue({
    concurrency: 5,
    interval: 1000,
    intervalCap: 3
  });

  constructor() {
    this.queue.addListener('idle', () => {
      console.log('Craw Query Idle')
      this.endTime = Date.now()
      this.logStat()
    })
  }

  protected resetStat = () => {
    this.insertCount = 0
    this.updateCount = 0
    this.errors = []
    this.startTime = Date.now();
    this.endTime = 0
  }

  public pending = () => {
    return this.queue.pending
  }

  public stat = () => {
    const { insertCount, updateCount, startTime, errors, endTime } = this
    // const endTime = Date.now();
    // const cost = Math.ceil((endTime - this.startTime) / 1000); // s
    return {
      pending: this.pending(),
      startTime,
      endTime,
      insertCount,
      updateCount,
      errors: errors.length,
    }
  }

  // 打印请求状态
  protected logStat = () => {
    const stat = (txt: string) => {
      logger.info(txt);
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
  protected logError = (error: any, args: any[] = []) => {
    const message = error.message || error;
    logger.error(message + '\n' + JSON.stringify(args));
    this.errors.push(error);
  };

  // 错误处理
  protected withErrorHandler = <T extends (...args: any[]) => any>(func: T): T => {
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
