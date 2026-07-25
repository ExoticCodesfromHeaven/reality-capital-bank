import { baseTemplate } from "./templates/base.template";

export function kycRejectedTemplate(

  firstName: string,

  reason: string

) {
    

  return baseTemplate({

    title: "KYC Rejected",

    heading: `Hello ${firstName},`,

    content: `

<p>

Unfortunately your KYC verification could not be approved.

</p>

<p>

Reason:

</p>

<div
style="
padding:15px;
background:#FEF2F2;
border-left:4px solid #DC2626;
margin:20px 0;
"
>

${reason}

</div>

<p>

Please correct the issue and upload your documents again.

</p>

`,

  });

}