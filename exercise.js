var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

// body-parser allows us to do req.body calls in the app.post section
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 6088);
app.use(express.static('public'));

// select from exercises table
app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT *, DATE_FORMAT(date,"%Y-%m-%d") AS date FROM exercises', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.jsresults = JSON.stringify(rows);
    context.results = rows;
    res.render('home', context);
  });
});

// creates table called exercises or resets it - from homework assignment
// CAUTION typically don't want to include user ability to reset the table from website command
app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS exercises", function(err){
    var createString = "CREATE TABLE exercises(" +
    "id INT PRIMARY KEY AUTO_INCREMENT," +
    "name VARCHAR(255) NOT NULL," +
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

// http://flip3.engr.oregonstate.edu:6088/insert?name=&reps=&weight=&date=&lbs=
// add to exercises (table)
app.get('/insert',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO exercises (`name`, `reps`, `weight`,`date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
  //  context.results = "Inserted id " + result.insertId;
  //  res.render('home',context);

    mysql.pool.query("SELECT *, DATE_FORMAT(date,'%Y-%m-%d') AS date FROM exercises", function(err, rows, fields){
      if (err) {
        next(err);
        return;
      }
      res.send(rows[rows.length-1]);
    });
  });
});

// delete from exercises (the table)
app.get('/delete',function(req,res,next){
  var context = {};
  mysql.pool.query("DELETE FROM exercises WHERE id = ?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    //context.results = "Deleted id " + result.insertId;
    //res.render('home',context);
    res.send({"delete_status":"1"});
  });
});

// updates an existing row in the table
app.get('/safe-update',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM exercises WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }


    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE exercises SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?",
        [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs || curVals.lbs, req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        context.results = "Updated " + result.changedRows + " rows.";
        //res.render('home',context);
        //res.send({"update_status":"1"});

        mysql.pool.query("SELECT *, DATE_FORMAT(date,'%Y-%m-%d') AS date FROM exercises WHERE id=?", [req.query.id], function(err, rows, fields){
          if (err) {
            next(err);
            return;
          }
          res.send(rows[0]);
        });
      });
    }
  });
});

// error messages

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  res.type('text/plain');
  res.status(500)
  res.send('500 - Server Error');
});

// command that starts the server
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port')); 
});
