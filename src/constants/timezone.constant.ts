export type TimezoneOption = {
  name: string;
  code: string;
  tmz: number;
  tmz_abbr: string;
};

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  {
    name: "Eastern Time (US & Canada)",
    code: "America/New_York",
    tmz: -240,
    tmz_abbr: "EST",
  },
  {
    name: "Central Time (US & Canada)",
    code: "America/Chicago",
    tmz: -300,
    tmz_abbr: "CST",
  },
  {
    name: "Mountain Daylight Time (US & Canada)",
    code: "America/Denver",
    tmz: -360,
    tmz_abbr: "MDT",
  },
  {
    name: "Mountain Standard Time (US & Canada)",
    code: "US/Arizona",
    tmz: -420,
    tmz_abbr: "MST",
  },
  {
    name: "Pacific Time (US & Canada)",
    code: "America/Los_Angeles",
    tmz: -420,
    tmz_abbr: "PST",
  },
  {
    name: "Arizona",
    code: "America/Phoenix",
    tmz: -360,
    tmz_abbr: "MST",
  },
  {
    name: "Alaska",
    code: "America/Anchorage",
    tmz: -480,
    tmz_abbr: "ATZ",
  },
];
