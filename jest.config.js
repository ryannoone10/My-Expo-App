// taken from https://github.com/rorypierce111/react-native-lab/blob/main/jest.config.js
module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};