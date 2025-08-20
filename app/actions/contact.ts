"use server"

import { Resend } from "resend"

const resend = new Resend('re_TMTKt1ER_MaWyCGq9v3vuNJxXGtgypUJ4')

export async function sendContactEmail(prevState: any, formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const message = formData.get("message") as string

  // Validation
  if (!name || !email || !message) {
    return {
      success: false,
      error: true,
      message: "Please fill in all required fields.",
    }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: true,
      message: "Please enter a valid email address.",
    }
  }

  try {
    await resend.emails.send({
      from: "ELICS Contact <onboarding@resend.dev>", // Fixed format: Name <email@domain.com>
      to: "msroyenterpriseindia@gmail.com",
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">Message:</h3>
            <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #84cc16; border-radius: 4px;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px;">
            This message was sent from the ELICS website contact form.
          </p>
        </div>
      `,
    })

    return {
      success: true,
      error: false,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Email sending error:", error)
    return {
      success: false,
      error: true,
      message: "Failed to send message. Please try again or contact us directly.",
    }
  }
}
