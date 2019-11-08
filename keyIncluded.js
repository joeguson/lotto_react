exports.router = router;
exports.sch = schedule;
app.use(session({
    secret : 'hithere@#',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host     : 'beritamus-db01.cqtxhcf9tkke.ap-southeast-1.rds.amazonaws.com',
        user     : 'beritamusdb',
        password : 'TlqkfEnfgdjqhk$$',
        database : 'beritamus'
    })
}));
var conn = mysql.createConnection(
    {
      host     : 'beritamus-db01.cqtxhcf9tkke.ap-southeast-1.rds.amazonaws.com',
      user     : 'beritamusdb',
      password : 'TlqkfEnfgdjqhk$$',
      database : 'beritamus'
    }
);
conn.connect();
exports.conn = conn;
