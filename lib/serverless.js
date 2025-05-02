const serverlessConfiguration = {
    service: 'my-project',
    frameworkVersion: '3',
    org: 'sebolds',
    app: 'my-project',
    plugins: ['serverless-esbuild', 'serverless-offline'],
    provider: {
        name: 'aws',
        runtime: 'nodejs18.x',
        profile: 'Lucas',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
    },
    functions: {
        createPost: {
            handler: 'src/functions/handlers/createPost.createPost',
            events: [
                {
                    http: {
                        path: 'posts',
                        method: 'post',
                    },
                },
            ],
        },
    },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node18',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
    },
};
module.exports = serverlessConfiguration;
export {};
//# sourceMappingURL=serverless.js.map