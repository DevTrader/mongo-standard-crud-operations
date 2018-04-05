const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');

//DB URL, in this case the mongo is running locally and generating the 'test' database.
const url = 'mongodb://localhost:27017/test';

// GET and render homepage (from index views).
router.get('/', function(req, res, next) {
    res.render('index');
})

//--------------------------------------------------------------------------
//---------------------------------CRUD OPS---------------------------------
//--------------------------------------------------------------------------

//---------Getting from collection---------
router.get('/get-data-from-collection', function(req, res, next){
    //Array to be populated with collection data
    let resultArr = []
    //connect to database
    mongo.connect(url, function(err, db){
        //check for error
        assert.equal(null,err);
        
        //Find ALL data from 'user-data' collection
        const findData = db.collection('user-data').find();
        
        //Store data in array to be returned
        findData.forEach(function(doc, err){
            assert.equal(null, err);
            //push document from collection into resultArr
            resultArr.push(doc);
        }, function() { // <---Callback, so it won't run immediately with our GET
            //close db connection
            db.close();
            res.render('index', {items: resultArr}); //items, would be connected to views to render docs from collection
        });
    })
});

//---------Adding to collection---------
router.post('/post-data-to-collection', function(req, res, next){
    //define the item to be added to db collection
    const item = { //in the post form you would have 'title, content and author' as names
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    }

    //connect to mongo and insert
    mongo.connect(url, function(err,db){
        //check for errors
        assert.equal(null,err);

        //insert item to collection 'user-data'
        db.collection('user-data').insertOne(item, function(err, result){
            assert.equal(null, err);
            console.log('Item inserted');
            //close mongo connection
            db.close();
        })
    })
});

//---------Update on collection---------
router.put('/update-data-on-collection', function(req, res, next){
    
    //define the item format to be updated on db collection
    const item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    const id = req.body.id; //in the update form you would have the 'id' name
    
    //connect to mongo and update
    mongo.connect(url, function(err,db){
        //check for errors
        assert.equal(null,err);

        //Update item to collection 'user-data', after matching id with mongo.ObjectID (imported on the top of this file)
        //$set sets the item to the new modified data, it replaces the old item.
        db.collection('user-data').updateOne({"_id": ObjectID(id)}, {$set: item}, function(err, result){
            assert.equal(null, err);
            console.log('Item update');
            //close mongo connection
            db.close();
        });
    });
});

//---------Delete doc from collection---------
router.delete('/get-data-from-collection', function(req, res, next){
    const id = req.body.id; //select id to be deleted, you would fetch this from a form
    
    //connect to mongo and delete one
    mongo.connect(url, function(err,db){
        //check for errors
        assert.equal(null,err);

       //use Mongo.ObjectID(id from form) to select the doc with that id in the collection and delete it.
        db.collection('user-data').deleteOne({"_id": ObjectID(id)}, function(err, result){
            assert.equal(null, err);
            console.log('Item deleted');
            //close mongo connection
            db.close();
        });
    });
});