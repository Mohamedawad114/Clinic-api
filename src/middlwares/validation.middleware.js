import joi from "joi";

function validateUser(obj) {
  const schema = joi.object({
    firstName: joi.string().required().trim().min(6).messages({
      "string.base": "First name must be a string",
      "string.min": "First name should be at least 6 characters",
      "any.required": "First name is required",
    }),
    lastName: joi.string().required().trim().min(4).messages({
      "string.base": "Last name must be a string",
      "string.min": "Last name should be at least 4 characters",
      "any.required": "Last name is required",
    }),
    email: joi.string().email().required().trim().lowercase().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
    password: joi.string().min(6).required().messages({
      "string.min": "Password should be at least 6 characters",
      "any.required": "Password is required",
    }),
    phone: joi
      .string()
      .max(11)
      .regex(/^01[0|1|2|5]\d{8}$/)
      .required()
      .messages({
        "any.required": "phone is required",
        "string.pattern.base": "Invalid phone number",
      }),
    isAdmin: joi.boolean().default(false),
    gender: joi.string().valid("male", "female"),
    age: joi.number().required().min(16).max(100).messages({
      "number.base": "Age must be a number",
      "number.min": "Age must be at least 18",
      "number.max": "Age must be less than or equal to 100",
      "any.required": "Age is required",
    }),
  });

  return schema.validate(obj, { abortEarly: false });
}
function validateupdateUser(obj) {
  const schema = joi.object({
    firstName: joi.string().trim().min(6).messages({
      "string.base": "First name must be a string",
      "string.min": "First name should be at least 6 characters",
      "any.required": "First name is required",
    }),
    lastName: joi.string().trim().min(4).messages({
      "string.base": "Last name must be a string",
      "string.min": "Last name should be at least 4 characters",
      "any.required": "Last name is required",
    }),
    email: joi.string().email().trim().lowercase().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
    phone: joi
      .string()
      .max(11)
      .regex(/^01[0|1|2|5]\d{8}$/)
      .messages({
        "any.required": "phone is required",
        "string.pattern.base": "Invalid phone number",
      }),
  });

  return schema.validate(obj, { abortEarly: false });
}
function validateUserLogin(obj) {
  const schema = joi.object({
    email: joi.string().email().required().trim().lowercase().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
    password: joi.string().min(6).required().messages({
      "string.min": "Password should be at least 6 characters",
      "any.required": "Password is required",
    }),
  });

  return schema.validate(obj, { abortEarly: false });
}
function validatePassword(password) {
  const schema = joi.object({
    password: joi.string().min(6).required().messages({
      "string.min": "Password should be at least 6 characters",
      "any.required": "Password is required",
    }),
  });

  return schema.validate({ password }, { abortEarly: false });
}

function validateupdatePassword(obj) {
  const schema = joi.object({
    oldPassword: joi.string().min(6).required().messages({
      "string.min": "Password should be at least 6 characters",
      "any.required": "Password is required",
    }),
    newPassword: joi
      .string()
      .min(6)
      .invalid(joi.ref("oldPassword"))
      .required()
      .messages({
        "string.min": "Password should be at least 6 characters",
        "any.required": "Password is required",
        "any.invalid": "shouldn't match old password",
      }),
  });

  return schema.validate(obj, { abortEarly: false });
}

