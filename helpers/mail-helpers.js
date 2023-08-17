const nodemailer = require('nodemailer')

const sendMail = (email, subject, content) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.USER,
      pass: process.env.PASS,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  })

  const mailOptions = {
    from: {
      name: '丹尼購物',
      address: process.env.EMAIL_FROM
    },
    to: email,
    subject: subject,
    html: content
  }

  transporter.sendMail(mailOptions)
}

// 寄送reset驗證信
const sendPasswordResetEmail = async (email, resetToken) => {
  const subject = '密碼重置'
  const resetUrl = `${process.env.GITHUB_PAGE}/shopping_web_frontend/#/user/resetPassword?token=${resetToken}&email=${email}`
  const message = `
    <p>請點選以下連結或複製以下連結重置密碼，連結有效期限為一小時:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    `
  const content = `<h4>密碼重置</h4>${message}`

  // 寄送驗證信
  await sendMail(email, subject, content)
}

module.exports = {
  sendMail,
  sendPasswordResetEmail
}
