var express = require('express');
var routes = require('./routes/routes.js');
var http = require('http');
var path = require('path');
var less = require('less-middleware');
var db = require('./services/dbService.js');

var app = express();

app.locals.topGenres = [];
app.locals.moves = [];

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser('bardzo tajne aqq'));
    app.use(express.session());
    app.use(app.router);
    app.use(less({
        src: path.join(__dirname, 'less'),
        dest: path.join(__dirname, 'public/css'),
        prefix: '/css',
        compress: true
    }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'bower_components/jquery/dist')));
    app.use(express.static(path.join(__dirname, 'bower_components/d3')));
    app.use(express.static(path.join(__dirname, 'bower_components/bootstrap-css')));
});

app.configure('development', function () {
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
});

db.makeQuery("SELECT id, title, vote_average FROM movie ORDER BY vote_average DESC, release_date DESC LIMIT 20", function(res) {
    if(!res) 
        console.error("Cannot make query");
    else {
        app.locals.top20 = res.rows;
        app.get('/', routes.index);
    }
});


db.makeQuery("SELECT (100.0*COUNT(movie.title)/(SELECT count(*) FROM movie_genre)) AS percent, genre.name FROM movie LEFT OUTER JOIN movie_genre ON movie.id = movie_genre.movie_id LEFT OUTER JOIN genre ON movie_genre.genre_id = genre.id GROUP BY genre.name", function(res) {
    if(!res) 
        console.error("Cannot make query");
    else {
        app.locals.topGenres = res.rows;
        app.get('/topGenre', routes.genres);
    }
});


db.makeQuery("SELECT movie.id, movie.title, array_agg(genre.name) FROM movie LEFT OUTER JOIN movie_genre ON movie.id = movie_genre.movie_id LEFT OUTER JOIN genre ON movie_genre.genre_id = genre.id GROUP BY movie.id, movie.title", function(res) {
    if(!res) 
        console.error("Cannot make query");
    else {
        app.locals.movies_genres = res.rows;
        app.get('/movie/:id', routes.movie);
    }
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Serwer nasłuchuje na porcie " + app.get('port'));
});
