import { roundness } from "@/constants/theme";

type BorderRadius = {
  borderTopLeftRadius: number;
  borderBottomRightRadius: number;
  borderTopRightRadius: number;
  borderBottomLeftRadius: number;
};

export const zeroBorderRadius = {
  borderTopLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderTopRightRadius: 0,
  borderBottomLeftRadius: 0,
};

export const borderTopLeftRadius = {
  borderTopLeftRadius: roundness,
};

export const borderBottomLeftRadius = {
  borderBottomLeftRadius: roundness,
};

export const borderBottomRightRadius = {
  borderBottomRightRadius: roundness,
};

export const borderTopRightRadius = {
  borderTopRightRadius: roundness,
};

const getBorderRadius = (
  index: number,
  totalCount: number,
  columns: number = 3,
): BorderRadius => {
  if (totalCount === 0) {
    return zeroBorderRadius;
  }

  if (index < 0 || index >= totalCount) {
    throw new Error("Index out of bounds");
  }

  if (totalCount === 1) {
    return {
      ...borderTopLeftRadius,
      ...borderBottomRightRadius,
      ...borderTopRightRadius,
      ...borderBottomLeftRadius,
    };
  }

  const rows = Math.ceil(totalCount / columns);
  const row = Math.floor(index / columns);

  const isLeftColumn = index % columns === 0;
  const isRightColumn = index % columns === columns - 1;

  const isFirst = index === 0;
  const isLast = index === totalCount - 1;

  const borders = { ...zeroBorderRadius };

  // One row only
  if (rows === 1) {
    if (isFirst) {
      borders.borderTopLeftRadius = roundness;
      borders.borderBottomLeftRadius = roundness;
    }
    if (isLast) {
      borders.borderTopRightRadius = roundness;
      borders.borderBottomRightRadius = roundness;
    }
  }

  // First row
  else if (row === 0) {
    if (isFirst) {
      borders.borderTopLeftRadius = roundness;
    }
    if (isRightColumn) {
      borders.borderTopRightRadius = roundness;
    }
  }

  // Last row
  if (row === rows - 1) {
    if (isLast) {
      borders.borderBottomRightRadius = roundness;
    }
    if (isLeftColumn) {
      borders.borderBottomLeftRadius = roundness;
    }
  }

  // Second last row if last is not full
  if (row === rows - 2 && totalCount % columns !== 0) {
    if (isRightColumn) {
      borders.borderBottomRightRadius = roundness;
    }
  }

  // Middle rows
  return borders;
};

export default getBorderRadius;
