import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
    { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
    { languageOptions: { globals: globals.node } },
    { rules: { 'no-unused-vars': 'warn', 'prefer-const': 'warn' } },
    pluginJs.configs.recommended,
];
