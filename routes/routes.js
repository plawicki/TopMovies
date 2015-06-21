exports.index = function (req, res) {
    res.render('index', {data: req.app.locals.top20});
};

exports.genres = function (req, res) {
    res.render('genres', {data: req.app.locals.topGenres});
};

exports.movie = function (req, res) {
	var retVal = req.app.locals.movies_genres.filter(function(v){
		return v.id == req.params.id.substring(1);
	})[0];

	res.render('movie', {data: retVal});
};