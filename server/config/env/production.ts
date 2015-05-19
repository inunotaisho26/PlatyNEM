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
    sendgrid: {
        username: 'darionwelch',
        password: 'password123' 
    },
    port: 5000
};

export = config;
