security middleware for caradoc bundle

### Install

$ sudo npm -g install caradoc
$ caradoc create:project projectName
$ cd projectName && npm install

then complete the /config/security.js file


‘‘‘js

    active : 'false/true' // determine if active or not

    firewalls : {
        nameOfTheFirewall :{
            pattern : '/someroute', // setup the route under which firewall is active
            anonymous : 'true/false', // deternime if you can access the content without being connected
            role : [ ROLE_MEMBER, ROLE_ADMIN], // role needed to access this content the role should be store in req.user.role
            exclude : [ '/aRoute', '/anOtherRoute'] // route exclude from the firewall
        }
    },
    security : {

        // just set the route to the different page
        // use for user middleware

    },

    user : {

        // specify the route to your user, use for user middleware
    }

