/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose')

module.exports = function (app) {

  mongoose.connect(process.env.DB, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true})
  const libraryModel = require('../models/lib')

  app.route('/api/books')
    .get(function (req, res){
      libraryModel.find({}).exec()
      .then(data => {
        res.json(data)
      })
      .catch(err => res.status(500).send(err.message))
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if(!title) return res.send('missing required field title')

      new libraryModel({
        title: title
      }).save((err, data) => {
        if(err) return res.status(500).send(err.message)
        res.json({_id: data._id, title: data.title})
      })
    })
    
    .delete(function(req, res){
        libraryModel.deleteMany({}).exec()
        .then(data => {
          return res.send('complete delete successful')
        })
        .catch(err => res.status(500).send(err.message))
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;

      libraryModel.findById(bookid).exec()
      .then(data => {
        if(data) return res.json(data)
        else return res.send('no book exists')
      })
      .catch(err => res.status(500).send(err.message))
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      
      if(!comment)
        return res.send('missing required field comment')
      else {
        libraryModel.findById(bookid).exec()
        .then(data => {
          if(data) {
            data.comments.push(comment)
            data.commentcount = ++data.commentcount

            data.save((err, info) => {
              if(err) return res.status(500).send(err.message)
              return res.json(info)
            })
          }
          else res.send('no book exists')
        })
        .catch(err => res.status(500).send(err.message))
      }
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      
      libraryModel.findByIdAndDelete(bookid).exec()
        .then(data => {
          if(data) return res.send('delete successful')
          else return res.send('no book exists')
        })
        .catch(err => res.status(500).send(err.message))
    });
  
};
