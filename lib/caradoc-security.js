var secure_data = require('../../../config/security');
var firewalls= secure_data.get.firewalls;
exports.get = function (req, res, next) {

    console.log("passing via security service");
    var login_path, reg_login, reg_pattern;

    login_path = secure_data.get.security.form_login.login_path;
    reg_login = new RegExp("^"+login_path);


    var doNext = true; // Default to true so if there is no rule on the route return next()
    var allow  = true;
    /*
     * VERIFICATION OF THE SECURITY PARAMETERS
     * We pass in all define firewalls
     */
    for( var key in firewalls){
        reg_pattern = new RegExp("^" + firewalls[key].pattern);
        if(reg_pattern.test(req.url)){ // testing if there is a rule for this route
            if(firewalls[key].anonymous == false){ // if you can not connect without being connected
                doNext=false;// default redirect to login page
                if(req.session.c_user){
                    allow=false;
                    for(var i in firewalls[key].user ){
                        if(req.session.c_user.role == firewalls[key].user[i]){
                            doNext=true; // is user role granted to do next
                            allow = true;
                        }
                    }
                }
            }
        }
    }




    /*
     * ACTION RESULT AFTER SECURITY VERIFICATION
     */

    if(doNext)
        next();
    else if (allow){
        req.session.last_page = req.url;
        res.redirect(login_path);
    }
    else {
        res.redirect('/401');
    }




};