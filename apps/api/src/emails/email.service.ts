import { transporter } from "./transporter";

import { verifyEmailTemplate } from "./verify-email";
import { passwordResetTemplate } from "./password-reset";
import { welcomeTemplate } from "./welcome";
import { kycApprovedTemplate } from "./kyc-approved";
import { kycRejectedTemplate } from "./kyc-rejected";
import { transferTemplate } from "./transfer";
import { passwordResetSuccessTemplate } from "./password-reset-success";

export const emailService = {

  async sendVerificationEmail(

    email: string,

    firstName: string,

    otp: string

  ) {

    return transporter.sendMail({

      to: email,

      subject: "Verify Your Email",

      html: verifyEmailTemplate(

        firstName,

        otp

      ),

    });

  },

  async sendPasswordResetEmail(

    email: string,

    firstName: string,

    otp: string

  ) {

    return transporter.sendMail({

      to: email,

      subject: "Password Reset",

      html: passwordResetTemplate(

        firstName,

        otp

      ),

    });

  },

  async sendWelcomeEmail(

    email: string,

    firstName: string

  ) {

    return transporter.sendMail({

      to: email,

      subject: "Welcome to Reality Capital Bank",

      html: welcomeTemplate(

        firstName

      ),

    });

  },

  async sendKycApprovedEmail(

    email: string,

    firstName: string

  ) {

    return transporter.sendMail({

      to: email,

      subject: "KYC Approved",

      html: kycApprovedTemplate(

        firstName

      ),

    });

  },

  async sendKycRejectedEmail(

    email: string,

    firstName: string,

    reason: string

  ) {

    return transporter.sendMail({

      to: email,

      subject: "KYC Rejected",

      html: kycRejectedTemplate(

        firstName,

        reason

      ),

    });

  },

  async sendTransferEmail(

    email: string,

    firstName: string,

    amount: string,

    reference: string

  ) {

    return transporter.sendMail({

      to: email,

      subject: "Transfer Successful",

      html: transferTemplate(

        firstName,

        amount,

        reference

      ),

    });

  },

  async sendPasswordResetSuccessEmail(

  email: string,

  firstName: string

) {

  return transporter.sendMail({

    to: email,

    subject: "Password Changed Successfully",

    html: passwordResetSuccessTemplate(

      firstName

    ),

  });

},

};