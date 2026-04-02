export const homeModeValues = ["month", "year"] as const;
export type HomeMode = (typeof homeModeValues)[number];

export const homeModeLabels: Record<HomeMode, string> = {
  month: "Month",
  year: "Year",
};
