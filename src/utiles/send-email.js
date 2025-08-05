import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { EventEmitter } from "node:events";
import redis from "./redis.js";
import { customAlphabet } from "nanoid";
const generateOTP = customAlphabet("0123456789mnbvwqcxasfdgoje", 6);
const salt = await bcrypt.genSalt(10);

async function SendEmail({ to, subject, html }) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_GMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const Info = await transporter.sendMail({
      from: process.env.APP_GMAIL,
      to: to,
      subject: subject,
      html: html,
    });
    console.log(Info.response);
  } catch (err) {
    console.log(err);
  }
}

export const emittir = new EventEmitter();
emittir.on("sendemail", (args) => {
  SendEmail(args);
});

const createAndSendOTP = async (User, email) => {
  const OTP = generateOTP();
  const html = `
  <div style="font-family: 'Cairo', sans-serif; background-color: #e6f7ff; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
<img src="https://i.postimg.cc/nzQwGcXc/dental-logo.png" alt="Dental Clinic Logo" style="max-width: 100px;" />
        <h2 style="color: #007BFF; margin-top: 10px;">Dental Clinic</h2>
      </div>
      <p style="font-size: 16px; color: #333;">مرحباً بك 👋،</p>
      <p style="font-size: 16px; color: #333;">شكرًا لتسجيلك معنا! نعمل جاهدين لنمنحك أفضل رعاية لأسنانك.</p>
      <p style="font-size: 16px; color: #333;">رمز التفعيل الخاص بك هو:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; background-color: #007BFF; color: #fff; font-size: 28px; font-weight: bold; padding: 12px 24px; border-radius: 8px; letter-spacing: 4px;">${OTP}</span>
      </div>
      <p style="font-size: 16px; color: #333;">يرجى إدخال هذا الرمز في التطبيق لتأكيد حسابك.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 12px; color: #999;">إذا لم تطلب هذا الكود، يمكنك تجاهل هذه الرسالة بأمان.</p>
    </div>
  </div>
`;

  await redis.set(`otp_${email}`, OTP, "EX", 60 * 2);
  User.otps.confirmation = await bcrypt.hash(OTP, salt);
  await User.save();
  emittir.emit("sendemail", { to: email, subject: "confirmation email", html });
};
const createAndSendOTP_Password = async (User, email) => {
  const OTP = generateOTP();
  const resetHtml = `
  <div style="font-family: 'Cairo', sans-serif; padding: 20px; background-color: #e6f2ff;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
      
      <div style="text-align: center;">
        <img src="https://i.imgur.com/2nCt3Sbl.png" alt="Dental Clinic" style="width: 80px; margin-bottom: 20px;" />
      </div>

      <h2 style="color: #004080; text-align: center;">طلب إعادة تعيين كلمة المرور</h2>

      <p style="font-size: 16px; color: #444; text-align: center;">
        تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بك في <strong>عيادة الابتسامة الجميلة</strong>.
        الرجاء استخدام رمز التحقق (OTP) التالي لإتمام العملية:
      </p>

      <div style="margin: 30px 0; padding: 20px; background-color: #f1f8ff; border-left: 6px solid #007BFF; border-radius: 8px; text-align: center;">
        <h1 style="font-size: 38px; letter-spacing: 5px; color: #007BFF;">${OTP}</h1>
      </div>

      <p style="font-size: 14px; color: #777; text-align: center;">
        الرمز صالح لفترة محدودة فقط. إذا لم تطلب ذلك، يمكنك تجاهل هذه الرسالة.
      </p>

      <hr style="margin: 30px 0;" />

      <p style="font-size: 12px; color: #aaa; text-align: center;">
        © 2025 عيادة الابتسامة الجميلة. جميع الحقوق محفوظة.
      </p>
    </div>
  </div>
`;

  await redis.set(`otp_${email}`, OTP, "EX", 60 * 10);
  User.otps.reset = await bcrypt.hash(OTP, salt);
  await User.save();
  emittir.emit("sendemail", {
    to: email,
    subject: "Reset Password",
    html: resetHtml,
  });
};

const emailBooks = async (email) => {
  const html = `
<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8" />
  <title>تأكيد الحجز - Dental Clinic</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f9fc; direction: rtl; text-align: center;">

  <div style="background-color: #ffffff; padding: 30px; max-width: 600px; margin: 50px auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h1 style="color: #0d6efd; margin-bottom: 10px;">🦷 Dental Clinic</h1>
    <h2 style="color: #198754;">✅ تم تسجيل الحجز بنجاح</h2>
    
    <p style="font-size: 1.1rem; color: #333;">شكرًا لاختياركم <strong>Dental Clinic</strong>.</p>
    <p style="font-size: 1rem; color: #555;">سيتم التواصل معكم هاتفيًا أو عبر البريد لتأكيد الموعد .</p>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
    
    <p style="font-size: 0.9rem; color: #999;">يرجى عدم الرد على هذا البريد. لأي استفسار، تواصل معنا مباشرة عبر الموقع أو الهاتف.</p>
  </div>

</body>
</html>
`;

  emittir.emit("sendemail", {
    to: email,
    subject: "confirm Booking",
    html: html,
  });
};
const revealDay = async (email, date, name) => {
  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>تذكير بموعد الكشف</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f6f6f6;
      color: #333;
      padding: 20px;
      text-align: center;
    }

    .container {
      max-width: 600px;
      margin: auto;
      background-color: #fff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    h1 {
      color: #0066cc;
      margin-bottom: 20px;
    }

    .message {
      font-size: 18px;
      line-height: 1.7;
    }

    .highlight {
      color: #d32f2f;
      font-weight: bold;
    }

    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔔 تذكير بموعد الكشف</h1>
    <p class="message">
      عزيزي <span class="highlight">${name}</span>،
      <br><br>
      نذكّرك أن <span class="highlight">${date}</span> هو موعد الكشف الخاص بك في العيادة.
      <br>
      نرجو الحضور في الموعد المحدد لضمان راحتك وسرعة تقديم الخدمة.
      <br><br>
      نتمنى لك دوام الصحة والعافية.
    </p>
    <div class="footer">
     Dental Clinic &copy; 2025
    </div>
  </div>
</body>
</html>
`;
  emittir.emit("sendemail", {
    to: email,
    subject: "تذكير بموعد الكشف",
    html: html,
  });
};

export {
  SendEmail,
  createAndSendOTP,
  createAndSendOTP_Password,
  emailBooks,
  revealDay,
};
