const jwt = require("jsonwebtoken");
require("dotenv").config();

class Payload {
  /**
   * @param {string} id
   * @param {string} email
   * @param {string} firstName
   * @param {string} role
   */
  constructor(id, email, firstName, role) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.role = role;
  }

  toObject() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      role: this.role,
    };
  }

  static fromObject(obj) {
    return new Payload(obj.id, obj.email, obj.firstName, obj.role);
  }
}

const sign = (/** @type {Payload} */ payload) => {
  try {
    const accessToken = jwt.sign(payload.toObject(), process.env.JWt_SECRET);

    return accessToken;
  } catch (error) {
    throw new Error(error.message);
  }
};

const verify = async (authHeader) => {
  try {
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new Error("Token not found in auth header");
    }
    const token = authHeader.split(" ")[1];
    const payload = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWt_SECRET.secret, (err, decoded) => {
        if (err) {
          reject(new Error("Invalid token"));
        } else {
          resolve(decoded);
        }
      });
    });

    if (payload) {
      return Payload.fromObject(payload);
    } else {
      throw new Error("Unable to verify token");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { sign, verify, Payload };
