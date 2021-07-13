var express = require('express');
var router = express.Router();
const myfunction = require('../db/token.db')
const router_3 = require('./private/issuesByReporter')
const router_4 = require('./private/issuesByDeveloper')


router.use(async (req, res, next) => {
    const access_token = req.headers.authorization;
    let realToken;
    if (access_token) {
        realToken = access_token.split(' ', 2)[1];
    }
    if (!realToken) {
        return res.status(401).json({
            message: "you need to provide an access_token in Bearer form"
        })
    }
    const user = await myfunction.getUsernameFromToken(realToken);
    if (!user) {
        return res.status(403).json({
            message: "invalid access_token"
        })
    }
    
    //  if (user.role === 'R'&&( router.use('/reporter', router_3.reporterController))) {
    //          if( router.use('/developer', router_4.developerController) ){
    //             return res.json({
    //                 "message": "You don't have permission"
    //             })
    //         }
    //     } else if (user.role === 'D') {
    //         router.use('/developer', router_4.developerController);
    //         if( router.use('/reporter', router_3.reporterController)){
    //             return res.json({
    //                 "message": "You don't have permission"
    //             })
    //         }
    //     } 
    

    req.user = user.username;
    req.role = user.role;
    return next(undefined, req);
});
function isReporter( req, res, next ) {
    if(req.role === 'D'){
        return res.json({
                            "message": "You don't have permission"
                        }) 
    }
    next();
 }
 function isDeveloper( req, res, next ) {
    if(req.role === 'R'){
        return res.json({
                            "message": "You don't have permission"
                        }) 
    }
    next();
 }
 router.use('/reporter', isReporter, router_3.reporterController)
 router.use('/developer',isDeveloper, router_4.developerController)
module.exports = {
    private: router
}