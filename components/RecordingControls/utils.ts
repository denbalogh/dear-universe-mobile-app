// The range is from -160 to 0. https://docs.expo.dev/versions/latest/sdk/audio/#recordingstatus
// We want to normalize it to 1 to 2 for the scale transform.
export const normalizeMeteringForScale = (metering: number) => {
  return (metering + 160) / 160 + 1;
};
