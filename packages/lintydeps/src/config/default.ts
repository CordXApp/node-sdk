import depcheck from 'depcheck';

/**
 * Default configuration for lintydeps
 * @type {depcheck.Options}
 * @param {boolean} withoutDev - Ignore devDependencies
 * @param {boolean} ignoreBinPackage - Ignore bin package
 * @param {string[]} ignoreDirs - Directories to ignore
 * @param {string[]} ignoreMatches - Files to ignore
 * @param {Record<string, depcheck.Parser>} parsers - Custom parsers
 * @param {Record<string, depcheck.Detector>} detectors - Custom detectors
 * @param {depcheck.Special[]} specials - Custom specials
 * @default
 */
export const defaultConfig = {
    withoutDev: false,
    ignoreBinPackage: false,
    ignoreDirs: [
        "_bin",
        "_output",
        "_src",
        "coverage",
        "node_modules",
        "public",
        "test",
        "tests",
    ],
    /**
     * Ignore the following package globs
     * @type {string[]}
     * @ignore babel-* | Ignore babel packages
     * @ignore lintydeps | Ignore lintydeps (this package)
     * @ignore "@newrelix/native-metrics" | Ignore newrelic native metrics (not required)
     * @ignore coveralls | Ignore coveralls (used in package.json)
     * @ignore node-sass | Ignore node-sass (used by tools to compile css)
     * @ignore istanbul | Ignore istanbul (used for code coverage)
     * @ignore css-loader | Ignore css-loader (used to load css files)
     * @ignore file-loader | Ignore file-loader (used to load files)
     * @ignore sass-loader | Ignore sass-loader (used to load sass files)
     * @ignore postcss-loader | Ignore postcss-loader (used to load postcss files)
     * @ignore image-webpack-loader | Ignore image-webpack-loader (used to load images)
     * @ignore mocha | Ignore mocha (used for testing)
     */
    ignoreMatches: [
        "babel-*",
        "lintydeps",
        "@newrelix/native-metrics",
        "coveralls",
        "node-sass",
        "istanbul",
        "css-loader",
        "file-loader",
        "sass-loader",
        "postcss-loader",
        "image-webpack-loader",
        "mocha"
    ],
    parsers: {
        "*.js": [
            depcheck.parser.jsx,
            depcheck.parser.es6
        ],
        "*.jsx": depcheck.parser.jsx,
        "*.ts": depcheck.parser.typescript,
        "*.tsx": depcheck.parser.typescript
    },
    detectors: [
        depcheck.detector.requireCallExpression,
        depcheck.detector.importDeclaration
    ],
    specials: [
        depcheck.special.eslint,
        depcheck.special.webpack
    ]
}