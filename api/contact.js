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

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`
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

    if (!response.ok) {
      const error = await response.text();
      console.error(error);

      return res.status(500).json({
        message: "Failed to send email."
      });
    }

    return res.status(200).json({
      message: "Message sent successfully."
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong."
    });
  }
}