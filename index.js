const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const PORT = 8080;
app.use(bodyParser());
//#region Arrays
const users = [
  {
    id: "ajn2-sa23m-cmkd2-csmc",
    name: "Suleyman",
    surname: "Dadashov",
    age: "23",
    email: "suleyman@code.edu.az",
    password: "suleyman1234",
  },
  {
    id: uuidv4(),
    name: "John",
    surname: "McDermott",
    age: "20",
    email: "john@code.edu.az",
    password: "john1234",
  },
  {
    id: uuidv4(),
    name: "Thaddeus",
    surname: "Daugherty",
    age: "32",
    email: "thaddeus@code.edu.az",
    password: "thaddeus1234",
  },
  {
    id: uuidv4(),
    name: "Gerald",
    surname: "Metz",
    age: "25",
    email: "metz@code.edu.az",
    password: "metz1234",
  },
];
const posts  = [
    {
      id: "asc-a123-cxaz-123-acasdas",
      description: "lorem ipsum dolor",
      createdOn: "17.01.2023",
      user: {
        id: "ajn2-sa23m-cmkd2-csmc",
        name: "Suleyman",
        surname: "Dadashov",
        email: "suleyman@code.edu.az"   
       }
    },
    {
        id: uuidv4(),
        description: "lorem ipsum dolor sit amet, consectetur adipis occ",
        createdOn: "17.01.2022",
        user: {
          id: "ajn2-sa23m-cmkd2-csmc",
          name: "John",
          surname: "McDermott",
          email: "jjohn@code.edu.az"   
         }
      },
      {
        id: uuidv4(),
        description: "lorem ipsum dolor sit amet",
        createdOn: "07.01.2023",
        user: {
          id: "ajn2-sa23m-cmkd2-csmc",
          name: "Suleyman",
          surname: "Dadashov",
          email: "suleyman@code.edu.az"   
         }
      }
    ]  
//#endregion

//#region Get methods
app.get("/api/users", (req, res) => {
  res.send(users);
});
app.get("/api/posts", (req, res) => {
    res.send(posts);
  });
  //#endregion
//#region post methods without login
app.post("/api/register", (req, res) => {

    const newUser = {
        id: uuidv4(),
        name: req.body.name,
        surname: req.body.surname,
        age: req.body.age,
        email: req.body.email,
        password: req.body.password
      };
    const {email} = req.body;

    if ({email} = newUser.email )
      return res
        .status(400)
        .send({ message: " Email already used!" });
    users.push(newUser);
  res.send(`User registered : ${newUser}`);
});
app.post("/api/login", (req, res) => {
    const {  email,password } = req.body;
    let user = users.find((e) => e.email === email, (p)=> p.password === password);
    if (!user) return res.status(401).send();
    if (!password || !email)
      return res
        .status(400)
        .send({ message: " Email or Password required!" });
    
    if (password) user.password = password;
    if (email) user.email = email;
    res.send({ message: "User logined!", user });
    
  });
//#endregion
//#region middleware
let isLoggedIn = false;
app.use((req, res, next) => {
  if (!isLoggedIn) {
    res.status(401).send({ message: "You must login!" });
    return;
  }
  next();
});
//#endregion
//#region post methods login
app.post("/api/logout", (req, res) => {

    const {name } = req.body;

    let user = users.find((e) => e.name === name);
    if (isLoggedIn=false) {
        res.status(200).send({ message: "You succesfully logout!" });
        return;
      }
      res.send({ message: "User logout!", user });
  
  });

app.post("/api/posts", (req, res) => {

    const {description} = req.body;
    const{id} = req.body.user
  
    let user = users.find((e) => e.id === id);
    if (isLoggedIn) {
        res.status(200).send({ message: "You must login!" });
        return;
      }
      if (!description)
      return res
        .status(400)
        .send({ message: "description required!" });
    if (description) user.description = description;
      res.send({ message: "Post succesfully added!", user });
  
  });
  //#endregion
//#region Delete methods
  app.delete("/api/posts/:id", (req, res) => {
    const { id } = req.params;
    let postIndex = posts.findIndex((p) => p.id === id);
    if (postIndex === -1) return res.status(204).send();
    let deletedPost = users.splice(postIndex, 1);
    res.send({
      message: "Post deleted!",
      user: deletedPost,
    });
  });
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  let userIndex = users.findIndex((p) => p.id === id);
  if (userIndex === -1) return res.status(204).send();
  let deletedUser = users.splice(userIndex, 1);
  res.send({
    message: "User deleted!",
    user: deletedUser,
  });
});
//#endregion
//#region Put methods
app.put("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  let post= posts.find((p) => p.id === id);
  if (!post) return res.status(204).send();
  if (!description)
    return res
      .status(400)
      .send({ message: "description required!" });
  if (description) post.description = description;
 
  res.send({ message: "Post updated!", post });
});
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, surname, email } = req.body;
  let user = users.find((p) => p.id === id);
  if (!user) return res.status(204).send();
  if (!name && !surname && !email)
    return res
      .status(400)
      .send({ message: "Name or Surname or Email required!" });
  if (name) user.name = name;
  if (surname) user.username = username;
  if (email) user.email = email;
  res.send({ message: "User updated!", user });
});
//#endregion

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

