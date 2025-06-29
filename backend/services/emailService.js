const SibApiV3Sdk = require("sib-api-v3-sdk");
const dotenv = require("dotenv");

dotenv.config();

const defaultClient = process.env.DEFAULT_CLIENT;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.EMAIL_API_KEY; // Replace with your actual API key

const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

const emailCampaign = new SibApiV3Sdk.CreateEmailCampaign({
  name: "Campaign sent via the API",
  subject: "My subject",
  sender: {
    name: "From Name",
    email: "ritiksg143@gmail.com",
  },
  type: "classic",
  htmlContent:
    "<html><body><h1>Congratulations!</h1><p>You successfully sent this example campaign via the Brevo API.</p></body></html>",

  scheduledAt: "2025-06-21 15:00:00",
});

apiInstance.createEmailCampaign(emailCampaign).then(
  function (data) {
    console.log("API called successfully. Returned data: ", data);
  },
  function (error) {
    console.error("Error while creating campaign:", error);
  }
);
