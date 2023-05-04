import _sodium from "libsodium-wrappers";
import axios from "axios";
export default async function handler(req, res) {
  await _sodium.ready;
  const sodium = _sodium;
  let wrongCredentials = false;
  async function naiHashArgon(email, password, size, domain) {
    const pre_salt = password.substring(0, 6) + email + domain;
    var raw = sodium
      .crypto_pwhash(
        64,
        new Uint8Array(sodium.from_string(password)),
        sodium.crypto_generichash(sodium.crypto_pwhash_SALTBYTES, pre_salt),
        2,
        2e6,
        sodium.crypto_pwhash_ALG_ARGON2ID13,
        "base64"
      )
      .slice(0, 64);
    return raw;
  }

  async function getAccessKey(email, password) {
    email = email.toLowerCase();
    var access_key = await naiHashArgon(
      email,
      password,
      64,
      "novelai_data_access_key"
    );
    return access_key.substr(0, 64).replace(/\//g, "_").replace(/\+/g, "-");
  }

  async function login(email, password) {
    var key = await getAccessKey(email, password);
    // var tokenReq = $.post("https://api.novelai.net/user/login", {
    //   key: key,
    // });
    // On success
    // tokenReq.done(function (data) {
    //   var naiToken = data.accessToken;
    // });
    return key;
  }
  const data = await login(req.body.email, req.body.password);

  const key = await axios
    .post("https://api.novelai.net/user/login", {
      key: data,
    })
    .catch((err) => {
      console.log(err);
      wrongCredentials = true;
    });
  if (wrongCredentials) {
    res.status(200).json({ data: false });
  } else {
    res.status(200).json({ data: key.data.accessToken });
  }
}
