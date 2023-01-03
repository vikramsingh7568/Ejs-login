var pageTitle = { name: '' }
var con = require("../conn.js");
const { isValidName, isValidEmail, isValidPwd } = require("./validation.js")


// register sign up user data 
const getData = function (req, res) {
    res.render('home', { pageTitle });
}

const postData = function (req, res) {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    if (!isValidName(name)) {
        pageTitle.name = 'name can be string only';
        res.render('home', { pageTitle });
        pageTitle.name = ''
        return
    }

    if (!isValidEmail(email)) {
        pageTitle.name = 'Please enter valid e-mail';
        res.render('home', { pageTitle });
        pageTitle.name = ''
        return
    }

    if (!isValidPwd(password)) {
        pageTitle.name = "Password should be 8-15 must contain 0-9,A-Z,a-z special characters";
        res.render('home', { pageTitle });
        pageTitle.name = ''
        return
    }

    let user = "select * from userTable where email = ?"
    con.query(user, [email], function (err, result) {
        //con.query("select email from userTable", (err, result) => {
        if (err){
            pageTitle.name = err.message
            res.render('home', { pageTitle });
            pageTitle.name = ''
            return
        }
        if (result.length == 0) {
            var sql = "INSERT INTO userTable(name, email, password) VALUES('" + name + "', '" + email + "','" + password + "')";
            con.query(sql, function (error, result) {
                if (error){
                    pageTitle.name = error.message
                    res.render('home', { pageTitle });
                    pageTitle.name = ''
                    return
                }
                if (result) {
                    pageTitle.name = 'Your Account is Created successfully';
                    res.render('home', { pageTitle });
                    pageTitle.name = ''
                    return
                }
            })
            
          if (result.length != 0) {
                pageTitle.name = "this e mail is already registered";
                res.render('home', { pageTitle });
                pageTitle.name = ''
                return
            }
  }  })
 }


// login user data 

const getlogin = function (req, res) {
    res.render('login', { pageTitle });
}

const postlogin = function (req, res) {
   
    let email = req.body.email
    let password = req.body.password
  
    if (!isValidEmail(email)) {
      pageTitle.name =  'Please enter valid e-mail'
      res.render('login', { pageTitle });
      pageTitle.name = ''
      return
    }
  
    if (!isValidPwd(password)){
    pageTitle.name =  'password 8-15 digit with 0-9,A-z,special symbol'
    res.render('login', { pageTitle });
    pageTitle.name = ''
    return
    }
                
                  let user = "select * from userTable where email = ?"
                  con.query(user,[email],function(err,result){
                   
                      if(err){
                        pageTitle.name = err.message
                        res.render('login', { pageTitle });
                        pageTitle.name = ''
                        return
                      }
                      if(result.length ==0){
                            pageTitle.name =  'Email not Found'
                            res.render('login', { pageTitle });
                            pageTitle.name = ''
                            return
                          }
                          let diff = Math.abs(new Date(result[0]['last_failed_attempt']).getTime() - new Date().getTime())
                          diff = diff / (60 * 60 * 1000);
                  
                           // today
                      if(diff<24){
                          if(result[0]['failed_attempt']>=5){
                            pageTitle.name =  'try after 24 hours 5 wrong attempt'
                            res.render('login', { pageTitle });
                            pageTitle.name = ''
                            return
                        }
                          // before 24 hour right attempt
                          if(password==result[0].password){
                              let update = 'update userTable set failed_attempt = 0 where email = ?;'
                              con.query(update,[email],function(err,updated){
                                  if(err){
                                    pageTitle.name =  err.message
                                    res.render('login', { pageTitle });
                                    pageTitle.name = ''
                                    return
                                  }
                                  res.redirect("/homepage.html")
                              
                              })
                          }
                          //before 24 hour wrong attempt
                          else{
                              let update = 'update userTable set failed_attempt = failed_attempt+1 where email = ?;'
                              con.query(update,[email],function(err,updated){
                              
                                  if(err){
                                    pageTitle.name =  err.message
                                    res.render('login', { pageTitle });
                                    pageTitle.name = ''
                                    return
                                  }
                                  else{
                                    pageTitle.name = `you entered wrong you have only ${5-(result[0].failed_attempt+1)}attempts left`
                                    res.render('login', { pageTitle });
                                    pageTitle.name = ''
                                    return
                                  }
                        
                              })
                          }
          
                      }
                      // tomorrow...
                      else{
                          // after 24 hour right attempt
                          if(password==result[0].password){
                              let update = 'update userTable set failed_attempt = 0 where email = ?;'
                              con.query(update,[email],function(err,updated){
                                  if(err){
                                    pageTitle.name = err.message
                                    res.render('login', { pageTitle });
                                    pageTitle.name = ''
                                    return
                                  }
                                  else{
    
                                    res.redirect("/homepage.html")
                                   
                                  }
                              })
                          }
                          // after 24 hours wrong attemp
                          else{
                              let update = 'update userTable set failed_attempt = 1,last_failed_attempt = now() where email = ?;'
                              con.query(update,[email],function(err,updated){
                              
                                  if(err){
                                    pageTitle.name = err.message;
                                    res.render('login', { pageTitle });
                                    pageTitle.name = ''
                                    return
                                 }
                                  else{
                                    pageTitle.name = `you entered wrong you have only ${5-(result[0].failed_attempt+1)}attempts left`
                                    res.render('login', { pageTitle });
                                    pageTitle.name = ''
                                    return
                                   }
                                })
                          }
                        }
                  })
}
  





module.exports = { getData, postData, getlogin, postlogin };