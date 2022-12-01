/* eslint-disable object-curly-newline */
/* eslint-disable prefer-regex-literals */
const { selectUserName, selectUser } = require('../model/userModel');

// funkcija validuoja registracijos formą, naudojamas su REST routeriu
async function regValidator(req, res, next) {
  const { username, password, password2 } = req.body;
  if (username.trim().length < 3 || username.trim().length > 29) {
    return res
      .status(400)
      .json({ error: true, message: 'Vartotojo vardas turi būti tarp 3 ir 30 simbolių ilgio' });
  }
  if (password.trim().length < 3 || password.trim().length > 29) {
    return res
      .status(400)
      .json({ error: true, message: 'Slaptažodis turi būti tarp 3 ir 30 simbolių ilgio' });
  }
  if (password !== password2) {
    return res.status(400).json({ error: true, message: 'Slaptažodžiai nesutampa' });
  }
  const [resp] = await selectUserName(username);
  if (resp) {
    return res.status(400).json({ error: true, message: 'vartotojo vardas užimtas' });
  }
  return next();
}

// funkcija tikrina, ar duomenis siuncia registruotas vartotojas.
async function userValidator(secret) {
  const [user] = await selectUser(secret);
  return user;
}

// funkcija tikrina, ar nera tusciu duomenu lauku.
function postValidator(postObj) {
  const { text, discId } = postObj;
  if (text.trim().length < 1) {
    return 'Cant send empty post';
  }
  if (!discId) {
    return 'Something wrong. Please reload page';
  }
  return false;
}

// tikrina ar url adrese yra img
function isImgLink(url) {
  if (typeof url !== 'string') return false;
  return url.match(/^(http|https):\/\/+[\www\d]+\.[\w]+(\/[\w\d]+)?/gim) != null;
}

module.exports = { regValidator, userValidator, postValidator, isImgLink };