////////////////////
function validatedoctor(obj) {
  const schema = joi.object({
    firstName: joi.string().required().trim().min(4).messages({
      "string.base": "First name must be a string",
      "string.min": "First name should be at least 4 characters",
      "any.required": "First name is required",
    }),
    lastName: joi.string().required().trim().min(4).messages({
      "string.base": "Last name must be a string",
      "string.min": "Last name should be at least 4 characters",
      "any.required": "Last name is required",
    }),
    email: joi
      .string()
      .email()
      .required()
      .trim()
      .regex(/^[a-zA-Z0-9-_.+#]+@gmail.com$/)
      .lowercase()
      .messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
      }),
    phone: joi
      .string()
      .regex(/^01[0|1|2|5]\d{8}$/)
      .required()
      .messages({
        "any.required": "phone is required",
        "string.pattern.base": "Invalid phone number",
      }),
    Bio: joi.string().required().trim(),
    imageUrl: joi.string().uri().trim().default(""),
    gender: joi.string().valid("male", "female"),
    age: joi.number().required().min(24).messages({
      "number.base": "Age must be a number",
      "number.min": "Age must be at least 24",
      "any.required": "Age is required",
    }),
  });

  return schema.validate(obj, { abortEarly: false });
}
function validatedupdatedoctor(obj) {
  const schema = joi.object({
    firstName: joi.string().trim().min(6).messages({
      "string.base": "First name must be a string",
      "string.min": "First name should be at least 6 characters",
    }),
    lastName: joi.string().trim().min(4).messages({
      "string.base": "Last name must be a string",
      "string.min": "Last name should be at least 4 characters",
    }),
    email: joi.string().email().trim().lowercase().messages({
      "string.email": "Invalid email format",
    }),
    phone: joi
      .string()
      .max(11)
      .regex(/^01[0|1|2|5]\d{8}$/)
      .messages({
        "string.pattern.base": "Invalid phone number",
      }),
    imageUrl: joi.string().uri().trim().default(""),
    Bio: joi.string().trim(),
  });

  return schema.validate(obj, { abortEarly: false });
}
////////////////////
function validateBook(obj) {
  const schema = joi.object({
    fullName: joi.string().required().trim().min(4).messages({
      "string.base": "First name must be a string",
      "string.min": "First name should be at least 4 characters",
      "any.required": "First name is required",
    }),
    phone: joi
      .string()
      .max(11)
      .regex(/^01[0|1|2|5]\d{8}$/)
      .required()
      .messages({
        "any.required": "phone is required",
        "string.pattern.base": "Invalid phone number",
      }),
    age: joi.number().required().messages({
      "number.base": "Age must be a number",
      "any.required": "Age is required",
    }),
    date: joi.date().greater("now").required(),
    Comment: joi.string().required().messages({
      comment: "Tell us about your problem",
    }),
    images: joi.string().trim().uri().default(""),
  });

  return schema.validate(obj, { abortEarly: false });
}
function validateadvice(obj) {
  const schema = joi.object({
    content: joi.string(),
    imageUrl: joi.string().trim().uri().default(""),
    doctorId: joi.string().required().trim(),
  });

  return schema.validate(obj, { abortEarly: false });
}
function validateClinic(obj) {
  const schema = joi.object({
    address: joi.string().min(3).max(100).trim().required(),
    phone: joi.string().required(),
    aboutUs: joi.string().min(10).trim().required(),
    working_Hours: joi.string().min(3).max(100).trim().required(),
    email: joi.string().trim().lowercase().required().messages({
      "any.required": "Email is required",
    }),
  });
  return schema.validate(obj, { abortEarly: false });
}
function validateupdateClinic(obj) {
  const schema = joi.object({
    address: joi.string().min(3).max(100).trim(),
    phone: joi.string(),
    aboutUs: joi.string().min(10).trim(),
    working_Hours: joi.string().min(3).max(100).trim(),
    email: joi.string().trim().lowercase(),
  });
  return schema.validate(obj, { abortEarly: false });
}
function reviewValidation(obj) {
  const schema = joi.object({
    content: joi.string().max(1000).optional(),
    stars: joi.number().integer().min(1).max(5).required(),
  });
  return schema.validate(obj);
}

export {
  validateBook,
  validateClinic,
  validateUser,
  validateadvice,
  validatedoctor,
  validatedupdatedoctor,
  validateupdateUser,
  validateUserLogin,
  validateupdateClinic,
  reviewValidation,
  validateupdatePassword,
  validatePassword,
};
