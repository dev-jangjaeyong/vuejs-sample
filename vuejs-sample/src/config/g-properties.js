/**
 * httpUtils
 *
 * @author jyjang, JangJaeYoung (jyjang0054@gmail.com)
 */
/**
 * axios default 설정 정의
 * @type {AxiosInstance}
 */
class GProperties {
  // constructor() {}
  static API_URL = (process.env.NODE_ENV !== 'production') ? 'http://localhost:9096' : 'http://testurl'
  static IS_DEBUG = true
  static ACCESS_TOKEN_COOKIE_NAME = '_authorization'
  static USER_INFO = '_u'
  static PID = ''
}

export default GProperties
