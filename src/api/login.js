import ApiService from "../core/services/request";

// 获取验证码
export function getCodeImg() {
  return ApiService({
    url: '/prod-api/captchaImage',
    method: 'get',
  })
}
