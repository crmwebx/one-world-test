const joi = require("joi");
const config = require("config");
var aad = require("azure-ad-jwt");
const validateReg = (req, res, next) => {
  const schema = joi.object().keys({
    firstName: joi.string().min(3).max(30).required(),
    lastName: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).max(10).required(),
  });

  joi.validate(req.body, schema, (err, val) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    next();
  });
};

const validateLogin = (req, res, next) => {
  const schema = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(4).max(100).required(),
  });

  joi.validate(req.body, schema, (err, value) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }

    next();
  });
};
const validateContact = (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const schema = joi.object().keys({
      contactId: joi.string().min(2).required(),
    });
    joi.validate({ contactId }, schema, (err, value) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }

      const token = req.headers["authorization"].split(" ")[1];
      aad.verify(token, null, function (err, result) {
        if (result) {
          next();
        } else {
          return res.status(401).json({
            error: config.get("InvalidToken"),
          });
        }
      });
    });
  } catch (error) {
    return res.status(401).json({
      error: config.get("TokenMissing"),
    });
  }
};

const validateContactSave = (req, res, next) => {
  try {
    const contactId = req.body.contactid;
    // const birthday = req.body.birthdate;
    const schema = joi.object().keys({
      contactId: joi.string().min(2).required(),
      // birthday: joi.string().required(),
    });
    joi.validate({ contactId }, schema, (err, value) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }

      const token = req.headers["authorization"].split(" ")[1];
      aad.verify(token, null, function (err, result) {
        if (result) {
          next();
        } else {
          return res.status(401).json({
            error: config.get("InvalidToken"),
          });
        }
      });
    });
  } catch (error) {
    return res.status(401).json({
      error: config.get("TokenMissing"),
    });
  }
};

const validateClassDetails = (req, res, next) => {
  try {
    const contactId = req.params.contactId;

    const schema = joi.object().keys({
      contactId: joi.string().min(2).required(),
    });
    joi.validate({ contactId }, schema, (err, value) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }

      const token = req.headers["authorization"].split(" ")[1];
      aad.verify(token, null, function (err, result) {
        if (result) {
          next();
        } else {
          return res.status(401).json({
            error: config.get("InvalidToken"),
          });
        }
      });
    });
  } catch (error) {
    return res.status(401).json({
      error: config.get("TokenMissing"),
    });
  }
};

const validateToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    aad.verify(token, null, function (err, result) {
      if (result) {
        next();
      } else {
        return res.status(401).json({
          error: config.get("InvalidToken"),
        });
      }
    });
  } catch (error) {
    return res.status(401).json({
      error: config.get("TokenMissing"),
    });
  }
};

module.exports = {
  validateReg,
  validateLogin,
  validateContact,
  validateContactSave,
  validateClassDetails,
  validateToken,
};
