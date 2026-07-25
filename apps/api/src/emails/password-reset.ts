import { baseTemplate } from "./templates/base.template";

export function passwordResetTemplate(

  firstName: string,

  otp: string

) {

  return baseTemplate({

    title: "Password Reset",

    heading: `Hello ${firstName},`,

    content: `

<p>

We received a request to reset your password.

</p>

<p>

Use the OTP below to continue.

</p>

<div
style="
margin:35px 0;
text-align:center;
"
>

<div
style="
display:inline-block;
background:#DC2626;
color:white;
padding:20px 40px;
border-radius:10px;
font-size:36px;
font-weight:bold;
letter-spacing:10px;
"
>

${otp}

</div>

</div>

<p>

This code expires in

<strong>10 minutes</strong>.

</p>

<p>

If you didn't request a password reset,

please ignore this email.

</p>

`,

  });

}