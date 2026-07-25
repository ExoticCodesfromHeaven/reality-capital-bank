import { baseTemplate } from "./templates/base.template";

export function welcomeTemplate(

  firstName: string

) {

  return baseTemplate({

    title: "Welcome",

    heading: `Welcome ${firstName}!`,

    content: `

<p>

Your Reality Capital Bank account has been created successfully.

</p>

<p>

You can now:

</p>

<ul>

<li>Transfer funds</li>

<li>Open investments</li>

<li>Create fixed deposits</li>

<li>Track your transactions</li>

<li>Manage your profile</li>

</ul>

<p>

We're excited to have you banking with us.

</p>

`,

  });

}