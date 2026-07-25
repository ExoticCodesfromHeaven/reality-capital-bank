import { baseTemplate } from "./templates/base.template";

export function kycApprovedTemplate(

  firstName: string

) {

  return baseTemplate({

    title: "KYC Approved",

    heading: `Congratulations ${firstName}!`,

    content: `

<p>

Your identity verification has been approved.

</p>

<p>

Your account is now fully verified and all banking services have been unlocked.

</p>

<p>

Thank you for choosing Reality Capital Bank.

</p>

`,

  });

}