import { EventEmitter } from "node:events";
import { sendEmail ,  emailSubject  } from "../email/sendEmail.utiles.js";
import { template } from "../email/generateHTML.js";

export const emailEvent = new EventEmitter();

emailEvent.on('confirmemail', async (data) => {
    await sendEmail({
            to : data.to,
            subject : emailSubject.confirmEmail,
            html : template (data.otp , data.firstName),
    })
})

emailEvent.on("forgetPassword", async(data) => {
    await sendEmail({
            to : data.to,
            subject : emailSubject.resetPassword,
            html : template (data.otp, data.firstName , emailSubject.resetPassword),
    })
})