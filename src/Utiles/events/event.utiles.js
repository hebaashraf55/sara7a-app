import { EventEmitter } from "node:events";
import { sendEmail ,  emailSubject  } from "../email/sendEmail.utiles.js";
import { template } from "../email/generateHTML.js";


export const emailEvent = new EventEmitter();

emailEvent.on('confirmemail', async (data) => {
     console.log("Email event data:", data);
    await sendEmail({
            to : data.to,
            text : "Hello From Sara7a App",
            html : template (data.otp , data.firstName),
            subject : emailSubject.confirmEmail,
    })
})