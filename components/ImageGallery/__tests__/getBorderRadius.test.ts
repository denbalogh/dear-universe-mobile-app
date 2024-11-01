import getBorderRadius, {
  borderBottomLeftRadius,
  borderBottomRightRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  zeroBorderRadius,
} from "../getBorderRadius";

describe("getBorderRadius", () => {
  test("returns zero border radius when totalCount is 0", () => {
    expect(getBorderRadius(0, 0)).toEqual(zeroBorderRadius);
    expect(getBorderRadius(3, 0)).toEqual(zeroBorderRadius);
    expect(getBorderRadius(-1, 0)).toEqual(zeroBorderRadius);
  });

  test("throws error when index is out of bounds", () => {
    expect(() => getBorderRadius(3, 2)).toThrow("Index out of bounds");
    expect(() => getBorderRadius(-1, 2)).toThrow("Index out of bounds");
  });

  test("returns correct border radius when only 1 image in 3 cols", () => {
    expect(getBorderRadius(0, 1, 3)).toEqual({
      ...borderTopLeftRadius,
      ...borderBottomRightRadius,
      ...borderTopRightRadius,
      ...borderBottomLeftRadius,
    });
  });

  test("returns correct border radius when 2 images in 3 cols", () => {
    expect(getBorderRadius(0, 2, 3)).toEqual({
      ...zeroBorderRadius,
      ...borderTopLeftRadius,
      ...borderBottomLeftRadius,
    });
    expect(getBorderRadius(1, 2, 3)).toEqual({
      ...zeroBorderRadius,
      ...borderTopRightRadius,
      ...borderBottomRightRadius,
    });
  });

  test("returns correct border radius when 3 images in 3 cols", () => {
    expect(getBorderRadius(0, 3, 3)).toEqual({
      ...zeroBorderRadius,
      ...borderTopLeftRadius,
      ...borderBottomLeftRadius,
    });
    expect(getBorderRadius(1, 3, 3)).toEqual({
      ...zeroBorderRadius,
    });
    expect(getBorderRadius(2, 3, 3)).toEqual({
      ...zeroBorderRadius,
      ...borderBottomRightRadius,
      ...borderTopRightRadius,
    });
  });

  test("returns correct border radius when 4 images in 3 cols", () => {
    expect(getBorderRadius(0, 4, 3)).toEqual({
      ...zeroBorderRadius,
      ...borderTopLeftRadius,
    });
    expect(getBorderRadius(1, 4, 3)).toEqual({
      ...zeroBorderRadius,
    });
    expect(getBorderRadius(2, 4, 3)).toEqual({
      ...zeroBorderRadius,
      ...borderTopRightRadius,
      ...borderBottomRightRadius,
    });
    expect(getBorderRadius(3, 4, 3)).toEqual({
      ...zeroBorderRadius,
      ...borderBottomLeftRadius,
      ...borderBottomRightRadius,
    });
  });

  test("returns correct border radius when 5 images in 3 cols", () => {
    expect(getBorderRadius(0, 5, 3)).toEqual({
      ...zeroBorderRadius,
      ...borderTopLeftRadius,
    });
    expect(getBorderRadius(1, 5, 3)).toEqual({
      ...zeroBorderRadius,
    });
    expect(getBorderRadius(2, 5, 3)).toEqual({
      ...zeroBorderRadius,
      ...borderTopRightRadius,
      ...borderBottomRightRadius,
    });
    expect(getBorderRadius(3, 5, 3)).toEqual({
      ...zeroBorderRadius,
      ...borderBottomLeftRadius,
    });
    expect(getBorderRadius(4, 5, 3)).toEqual({
      ...zeroBorderRadius,
      ...borderBottomRightRadius,
    });
  });

  test("returns correct border radius when 6 images in 3 cols", () => {
    expect(getBorderRadius(0, 6, 3)).toEqual({
      ...zeroBorderRadius,
      ...borderTopLeftRadius,
    });
    expect(getBorderRadius(1, 6, 3)).toEqual({
      ...zeroBorderRadius,
    });
    expect(getBorderRadius(2, 6, 3)).toEqual({
      ...zeroBorderRadius,
      ...borderTopRightRadius,
    });
    expect(getBorderRadius(3, 6, 3)).toEqual({
      ...zeroBorderRadius,
      ...borderBottomLeftRadius,
    });
    expect(getBorderRadius(4, 6, 3)).toEqual({
      ...zeroBorderRadius,
    });
    expect(getBorderRadius(5, 6, 3)).toEqual({
      ...zeroBorderRadius,
      ...borderBottomRightRadius,
    });
  });

  test("returns correct border radius on random cases with 3 cols", () => {
    expect(getBorderRadius(7, 11, 3)).toEqual({
      ...zeroBorderRadius,
    });
    expect(getBorderRadius(8, 11, 3)).toEqual({
      ...zeroBorderRadius,
      ...borderBottomRightRadius,
    });
    expect(getBorderRadius(9, 11, 3)).toEqual({
      ...zeroBorderRadius,
      ...borderBottomLeftRadius,
    });
  });
});
