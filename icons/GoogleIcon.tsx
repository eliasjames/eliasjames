import { forwardRef } from "react";

export const GoogleIcon = forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      {...props}
      ref={ref}
    >
      <path
        fill="#4285F4"
        d="M15.684 8.184c0-.544-.044-1.09-.138-1.625H8v3.08h4.321a3.703 3.703 0 0 1-1.599 2.431v2H13.3c1.514-1.394 2.384-3.452 2.384-5.886Z"
      ></path>
      <path
        fill="#34A853"
        d="M8 16c2.158 0 3.977-.708 5.303-1.93l-2.578-2c-.717.488-1.643.765-2.722.765-2.087 0-3.857-1.408-4.492-3.301H.851v2.06A8.001 8.001 0 0 0 8 16Z"
      ></path>
      <path
        fill="#FBBC04"
        d="M3.508 9.533a4.792 4.792 0 0 1 0-3.063V4.41H.851a8.007 8.007 0 0 0 0 7.184l2.657-2.06Z"
      ></path>
      <path
        fill="#EA4335"
        d="M8 3.166a4.347 4.347 0 0 1 3.069 1.2l2.284-2.284A7.689 7.689 0 0 0 8 0 7.998 7.998 0 0 0 .851 4.41l2.657 2.06C4.14 4.574 5.913 3.166 8 3.166Z"
      ></path>
    </svg>
  );
});

GoogleIcon.displayName = "GoogleIcon";
