import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { useNavigate, useActionData, Form } from '@remix-run/react';
import FormInput from '~/components/FormInputComponent';
import { createContact } from '~/data.server';
import z from 'zod';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const formSchema = z.object({
    first: z.string().min(1),
    last: z.string().min(1),
    twitter: z.string().min(1),
    avatar: z.string().url().min(1),
  });
  const validatedFields = formSchema.safeParse({
    first: data.first,
    last: data.last,
    twitter: data.twitter,
    avatar: data.avatar,
  });
  if (!validatedFields.success) {
    return json({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please fill out the form correctly',
      data: null,
    });
  }
  const newEntry = await createContact(data);
  return redirect(`/contacts/${newEntry.id}`); 
}

export default function CreateContact() {
  const navigate = useNavigate();
  const formData = useActionData<typeof action>();
  console.log(formData);
  return (
    <Form method="post">
      <div className="create-form-grid">
        <FormInput
          aria-label="First name"
          name="first"
          type="text"
          label="First name"
          placeholder="First"
          errors={formData?.errors}
        />
        <FormInput
          aria-label="Last name"
          name="last"
          type="text"
          label="Last name"
          placeholder="Last"
          errors={formData?.errors}
        />
        <FormInput
          name="twitter"
          type="text"
          label="Twitter"
          placeholder="@jack"
          errors={formData?.errors}
        />
        <FormInput
          aria-label="Avatar URL"
          name="avatar"
          type="text"
          label="Avatar URL"
          placeholder="https://example.com/avatar.jpg"
          errors={formData?.errors}
        />
      </div>

      <div>
        <label>
          <span>Notes</span>
          <br />
          <textarea name="note" rows={6} />
        </label>
      </div>
      <br />
      <div className="button-group">
        <button type="submit">Create</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </Form>
  );
}
