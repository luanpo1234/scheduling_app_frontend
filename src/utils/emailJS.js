import emailjs from "emailjs-com";

const emailService = process.env.REACT_APP_EMAIJS_SERVICE;
const emailTemplateToAdmin = process.env.REACT_APP_EMAIJS_TEMPLATE_TO_ADMIN;
const emailTemplateToUser = process.env.REACT_APP_EMAIJS_TEMPLATE_TO_USER
const emailPublicKey = process.env.REACT_APP_EMAIJS_PUBLIC_KEY;


const sendEmail = (data) => {
   const templates = { toUser: emailTemplateToUser, toAdmin: emailTemplateToAdmin }
   console.log("Will send");
   const [ year, month, day, startTime, endTime ] = data.timeslot.split("-");
   const emailData = {
      actionType: data.actionType, 
      name: data.name,
      day: day,
      month: String(Number(month)+1),
      year: year,
      timeslotStart: startTime,
      timeslotEnd: endTime,
      userEmail: data.email,
      notes: data.notes,
      status: data.status,
      originUrl: data.url
      };

    emailjs.send(emailService, templates[data.emailTemplate], emailData, emailPublicKey)
    .then(function(response) {
       console.log('Email sent! (SUCCESS)', response.status, response.text);
    }, function(error) {
       console.log('Email not sent (FAILED)', error);
    });
}

export { sendEmail };