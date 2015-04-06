var config = {
    app: {
        name: 'BlogStarter',
        url: 'http://localhost',
        dist: './client/dist/',
        uploads: '/assets'
    },
    db: {
        host: '127.0.0.1',
        user: '3l33t',
        password: 'uw0tm8',
        dbName: 'depot',
        connectionLimit: 2
    },
    sessionKey: 'You should change this',
    port: 8888
};

export = config;
