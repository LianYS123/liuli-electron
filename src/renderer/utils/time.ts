import {
  differenceInMinutes,
  differenceInSeconds,
  format,
  isThisYear,
  isToday,
  isYesterday,
} from 'date-fns';

export function commonDateFormat(
  date: string | number | unknown,
  formatStr: string
) {
  return date ? format(Number(date), formatStr) : '';
}

/**
 * 联系人列表时间显示规则
 * · 今天内，显示“时:分”，例如：10:20
 * · 前一天消息，显示“昨天”
 * · 前一天以前，显示“月-日”，例如：07-10
 * · 非本年消息，显示“年-月-日”，例如：2021-07-10
 */
export function formatDateTime(time: string | number | Date) {
  const t = new Date(time);
  let f;
  if (isToday(t)) {
    f = 'HH:mm';
  } else if (isYesterday(t)) {
    return '昨天';
  } else if (isThisYear(t)) {
    f = 'MM-dd';
  } else {
    f = 'yyyy-MM-dd';
  }
  return format(t, f);
}
/**
 * 消息气泡 hover 时间显示规则
 * · 今天内，显示“时:分”，例如：10:20
 * · 前一天以前，显示“x月x日 时:分”，例如：07月10日 10:20
 * · 非本年消息，显示“xxxx年xx月xx日 时:分”，例如：2021年07月10日 10:20
 */

export function formatTimeTitle(time: string | number | Date) {
  const t = new Date(time);
  let f;
  if (isToday(t)) {
    f = 'HH:mm';
  } else if (isThisYear(t)) {
    f = 'MM月dd日 hh:ss';
  } else {
    f = 'yyyy年MM月dd日 hh:ss';
  }
  return format(t, f);
}

/**
 * 聊天框内时间显示规则（超出1h显示，1h内为一组消息）
 * 60s以内，显示“刚刚”
 * 1min~1h以内，显示“xx分钟前”，例如：16分钟前
 * 1h~当天0点，显示“时:分”，例如：10:20
 * 昨天24h内，显示“昨天 时:分”，例如：昨天 10:20
 * 昨天0点以后，显示“xx月xx日 时:分”，例如：07月10日 12:20
 * 非本年消息，显示“xxxx年xx月xx日 时:分”，例如：2021年07月10日 12:20
 */
export function formatTimeDetail(time: string | number | Date) {
  const t = new Date(time);
  let f;
  if (differenceInSeconds(new Date(), t) < 60) {
    return '刚刚';
  }
  if (differenceInMinutes(new Date(), t) < 60) {
    const diff = differenceInMinutes(new Date(), t);
    return `${diff} 分钟前`;
  }
  if (isToday(t)) {
    f = 'HH:mm';
  } else if (isYesterday(t)) {
    return `昨天 ${format(t, 'HH:hh')}`;
  } else if (isThisYear(t)) {
    f = 'MM月dd日 HH:mm';
  } else {
    f = 'yyyy年MM月dd日 HH:mm';
  }
  return format(t, f);
}
