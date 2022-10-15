 const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const { title } = require("process");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

// Schema for items
const articleSchema = {
    title : String,
    content : String
};

// model for item
const Article = mongoose.model("Article", articleSchema);

// Targeting route
// Chained Route handler using express
app.route("/articles")
.get(function(req,res){
        Article.find(function(err,foundArticles){
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }
    });
})
.post(function(req,res){
    const newArticle = new Article({
        title : req.body.title,
        content : req.body.content
    })
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added in database")
        }else{
            res.send("Error")
        }   
    });
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all items")
        }else{
            res.send("Error")
        }
    });
});

// Targeting specific route
app.route("/articles/:airtcleTitle")
.get(
    function(req,res){
        Article.findOne({title : req.params.airtcleTitle},function(err, foundArticles){
            if(foundArticles){
                res.send(foundArticles)
            }else{
                res.send("No article match you have enter.")
            }
        })
    }
)
.put(function(req,res){
    Article.update(
        {
            title : req.params.airtcleTitle
        },{
            title : req.body.title,
            content : req.body.content
        },{
            overwrite : true
        },function(err){
            if(!err){
                res.send("Successfully");
            }else{
                res.send("Error");
            }
        }
    );
})
.patch(function(req, res){

    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })
.delete(function(req,res){
    Article.deleteOne(
        {title :req.params.airtcleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted all items")
            }
            else{
                res.send("Error")
            }
        }
    );
});
// local server 3000
app.listen(3000, function(){
    console.log("Server has been started")
});