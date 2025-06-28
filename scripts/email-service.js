// Email Service Configuration Script
// This script helps you set up EmailJS for the contact form

// EmailJS configuration
const setupEmailService = () => {
  console.log("Setting up EmailJS for contact form...")

  // Step 1: Sign up for EmailJS
  console.log("1. Sign up for EmailJS at https://www.emailjs.com/")

  // Step 2: Create a service
  console.log("2. Create a service connecting to your email provider (Gmail, Outlook, etc.)")

  // Step 3: Create an email template
  console.log("3. Create an email template with variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}")

  // Step 4: Get your credentials
  console.log("4. Get your User ID, Service ID, and Template ID")

  // Step 5: Update the script.js file with your credentials
  console.log("5. Update the script.js file with your EmailJS credentials")

  // Example implementation
  console.log("\nExample EmailJS implementation (add to script.js):")
  console.log(`
// Initialize EmailJS
emailjs.init("YOUR_USER_ID");

// Update the sendEmail method in ContactForm class
async sendEmail(data) {
  return emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
    from_name: data.name,
    from_email: data.email,
    subject: data.subject,
    message: data.message
  });
}
  `)

  console.log("\nOnce configured, your contact form will send emails directly to your inbox!")
}

// Run the setup
setupEmailService()
