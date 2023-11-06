const ElasticEmail = require("@elasticemail/elasticemail-client");
const dotenv = require("dotenv");
dotenv.config();
const { ELASTICEMAIL_API_KEY, ELASTICEMAIL_FROM } = process.env;
const defaultClient = ElasticEmail.ApiClient.instance; // создается клиент для отправки

const { apikey } = defaultClient.authentications;
apikey.apiKey = ELASTICEMAIL_API_KEY; // с клиента получаем апики
const api = new ElasticEmail.EmailsApi(); // обект котрорый занимается отправкой писем

const callback = function (error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log("API called successfully.");
  }
};
const sendEmail = function (data) {
  const email = ElasticEmail.EmailMessageData.constructFromObject({
    Recipients: [new ElasticEmail.EmailRecipient(data.to)], // адрес с которого будет приходить письмо
    Content: {
      Body: [
        ElasticEmail.BodyPart.constructFromObject({
          ContentType: "HTML",
          Content: data.html,
        }),
      ],
      Subject: data.subject,
      From: ELASTICEMAIL_FROM,
    },
  });

  api.emailsPost(email, callback);
};

module.exports = { sendEmail };
