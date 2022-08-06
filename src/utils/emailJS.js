import emailjs from "emailjs-com";

const emailService = process.env.REACT_APP_EMAIJS_SERVICE;
const emailTemplateToAdmin = process.env.REACT_APP_EMAIJS_TEMPLATE_TO_ADMIN;
const emailPublicKey = process.env.REACT_APP_EMAIJS_PUBLIC_KEY;

const sendEmail = (data) => {
    console.log("Will send");
    emailjs.send('service_z169qck', 'template_wnapekn', data, "XlYJ7WT0HotdCTks0")
    .then(function(response) {
       console.log('Email sent! (SUCCESS)', response.status, response.text);
    }, function(error) {
       console.log('Email not sent (FAILED)', error);
    });
}

export { sendEmail };