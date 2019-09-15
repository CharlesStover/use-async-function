module.exports = {
  moduleNameMapper: {
    '\\.s?css$': '<rootDir>/tests/mocks/empty.ts',
  },
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
