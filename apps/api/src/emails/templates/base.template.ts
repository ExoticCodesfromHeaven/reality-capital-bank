interface EmailLayoutOptions {

  title: string;

  heading: string;

  content: string;

}

export function baseTemplate({

  title,

  heading,

  content,

}: EmailLayoutOptions) {

  return `

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8"/>

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
/>

<title>${title}</title>

</head>

<body
style="
margin:0;
padding:0;
background:#F4F7FB;
font-family:Arial,Helvetica,sans-serif;
color:#1F2937;
"
>

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
background:#F4F7FB;
padding:50px 15px;
"
>

<tr>

<td align="center">

<table
width="620"
cellpadding="0"
cellspacing="0"
style="
width:100%;
max-width:620px;
background:#FFFFFF;
border-radius:18px;
overflow:hidden;
box-shadow:0 12px 35px rgba(0,0,0,.08);
"
>

<tr>

<td
style="
background:#0B1F3A;
padding:40px;
text-align:center;
"
>

<img

src="${process.env.CLOUDINARY_LOGO_WHITE}"

alt="Reality Capital Bank"

width="80"

style="
display:block;
margin:auto;
margin-bottom:15px;
"

>

<h1
style="
margin:0;
color:#FFFFFF;
font-size:28px;
font-weight:700;
letter-spacing:.3px;
"
>

Reality Capital Bank

</h1>

<p
style="
margin-top:10px;
margin-bottom:0;
font-size:15px;
color:#E5E7EB;
"
>

Secure • Modern • Trusted Banking

</p>

</td>

</tr>

<tr>

<td
style="
height:5px;
background:#D4AF37;
"
>

</td>

</tr>

<tr>

<td
style="
padding:45px 45px 25px;
"
>

<h2
style="
margin-top:0;
margin-bottom:25px;
font-size:28px;
color:#0B1F3A;
font-weight:700;
"
>

${heading}

</h2>

<div
style="
font-size:16px;
line-height:1.8;
color:#4B5563;
"
>

${content}

</div>

</td>

</tr>

<tr>

<td
style="
padding:0 45px 35px;
"
>

<hr
style="
border:none;
border-top:1px solid #E5E7EB;
margin:15px 0 30px;
"
/>

<table
width="100%"
cellpadding="0"
cellspacing="0"
>

<tr>

<td
style="
font-size:14px;
color:#6B7280;
line-height:1.7;
"
>

<strong
style="
color:#0B1F3A;
"
>

Security Reminder

</strong>

<br><br>

Reality Capital Bank will never ask for your password, OTP, PIN or card details via email.

If you receive a suspicious email, please contact our support team immediately.

</td>

</tr>

</table>

</td>

</tr>

<tr>

<td
style="
background:#F8FAFC;
padding:35px;
text-align:center;
"
>

<p
style="
margin:0;
font-size:14px;
color:#374151;
font-weight:bold;
"
>

Need help?

</p>

<p
style="
margin:12px 0;
font-size:14px;
color:#6B7280;
line-height:1.8;
"
>

📧 support@realitycapitalbank.com

<br>

🌐 www.realitycapitalbank.com

</p>

<p
style="
margin-top:25px;
font-size:12px;
color:#9CA3AF;
line-height:1.7;
"
>

© ${new Date().getFullYear()} Reality Capital Bank.

<br>

All Rights Reserved.

</p>

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>

`;

}