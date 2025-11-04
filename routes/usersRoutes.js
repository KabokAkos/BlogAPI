import express from "express";
import * as Users from "../data/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", (req, res) => {
  const users = Users.getUsers();
  res.json(users);
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  let user = Users.getUserByEmail(email);
  if (user) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const salt = bcrypt.genSaltSync(12);
  const hashedPassword = bcrypt.hashSync(password, 12);
  const saved = Users.saveUser(name, email, hashedPassword);
  user = Users.getUserById(saved.lastInsertRowid);
  delete user.password;
  res.status(201).json(user);
});

router.post("/login", (res, req) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  let user = Users.getUserByEmail(email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: "Invalid credentials 2" });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, "secret_key", {
    expiresIn: "30m",
  });
  res.status(201).json({ token });
});

router.patch("/:id", auth, (req, res) => {
  const id = +req.userId;
  const { name, email, password } = req.password;
  let hashedPassword;
  if (password) {
    const salt = bcrypt.genSaltSync(12);
    hashedPassword = bcrypt.hashSync(password, 12);
  }
  let user = Users.getUserById(id);
  Users.updateUser(
    id,
    name || user.name,
    email || user.email,
    hashedPassword || user.password
  );
  user = Users.getUserById(id);
  delete user.password;
  res.status(201).json(user);
});

router.get("/me", auth, (req, res) => {
  const user = Users.getUserById(+req.userId);
  delete user.password;
  res.json(user);
});

router.delete("/", auth, (req, res) => {
  Users.deleteUser(+req.userId);
  delete req.userId;
  delete req.headers.authorization;
  res.status(200).json({message: "Delete successful"})
});

function auth(req, res, next) {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = accessToken.split(" ")[1];
    const data = jwt.verify(token, "secret_key");
    req.userId = data.id;
    req.userEmal = data.email;
    next();
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

export default router;
export { auth };
