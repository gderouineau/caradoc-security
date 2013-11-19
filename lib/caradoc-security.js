/*
 * DEPENDENCY
 */
var secure_data = require('../../../config/security').get;


exports.get = function (req, res, next) {

    /*
     * VARIABLE DEFINITION
     */
    var   login = secure_data.security.login.login_path
        , login_check = secure_data.security.login.login_check_path
        , inscription = secure_data.security.inscription.login_path
        , inscription_check = secure_data.security.inscription.login_path
        , logout = secure_data.security.logout.logout_path
        , reg_login = new RegExp("^"+login)
        , reg_login_check = new RegExp("^"+login_check)
        , reg_inscription = new RegExp("^"+inscription)
        , reg_inscription_check = new RegExp("^"+inscription_check)
        , reg_logout = new RegExp("^"+logout)
        , firewalls = secure_data.firewalls
        , allow = true
        , doNext = true
        , active = secure_data.active

        ;


    // testing if security middleware is active or no
    if(active){
        /*
         * VERIFICATION OF THE SECURITY PARAMETERS
         * We pass in all define firewalls
         */
        if(!reg_login.test(req.url)
            && !reg_login_check.test(req.url)
            && !reg_inscription.test(req.url)
            && !reg_inscription_check.test(req.url)
            && !reg_logout.test(req.url)
            ){


            for( var key in firewalls){

                var reg_pattern = new RegExp("^" + firewalls[key].pattern);
                if(firewalls[key].anonymous == false){

                    // testing if there is a rule for this route
                    if( reg_pattern.test(req.url )){

                        // default redirect to login page
                        doNext=false;

                        // check if user is connected
                        if(req.session.user){
                            allow=false;
                            for(var i in firewalls[key].user ){

                                // check if user ahve authorization to access to this content
                                if(req.session.user.role == firewalls[key].role[i]){
                                    doNext=true; // is user role granted to do next
                                }
                            }
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