export default [
    {
        ignores: ['node_modules/**']
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                console: 'readonly',
                process: 'readonly'
            }
        },
        rules: {
            'prefer-arrow-callback': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            'arrow-body-style': ['error', 'always'],
            'consistent-return': 'error',
            'no-restricted-syntax': [
                'error',
                {
                    selector: "CallExpression[callee.name='require']",
                    message: 'Use ES module import instead of require().'
                },
                {
                    selector: "MemberExpression[object.name='module'][property.name='exports']",
                    message: 'Use ES module export instead of module.exports.'
                },
                {
                    selector: "MemberExpression[property.name='then']",
                    message: 'Use async/await instead of .then().'
                },
                {
                    selector: "MemberExpression[property.name='catch']",
                    message: 'Use try/catch with async/await instead of .catch().'
                },
                {
                    selector: "ExpressionStatement > CallExpression[callee.object.name='res'][callee.property.name=/^(json|send)$/]",
                    message: 'Return the Express response, for example: return res.status(200).json(data);'
                }
            ]
        }
    }
];
