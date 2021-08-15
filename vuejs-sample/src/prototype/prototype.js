/*eslint no-extend-native: "error"*/
const prototype = {};

/*jshint freeze: true */
Object.defineProperty(String.prototype, 'replaceAll', {
  enumerable: false,
  value: function (org, dest) {
    'use strict';
    return this.split(org).join(dest);
  },
});

Object.defineProperty(String.prototype, 'date', {
  enumerable: false,
  value: function (f) {
    'use strict';
    if (!f) return new Date(this);

    let current = new Date();
    let d = {
      yyyy: current.getFullYear(),
      yy: null,
      MM: current.getMonth(),
      dd: current.getDate(),
      hh: current.getHours(),
      mm: current.getMinutes(),
      ss: current.getSeconds(),
    };

    let pad = 0; // 포맷(f)과 문자열(this) 사이의 길이 차이를 보정 (f="MM/dd", this="3/14" 일 때 pad는 1, f="MM/dd", this="3/4" 일 때 pad는 2)
    let m = f.match(/yyyy|yy|MM|dd|hh|mm|ss/g);
    for (var i in m) {
      let str = f.indexOf(m[i]) - pad;
      let end = f.indexOf(m[i]) + m[i].length - pad;
      let ret1 = this.substring(str, end);
      let ret2 = ret1.replace(/\D/g, '');
      pad += ret1.length - ret2.length;
      d[m[i]] = Number(ret2);
    }
    d.yyyy = Number(
      d.yy ? d.yyyy.toString().substring(0, 2) + d.yy : d.yyyy,
    );
    return new Date(d.yyyy, d.MM - 1, d.dd, d.hh, d.mm, d.ss);
  }
});

/** [PROTOTYPE]
 * 숫자의 세 자리마다 쉼표를 표시합니다.
 */
Object.defineProperty(String.prototype, 'commas', {
  enumerable: false,
  value: function (f) {
    'use strict';
    return this.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  }
});

export default prototype;
