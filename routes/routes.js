var express = require('express');
var router = express.Router();
var voucher_codes = require('voucher-code-generator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

router.post('/:appId/level', function(req, res, next){
  try{
    var reqObj = req.body;
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
          "code": voucher_codes.generate({
              length: 9,
              count: 1
          }),
          "title": reqObj.title,
          "body": reqObj.body
        };

        var query = conn.query(insertSql, insertValues, function(err, result){
          if(err){
            console.error('SQL error: ', err);
            return next(err);
          }
          console.log(result);
          var levelId = result.levelId;
          res.json({'Level_id:': levelId});
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
