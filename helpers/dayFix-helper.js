const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

require('dayjs/locale/zh-tw')
dayjs.extend(relativeTime)
dayjs.locale('zh-tw')
dayjs.extend(utc)
dayjs.extend(timezone)

module.exports = {
  switchTime: dateTime => dayjs(dateTime).tz('Asia/Taipei').format('A hh:mm ． YYYY年MM月DD日')
}
