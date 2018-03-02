var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://johnbreau:monlab71X@ds151508.mlab.com:51508/lego-barcode-scanner', ['sets']);


//Entire collection
router.get('/sets', function(req, res, next){
    db.sets.find(function(err, sets){
        if(err){
            res.send(err);
        }
        res.json(sets);
    });
});

//Single Sets
router.get('/set/:id', function(req, res, next){
    db.sets.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, set){
        if(err){
            res.send(err);
        }
        res.json(set);
    });
});

//Save a Set
router.post('/set', function(req, res, next){
    var set = req.body;
    if(!set.setName || !set.setNumber ){
        res.status(400);
        req.json({
            "error": "bad data",
        });
    } else {
        db.sets.save(set, function(err, set){
            if(err){
                res.send(err);
            }
            res.json(set);
         });
    }
});

// Delete a Set
router.delete('/set/:id', function(req, res, next){
    db.sets.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, set){
        if(err){
            res.send(err);
        }
        res.json(set);
    });
});


// Update a Set
router.put('/set/:id', function(req, res, next){
    var set = req.body;
    var updateSet = {};
    if (set.setName !== ''){
        updateSet.setName = set.setName
    }
    if (set.setNumber !== ''){
        updateSet.setNumber = set.setNumber
    }
    if (set.setPieces !== ''){
        updateSet.setPieces = set.setPieces
    }
    if (set.setYear !== ''){
        updateSet.setYear = set.setYear
    }
    if (set.setTheme !== ''){
        updateSet.setTheme = set.setTheme
    }
    if (set.setLocation !== ''){
        updateSet.setLocation = set.setLocation
    }
    if (!updateSet) {
        res.status(400);
        res.json({
            "error": "Bad data",
        });
    } else {
        db.sets.update({_id: mongojs.ObjectId(req.params.id)}, updateSet, {}, function(err, set){
            if(err){
                res.send(err);
            }
            res.json(set);
        });
    }
});

module.exports = router;