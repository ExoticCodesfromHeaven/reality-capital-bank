import { baseTemplate } from "./templates/base.template";

export function passwordResetSuccessTemplate(
  firstName: string
) {
  return baseTemplate({

    title: "Password Changed",

    heading: `Hello ${firstName},`,

    content: `

<p>

Your password has been changed successfully.

</p>

<p>

If you made this change,
no further action is required.

</p>

<p>

If you did <strong>NOT</strong> change your password,
please contact Reality Capital Bank Support immediately.

</p>

`,
  });
}