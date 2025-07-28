import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const formatTime = (time) => {
  return dayjs(time)
    .fromNow()
    .replace(/\bminutes?\b/, 'min')
    .replace(/\bhours?\b/, 'h')
    .replace(/\bdays?\b/, 'd')
    .replace(/\bmonths?\b/, 'mon')
    .replace(/\byears?\b/, 'y')
    .replace(/\s+/g, '')
    .replace('ago', '');
};
