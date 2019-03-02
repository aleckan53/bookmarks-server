const express = require('express');
const logger = require('../logger')
const { bookmarks } = require('../store');
const uuid = require('uuid');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
  .route('/bookmarks')
  .get((req,res)=>{
    res.json(bookmarks)
  })
  .post(bodyParser, (req,res)=>{
    const { title, url, description, rating=1 } = req.body;

    if (!title) {
      logger.error(`Missing title`)
      return res.status(400).json({error: "Invalid input"})
    }
  
    if (!url) {
      logger.error(`Missing url`)
      return res.status(400).json({error: "Invalid input"})
    }
  
    if (!description) {
      logger.error(`Missing description`)
      return res.status(400).json({error: "Invalid input"})
    }
  
    const id = uuid();
    const bookmark = {
      id,
      title,
      url,
      description,
      rating
    }
  
    bookmarks.push(bookmark);
    
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json({msg: 'Bookmark created!', id})  
  })

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req,res)=>{
    const { id } = req.params;

    const bookmark = bookmarks.find(bkmrk => bkmrk.id == id);
  
    if(!bookmark) {
      logger.error(`Bookmark with id ${id} is not found!`)
      return res.status(404).json({error: "Invalid id"})
    }
  
    res.json(bookmark)  
  })
  .delete((req,res)=>{
    const { id } = req.params;

    const idx = bookmarks.findIndex(bkmrk=>bkmrk.id == id);
  
    if (idx === -1) {
      logger.error(`Bookmark with id ${id} is not found!`)
      return res.status(404).json({error: "Invalid id"})
    }
  
    bookmarks.splice(idx, 1)
  
    logger.info(`Bookmark ${id} has been deleted!`)
  
    res.status(204).end();  
  })

  module.exports = bookmarksRouter;