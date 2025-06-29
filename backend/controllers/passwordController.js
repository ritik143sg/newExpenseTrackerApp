const { v4: uuidv4 } = require("uuid");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const { User } = require("../models");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const ForgotPasswordRequest = require("../models/ForgotPasswordRequestsModel");
const { where } = require("sequelize");

// Step 1: Configure Brevo API key
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.EMAIL_API_KEY;

// Step 2: Define controller function
const getPassword = async (req, res) => {
  const user = req.body;

  try {
    const uid = uuidv4();
    const reset = await ForgotPasswordRequest.create({
      id: uid,
      isActive: true,
    });

    // Step 3: Instantiate the API
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // Step 4: Set sender and receiver details
    const sender = {
      email: "ritiksg143@gmail.com", // This must be a Brevo-verified sender
      name: "TestApp",
    };

    const receivers = [
      {
        email: user.email, // Receiver's email from request body
      },
    ];

    // Step 5: Send the transactional email
    const sendEmail = await apiInstance.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Test Email from Brevo",
      textContent:
        "This is a plain text fallback for email clients that do not support HTML.",
      htmlContent: `
        <html>
          <body>
            <h1>Hello, ${user.email},GET Ready,"${process.env.LOCALHOST}/password/resetpassword/${uid}"</h1>
            <p>This is a test transactional email sent via the Brevo API.</p>
          </body>
        </html>
      `,
    });

    // Step 6: Send success response
    res.status(200).json({ message: "Email sent successfully", sendEmail });
  } catch (error) {
    // Handle API or logic errors
    console.error("Error while sending email:", error);
    res.status(500).json({ error: error.message });
  }
};

const setPassword = async (req, res) => {
  const id = req.params.id;

  try {
    const reset = await ForgotPasswordRequest.findByPk(id);
    console.log(reset);

    if (reset && reset.isActive == true) {
      res.sendFile(path.join(__dirname, "..", "public", "index.html"));

      await ForgotPasswordRequest.update(
        { isActive: false },
        {
          where: { id: id },
        }
      );
    }
  } catch (error) {
    res.json({ error: error });
  }
};

module.exports = { getPassword, setPassword };
