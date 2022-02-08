import {
  clearDummyStreams,
  constrainSupports,
  filterActiveTracks,
  getDeviceList,
  getLocalTrack,
  getLogger,
  replaceStreamTracks,
  looksEqual,
} from ".";

describe("Utils test", () => {
  // @ts-ignore

  // beforeEach(() => (service = new APIService(overlay as any, new NgZone({}))));

  describe("looksEqual 非对象测试", () => {
    it("非全等的都不等", () => {
      expect(looksEqual(null, undefined)).toBeFalsy();
      expect(looksEqual(0, undefined)).toBeFalsy();
      expect(looksEqual(false, undefined)).toBeFalsy();
      expect(looksEqual(false, {})).toBeFalsy();
      expect(looksEqual({}, null)).toBeFalsy();
    });
    it("全等的为true", () => {
      expect(looksEqual(null, null)).toBeTruthy();
    });
  });

  describe("looksEqual 数组测试", () => {
    // it("数组不一样")
    it("一个不是数组就是false", () => {
      expect(looksEqual([1], {})).toBeFalsy();
      expect(looksEqual({}, [1])).toBeFalsy();
    });
    it("元素相等且顺序相同为true", () => {
      expect(looksEqual([1], [1])).toBeTruthy();
    });
  });

  describe("looksEqual 对象测试", () => {
    // it("数组不一样")
    it("key不一样就不同", () => {
      expect(looksEqual({ x: 1 }, {})).toBeFalsy();
      expect(looksEqual({}, { x: 1 })).toBeFalsy();
      expect(looksEqual({ x: 1 }, { y: 1, x: 1 })).toBeFalsy();
      expect(looksEqual({ x: { x: 1 } }, { x: { x: 2 } })).toBeFalsy();
    });
  });
  describe("log 测试", () => {
    const cases = {
      level: 111,
      0: "log",
      1: "warn",
      2: "error",
      3: "info",
      100: "warn",
    };
    it(`log level 方法匹配`, () => {
      const logger0 = getLogger("", 0, { level: -1 });
      const logger1 = getLogger("", 1, { level: -1 });
      const logger2 = getLogger("", 2, { level: -1 });
      const logger3 = getLogger("", 3, { level: -1 });
      const spy0 = spyOn(console, "log");
      const spy1 = spyOn(console, "warn");
      const spy2 = spyOn(console, "error");
      const spy3 = spyOn(console, "info");
      logger0("hello 0");
      expect(spy0).toHaveBeenCalledWith("hello 0");
      logger1("hello 1");
      expect(spy1).toHaveBeenCalledWith("hello 1");
      logger2("hello 2");
      expect(spy2).toHaveBeenCalledWith("hello 2");
      logger3("hello 3");
      expect(spy3).toHaveBeenCalledWith("hello 3");
    });
    it(`log level 关闭测试`, () => {
      const logger0 = getLogger("", 0);
      const logger1 = getLogger("", 0, { level: 0 });
      const spy0 = spyOn(console, "log");
      logger0("hello 0");
      expect(spy0).not.toHaveBeenCalled();
    });
  });
  describe("stream 测试", () => {
    it("获取constrains测试", () => {
      const d = constrainSupports();
      expect(typeof d === "object").toBeTruthy();
    });
    it("获取设备列表测试", async () => {
      const d = await getDeviceList();
      expect(Array.isArray(d.audio)).toBeTruthy();
    });
    it("获取视频流", async () => {
      const d = await getLocalTrack("video", true);
      expect(d.stream instanceof MediaStream).toBeTruthy();
      d.track?.stop();
    });
    it("获取音频流", async () => {
      const d = await getLocalTrack("audio", true);
      expect(d.stream instanceof MediaStream).toBeTruthy();
      d.track?.stop();
    });
    // it("获取屏幕流", async () => {
    //   const d = await getLocalTrack("screen", true);
    //   expect(d.stream instanceof MediaStream).toBeTruthy();
    //   d.track?.stop();
    // });
    it("清理死流测试", async () => {
      const d = await getLocalTrack("video", true);
      expect(d.stream instanceof MediaStream).toBeTruthy();
      const sets = new Set([d.stream!]);
      expect(sets.size).toEqual(1);
      clearDummyStreams(sets);
      expect(sets.size).toEqual(1);
      d.track?.stop();
      clearDummyStreams(sets);
      expect(sets.size).toEqual(0);
    });
    it("过滤结束的track", async () => {
      const d = await getLocalTrack("video", true);
      expect(d.stream instanceof MediaStream).toBeTruthy();
      const tracks = [d.track];
      const ntracks = filterActiveTracks(tracks);
      expect(ntracks.length).toEqual(1);
      d.track?.stop();
      const ntracks1 = filterActiveTracks(tracks);
      expect(ntracks1.length).toEqual(0);
    });
    it("媒体流的track替换", async () => {
      const { stream, track } = await getLocalTrack("video", true);
      const tracks = [track];
      expect(stream.getTracks().length).toEqual(1);
      track?.stop();
      replaceStreamTracks(stream, [track]);
      expect(stream.getTracks().length).toEqual(0);
    });
  });
});
