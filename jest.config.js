const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './'
});

const customJestConfig = {
    moduleDirectories: ['node_modules', '<rootDir>/'],
    globalTeardown: './tests/globalTeardown.js'
};

module.exports = createJestConfig(customJestConfig);