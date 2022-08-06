import emailjs from "emailjs-com";

const sendEmail = (data) => {
    console.log("Will send");
    emailjs.send('service_z169qck', 'template_wnapekn', data, "XlYJ7WT0HotdCTks0")
    .then(function(response) {
       console.log('SUCCESS!', response.status, response.text);
    }, function(error) {
       console.log('FAILED...', error);
    });
}

export { sendEmail };