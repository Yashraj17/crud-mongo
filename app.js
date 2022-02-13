var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var urlEncoded = bodyParser.urlencoded({extended:false})
app.use(urlEncoded);

//database connection
mongoose.connect('mongodb://localhost/my_db').then(()=>{
    console.log("connection successfully");
}).catch(()=>{
    console.log("not connected");
})
var UserSchema =  mongoose.Schema({
    name:{type:String,required:true},
    contact:{type:String,required:true},
    email:{type:String,required:true},
})
var UserCollection = mongoose.model('user',UserSchema)

app.set('view engine','pug');
app.set('views','./views');

app.get('/',function (req,res) {
    UserCollection.find({},function (error,results) {
        if (error) {
            console.log("not found data");
        }
        else{
            res.render('home',{users:results})
        }
    })
})

app.post('/insert',urlEncoded,function (req,res) {
    const user = req.body;
    console.log(user);
    var data = new UserCollection({
        name:user.name,
        contact:user.contact,
        email:user.email,
    });
    data.save().then(()=>{
        console.log("data inserted");
         res.redirect('/')
    }).catch(()=>{
        console.log("not inserted");
    })

})
// app.get('/delete/:del_id',function (req,res) {
//     var del_id = req.params.del_id;
//     UserCollection.remove({"_id":del_id},function (error) {
//         if (error) {
//             throw error
//         }
//         else{
//             console.log("user data deleted");
//             res.redirect('/');
//         }
//     })
// })
app.post("/deleteRecord",function (req,res) {
    UserCollection.remove({"_id":req.body._id},function (error,results) {
        return res.redirect('/');
    })
})
app.get('/update/:edit_id',function (req,res) {
    const edit_id = req.params.edit_id;
    UserCollection.findOne({"_id":edit_id},function (error,results) {
        if (error) {
            throw error;
        }
        else{
            res.render('update',{user:results})
        }
    })
})

app.post('/update/:edit',urlEncoded,function (req,res) {
    var user = req.body;
    const edit = req.params.edit;
    UserCollection.updateOne({"_id":edit},{$set:{name:user.name,contact:user.contact,email:user.email}},function (error) {
        if (error) {
            throw error
        }
        else{
            console.log("update user data");
            return res.redirect('/')
        }
    })
})

app.get('/search?',function (req,res) {
    UserCollection.find({$or:[{name:req.query.searchdata},{email:req.query.searchdata}]},function (error,results) {
        if (error) {
            throw error
        }
        else{
            res.render('home',{users:results})
        }
    })
})
app.listen(8081)