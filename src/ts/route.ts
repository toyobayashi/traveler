export default {
  CAPTCHA_IMAGE: () => `/passport/captcha/captcha-image?login_site=E&module=login&rand=sjrand&${Math.random()}`,
  CAPTCHA_CHECK: '/passport/captcha/captcha-check',
  LOGIN: '/passport/web/login',
  AUTH_UAMTK: '/passport/web/auth/uamtk',
  AUTH_CLIENT: '/otn/uamauthclient',
  LOGOUT: '/otn/login/loginOut',
  GET_PASSENGER: '/otn/confirmPassenger/getPassengerDTOs'
}
