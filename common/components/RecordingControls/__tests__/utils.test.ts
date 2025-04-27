import { normalizeMeteringForScale } from "../utils";

describe("AudioRecorder/utils", () => {
  test("normalizeMeteringForScale", () => {
    expect(normalizeMeteringForScale(-160)).toBe(1);
    expect(normalizeMeteringForScale(0)).toBe(2);
    expect(normalizeMeteringForScale(-80)).toBe(1.5);
  });
});
