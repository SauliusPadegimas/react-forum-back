const { uid } = require('uid');
const { hashString, compareHash } = require('../utils/hash');
const { insertUser, selectUser, selectUserName } = require('../model/userModel');

async function saveUser(req, res) {
  const { username, password } = req.body;
  const hashedPass = await hashString(password);
  const secret = uid();
  try {
    const resp = await insertUser({ secret, username, password: hashedPass });
    console.log('resp from mysql ===', resp);
    res.status(201).json({
      error: false,
      message: `Naujas vartotojas ${username} sukurtas. Dabar galite prisijungti`,
    });
  } catch (error) {
    console.log('error ===', error);
    res.status(400).json({
      error: true,
      message: error,
    });
  }
}

async function getUser(req, res) {
  const { secret } = req.params;
  try {
    const [user] = await selectUser(secret);
    res.json({ error: false, username: user.username });
  } catch (error) {
    res.status(404).json({ error: true, message: 'user not found' });
  }
}

async function loginUser(req, res) {
  const { username, password } = req.body;
  try {
    const [user] = await selectUserName(username);
    if (!user) throw new Error('Blogi prisijungimo duomenys');
    const hashedpass = user.password;
    const result = await compareHash(password, hashedpass);
    if (!result) throw new Error('Blogi prisijungimo duomenys');
    res.send({ error: false, secret: user.secret });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
}

module.exports = {
  saveUser,
  loginUser,
  getUser,
};
