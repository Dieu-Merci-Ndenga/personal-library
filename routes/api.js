'use strict';

const mongoose = require('mongoose');
const Book = require('../models/lib');

module.exports = function (app) {

  mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  app.route('/api/books')
    .get(function (req, res) {
      Book.find({}).exec()
        .then(books => res.json(books))
        .catch(error => res.status(500).send(error.message));
    })

    .post(function (req, res) {
      const title = req.body.title;
      if (!title) return res.send('missing required field title');

      Book.create({ title: title })
        .then(book => res.json({ _id: book._id, title: book.title }))
        .catch(error => res.status(500).send(error.message));
    })

    .delete(function (req, res) {
      Book.deleteMany({}).exec()
        .then(() => res.send('complete delete successful'))
        .catch(error => res.status(500).send(error.message));
    });

  app.route('/api/books/:id')
    .get(function (req, res) {
      Book.findById(req.params.id).exec()
        .then(book => book ? res.json(book) : res.send('no book exists'))
        .catch(error => res.status(500).send(error.message));
    })

    .post(function (req, res) {
      const comment = req.body.comment;
      if (!comment) return res.send('missing required field comment');

      Book.findById(req.params.id).exec()
        .then(book => {
          if (!book) {
            res.send('no book exists');
            return null;
          }
          book.comments.push(comment);
          book.commentcount += 1;
          return book.save();
        })
        .then(book => book && res.json(book))
        .catch(error => res.status(500).send(error.message));
    })

    .delete(function (req, res) {
      Book.findByIdAndDelete(req.params.id).exec()
        .then(book => book ? res.send('delete successful') : res.send('no book exists'))
        .catch(error => res.status(500).send(error.message));
    });
};
