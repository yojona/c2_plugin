var express = require('express');
var router = express.Router();
var shortid = require('shortid');
const bcrypt = require('bcrypt');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

router.post('/:appId/level', function(req, res, next){
  try{
    var reqObj = req.body;
    var shortCode = shortid.generate();
    console.log(req.get('appId'));

    req.getConnection(function(err, conn){
      if(err){
        console.error('SQl connection error: ', err);
        return next(err);
      }
      else{

        var insertSql = "INSERT INTO level SET ?";
        var insertValues = {
          "app_id": req.param('appId'),
          "user_id": reqObj.userId,
          "code": shortCode,
          "title": reqObj.title,
          "body": reqObj.body
        };

        var query = conn.query(insertSql, insertValues, function(err, result){
          if(err){
            console.error('SQL error: ', err);
            return next(err);
          }
          console.log(result);

          res.json({'code: ': shortCode});
        });
      }
    });
  }catch(ex){
      console.error("Internal error:"+ex);
      return next(ex);
  }
});

router.get('/:appid/level/:code', function(req, res, next){
  try{

    var code = req.param('code');

    console.log(code);
    var resUser;

    req.getConnection(function(err, conn){
      if(err){
        console.error('SQL connection error: ', err);
        return next(err);
      }else{

        conn.query('select username, title, body from level inner join user on level.user_id = user.id where code = ? ', [code], function(err,rows, fields){
          if(err){
            console.error('SQL error: ', err);
            return next(err);
          }
          var resLev = [];
          for( var levIndex in rows){
            var levObj = rows[levIndex];
            console.log(levObj);
            resLev.push(levObj);
          }
          res.json(resLev);
        });
      }
    });
  }catch(ex){
      console.error('Internal error:'+ ex);
      return next(ex);
  }
});

//User routes
router.post('/users', function(req, res, next){
  try{
    var reqObj = req.body;
    var password;
    password = bcrypt.hashSync(reqObj.password, 10);

    req.getConnection(function(err, conn){
      if(err){
        console.error('SQl connection error: ', err);
        return next(err);
      }
      else{

        var insertSql = "INSERT INTO user SET ?";
        var insertValues = {
          "firstname": reqObj.firstname,
          "lastname": reqObj.lastname,
          "username": reqObj.username,
          "email": reqObj.email,
          "password": password,
          "country": reqObj.country,
          "developer": reqObj.developer,
          "status": reqObj.status
        };

        var query = conn.query(insertSql, insertValues, function(err, result){
          if(err){
            console.error('SQL error: ', err);
            res.json({'success' : false, 'error': err});
            return next(err);
          }
          console.log(result);

          res.status(201).json({'success': true});
        });
      }
    });
  }catch(ex){
      console.error("Internal error:"+ex);
      return next(ex);
  }
});

var authApp = function(req, res, next, appname, appkey){
  try{
    req.getConnection(function(err, conn){
      if(err){
        console.error('SQL connection error: ', err);
        return next(err);
      }else{

        conn.query('select app_name, app_key from app where app_key = ? ', [appkey], function(err,rows, fields){
          if(err){
            console.error('SQL error: ', err);
            return next(err);
          }
          var res;
          for( var levIndex in rows){
            var levObj = rows[levIndex];
            console.log(levObj);
            res.push(levObj);
          }
          res.json({'resultado': resLev, 'auth': true});
        });
      }
    });
  }catch(ex){
    console.error('Internal error:'+ ex);
    return next(ex);
  }
};

router.get('/auth', function(req, res, next){
  try{
    var appname = req.param('appname');
    var appkey = req.param('appkey');
    authApp(req,res,next,appname, appkey);

    req.getConnection(function(err, conn){
      if(err){
        console.error('SQL connection error: ', err);
        return next(err);
      }else{
        /*
        conn.query('select username, title, body from level inner join user on level.user_id = user.id where code = ? ', [code], function(err,rows, fields){
          if(err){
            console.error('SQL error: ', err);
            return next(err);
          }
          var resLev = [];
          for( var levIndex in rows){
            var levObj = rows[levIndex];
            console.log(levObj);
            resLev.push(levObj);
          }
          res.json(resLev);
        });*/
      }
    });
  }catch(ex){
      console.error('Internal error:'+ ex);
      return next(ex);
  }
});
