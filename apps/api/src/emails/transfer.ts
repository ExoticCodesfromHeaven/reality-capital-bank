import { baseTemplate } from "./templates/base.template";

export function transferTemplate(

  firstName: string,

  amount: string,

  reference: string

) {

  return baseTemplate({

    title: "Transfer Successful",

    heading: `Hello ${firstName},`,

    content: `

<p>

Your transfer has been processed successfully.

</p>

<table
style="
width:100%;
margin-top:20px;
"
>

<tr>

<td><strong>Amount</strong></td>

<td>${amount}</td>

</tr>

<tr>

<td><strong>Reference</strong></td>

<td>${reference}</td>

</tr>

</table>

<p>

Thank you for banking with Reality Capital Bank.

</p>

`,

  });

}