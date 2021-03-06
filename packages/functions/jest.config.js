module.exports = {
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  coverageReporters: ["text"],
  collectCoverageFrom: ["src/libs/**/*.{js,jsx,ts,tsx}"],
};
