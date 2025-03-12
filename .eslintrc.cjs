module.exports = {
      root: true,
      env: { browser: true, es2020: true },
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
      ],
      ignorePatterns: ['dist/*'],
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      plugins: ['react-refresh'],
      rules: {
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
      },
    }
