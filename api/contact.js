export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Please fill in all fields."
      });
    }

    const apiKey = process.env.RESEND_API_KEY;

    // Email to you
    const ownerEmail = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: "MK Blue Tech <onboarding@resend.dev>",
        to: ["ma0912732@gmail.com"],
        subject: `New message from ${name}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      })
    });

    if (!ownerEmail.ok) {
      const error = await ownerEmail.text();
      console.error("Owner email error:", error);

      return res.status(500).json({
        message: "Failed to send message."
      });
    }

    // Thank-you email to the visitor
    const thankYouEmail = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: "MK Blue Tech <onboarding@resend.dev>",
        to: [email],
        subject: "Thanks for reaching out — MK Blue Tech",
        html: `
          <!DOCTYPE html>
          <html>
          <body style="
            margin:0;
            padding:0;
            background:#f5f4ef;
            font-family:Arial,Helvetica,sans-serif;
          ">

            <div style="
              max-width:600px;
              margin:40px auto;
              background:#ffffff;
              border:1px solid #e5e3dc;
              border-radius:16px;
              overflow:hidden;
            ">

              <div style="
                background:#0d0d0d;
                padding:28px 32px;
                color:#ffffff;
              ">
                <div style="
                  font-size:22px;
                  font-weight:700;
                  letter-spacing:-0.5px;
                ">
                  MK<span style="color:#315fd8;">.</span>
                </div>
              </div>

              <div style="padding:40px 32px;">

                <p style="
                  margin:0 0 12px;
                  color:#777770;
                  font-size:14px;
                ">
                  Hello ${name},
                </p>

                <h1 style="
                  margin:0 0 20px;
                  color:#0d0d0d;
                  font-size:30px;
                  line-height:1.2;
                ">
                  Thanks for reaching out!
                </h1>

                <p style="
                  margin:0 0 20px;
                  color:#555550;
                  font-size:16px;
                  line-height:1.7;
                ">
                  I've received your message successfully. Thank you for taking
                  the time to get in touch with me.
                </p>

                <div style="
                  margin:28px 0;
                  padding:20px;
                  background:#f5f4ef;
                  border-left:4px solid #315fd8;
                  border-radius:8px;
                ">
                  <p style="
                    margin:0;
                    color:#555550;
                    font-size:14px;
                    line-height:1.6;
                  ">
                    I'll review your message and get back to you as soon as possible.
                  </p>
                </div>

                <a
                  href="https://moadkhedr.vercel.app/"
                  style="
                    display:inline-block;
                    padding:13px 22px;
                    background:#315fd8;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:8px;
                    font-size:14px;
                    font-weight:600;
                  "
                >
                  Visit My Portfolio
                </a>

              </div>

              <div style="
                padding:24px 32px;
                border-top:1px solid #e5e3dc;
                color:#999890;
                font-size:12px;
                line-height:1.6;
              ">
                <strong style="color:#555550;">MK Blue Tech</strong><br>
                Build. Debug. Ship.
              </div>

            </div>

          </body>
          </html>
        `
      })
    });

    if (!thankYouEmail.ok) {
      const error = await thankYouEmail.text();
      console.error("Thank-you email error:", error);

      // Your email was already sent, so don't report the whole request as failed.
      return res.status(200).json({
        message: "Message received, but the confirmation email could not be sent."
      });
    }

    return res.status(200).json({
      message: "Message sent successfully."
    });

  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      message: "Something went wrong."
    });
  }
}