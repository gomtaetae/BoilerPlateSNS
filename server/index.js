const express = require("express");
const app = express();
const port = 5000;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const cors = require("cors");
app.use(cors());

const config = require("./config/key");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

const mongoose = require("mongoose");

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("몽고DB 연결중..."))
  .catch((err) => console.log(err));

//여기서 아이디 중복시 json을 리턴해주어서 분기처리해줘야한다.
app.post("/api/users/register", (req, res) => {
  console.log("reg",req.body)
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
      userInfo
    });
  });
});

app.post("/api/users/check", (req, res) => {
  console.log("sdfasdfasdf",req.body.password);
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        successCheck: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      console.log("isMatch",isMatch);
      if(!isMatch){
      return res.json({
        successCheck: false, 
        message: "비밀번호가 틀립니다."
      })
    }else {
      return res.status(200).json({
        successCheck: true,
      })
    }
    })
  })
})

app.post("/api/users/login", (req, res) => {
  console.log("login",req.body)
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렷습니다.",
        });
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res
          .cookie("x_auth", user.token) // .cookie('x_auth: ',user.token) 이거떄문에 에러생김
          .status(200) //user.id는 몽고디비 고유아이디
          .json({ loginSuccess: true, userId: user._id });
      });
    });

    if (!user.isVerified) {
      const Verifiedtoken = jwt.sign(user._id.toHexString(), "registerToken");
      // console.log()
      // const url = `${ip.address()}/${port}/confirmation/${Verifiedtoken}`
      const url2 = `http://localhost:3000/confirmation/${Verifiedtoken}`;
      if (err) {
        return res.json({ success: false, err });
      } else {
        console.log(user.email);
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "bitbitlegit@gmail.com",
            pass: "!bit9000",
          },
        });
        const mailOptions = {
          from: "bitbitlegit@gmail.com",
          to: user.email, //req.body.email
          subject: "안녕하세요, 이메일 인증을 해주세요.",
          html: `Please, confirm your email by clicking the following link: <a href=${url2}>${url2}</a>`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            // console.log(error);
          } else {
            // console.log(info)
          }
        });
      }
    }
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  // console.log("auth index",req.user)
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,

     //password를 받는 이유는 비밀번호 수정할떄 쓰기위해서?
    //아니면 전체를 가져오는 다른 axios 요청을 가지고 클라이언트에 보내야함
    password : req.user.password,
    isVerified: req.user.isVerified,
    isSns: req.user.isSns,
  })
});

app.get("/api/users/getConfirmation", auth, (req, res) => {
  console.log("get",req.body)
  console.log("get",req.user)
  console.log("req.user", req.user);
  console.log("getConfirm에 들어옴");
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { isVerified: true },
    (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

app.post("/api/users/del", auth, (req, res) => {
  console.log("삭제할꺼다", req.user._id);
  User.findByIdAndDelete(
    { _id: req.user._id},
    (err, user) => {
      if(err) return res.json({ success: false, err})
      return res.status(200).send({
        success:true
      })
    
  })
})

app.get("/api/users/logout", auth, (req, res) => {
  console.log("log",req.body)
  console.log(",log",req.user)
  console.log("6번 req.user", req.user);
  User.findByIdAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.get("/api/users/resend", auth, (req, res) => {
  User.findOne({ email: req.user.email }, (err, user) => {
    console.log(req.user._id);
    const Verifiedtoken = jwt.sign(user._id.toHexString(), "registerToken");
    // console.log()
    // const url = `${ip.address()}/${port}/confirmation/${Verifiedtoken}`
    // const url1 = `localhost:3000/confirmation/`
    const url2 = `http://localhost:3000/confirmation/${Verifiedtoken}`;
    if (err) {
      return res.json({ success: false, err });
    } else {
      console.log("resend 이메일", user.email);
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "bitbitlegit@gmail.com",
          pass: "!bit9000",
        },
      });
      const mailOptions = {
        from: "bitbitlegit@gmail.com",
        to: user.email, //req.body.email
        subject: "안녕하세요, 이메일 인증을 해주세요.",
        html: `Please, confirm your email by clicking the following link: <a href=${url2}>${url2}</a>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          // console.log(error);
        } else {
          // console.log(info)
        }
      });
    }
    return res.status(200).send({
      success: true,
    });
  });
});





app.post("/api/users/modify", auth, (req, res)=>{
  console.log("auth 모디파이", req.user)
  User.findOne({ _id: req.user.id }, (err, user) => {
    console.log("파인드원",user)
  if (err) return res.json({ success: false, err });

    console.log("user._id 아이디아이디", user._id)
    console.log("req.user 유저유저",req.user)
    console.log("req.body 바디바디",req.body)
  
  User.updateOne(
    {_id: user._id},
    {//$set을 해야 해당 필드만 바뀝니다. https://www.zerocho.com/category/MongoDB/post/579e2821c097d015000404dc
      $set: {       //req.body => body로 보내고
        password: req.body.password,
        image: req.body.image,
        name: req.body.name,
            },
    },
    (err,userInfo)=>{
      console.log("리턴 user",user);
      if(err) return res.json({success: false, err})
      return res.status(200).send({
        success:true,
        user : userInfo,
        })
      }
    )
  })
})




app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
