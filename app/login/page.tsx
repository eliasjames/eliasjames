import { signIn, providerMap } from "@/auth";
import { AuthError } from "next-auth";

export default function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined };
}) {
  return (
    <div className="flex flex-col gap-2">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        action={async (formData) => {
          "use server";
          try {
            let { callbackUrl } = props.searchParams;
            callbackUrl = callbackUrl ?? "/dashboard";
            formData.append("redirectTo", callbackUrl);
            await signIn("insecure-testing", formData);
          } catch (error) {
            if (error instanceof AuthError) {
              // return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
            }
            console.log(`error`, error);
            throw error;
          }
        }}
      >
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Password
          <input
            name="password"
            id="input-password-for-insecure-testing-provider"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
          />
        </label>
        <button
          type="submit"
          id="submitButton"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign In
        </button>
      </form>
      {Object.values(providerMap).map((provider) => (
        <form
          key={provider.id}
          action={async () => {
            "use server";
            try {
              const { callbackUrl } = props.searchParams;
              const signInOptions = {
                redirectTo: callbackUrl ?? "/dashboard",
              };
              await signIn(provider.id, signInOptions);
            } catch (error) {
              // Signin can fail for a number of reasons, such as the user
              // not existing, or the user not having the correct role.
              // In some cases, you may want to redirect to a custom error
              if (error instanceof AuthError) {
                console.log(`error`, error);
                // return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
              }

              // Otherwise if a redirects happens Next.js can handle it
              // so you can just re-thrown the error and let Next.js handle it.
              // Docs:
              // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
              throw error;
            }
          }}
        >
          <button type="submit">
            <span>Sign in with {provider.name}</span>
          </button>
        </form>
      ))}
    </div>
  );
}
