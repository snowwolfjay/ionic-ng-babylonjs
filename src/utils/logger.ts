const logConf = {
  level: 111,
  0: "log",
  1: "warn",
  2: "error",
  3: "info",
  100: "warn",
};
const nsConf = {
  janus: {
    level: -1,
  },
};
for (const ns of Object.keys(nsConf)) {
  nsConf[ns] = Object.assign({}, logConf, nsConf[ns]);
}
export function log(msg: any, ns?: string, level = 0, conf?: any) {
  conf = Object.assign({}, logConf, nsConf[ns], conf);
  if (
    conf.level <= level ||
    localStorage.showAllLog ||
    localStorage[`${ns}LogShow`]
  ) {
    const meth = console[conf[level] || "log"];
    const mt = typeof msg;
    if (ns) {
      console.warn(`[[[ ${ns} ]]]`);
    }
    meth(msg);
  }
  if (level === 100) {
    console.log(`report the logger`);
  }
}
export function getLogger(ns: string, level = 0, conf?: any) {
  return (msg: any, lev = level) => {
    log(msg, ns, lev, conf);
  };
}
export function nounce() {}
