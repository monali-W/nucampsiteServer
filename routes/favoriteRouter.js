const express = require("express");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");

const favoriteRouter = express.Router();
favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then(favorites => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
      })
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then(favorite => {
        if (favorite) {
          req.body.forEach(campsiteId => {
            if (!favorite.campsites.includes(campsiteId))
              favorite.campsites.push(campsiteId);
          });
          favorite
            .save()
            .then(favorite => {
              console.log("favorite Created ", favorite);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch(err => next(err));
        } else {
          Favorite.create({
            user: req.user._id,
            campsites: req.body
          })
            .then(favorite => {
              console.log("favorite ", favorite);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch(err => next(err));
        }
      })
      .catch(err => next(err));
  })
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,

    (req, res) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /partners");
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,

    (req, res, next) => {
      Favorite.findOneAndDelete({ user: req.user._id })
        .then(favorite => {
          if (favorite) {
            res.send(favorite);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(response);
          } else {
            res.setHeader("Content-Type", "text/plain");
            res.end("You do not have any favorites to delete.");
          }
        })
        .catch(err => next(err));
    }
  );
favoriteRouter
  .route("/:campsiteId")
  .get(cors.cors, (req, res, next) => {
    (req, res) => {
      res.statusCode = 403;
      res.end(" the operation is not supported");
    };
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,

    (req, res, next) => {
      Favorite.findOne({ user: req.user._id })
        .then(favorite => {
          if (favorite) {
            req.body.forEach(campsiteId => {
              if (!favorite.campsites.includes(req.params.campsiteId))
                favorite.campsites.push(req.params.campsiteId);
            });
            favorite
              .save()
              .then(favorite => {
                console.log(
                  "That campsite is already in the list of favorites! ",
                  favorite
                );
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              })
              .catch(err => next(err));
          } else {
            Favorite.create({
              user: req.user._id,
              campsites: req.body
            })
              .then(favorite => {
                console.log("favorite ", favorite);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              })
              .catch(err => next(err));
          }
        })
        .catch(err => next(err));
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,

    (req, res, next) => {
      (req, res) => {
        res.statusCode = 403;
        res.end(" the operation is not supported");
      };
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,

    (req, res, next) => {
      Favorite.findOne({ user: req.user._id })
        .then(response => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch(err => next(err));
    }
  );
module.exports = favoriteRouter;
