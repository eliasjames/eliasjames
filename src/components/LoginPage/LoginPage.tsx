import React from "react";
import styles from "./LoginPage.module.css";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button, TextField } from "@mui/material";
import OverlayCard from "../Shared/OverlayCard/OverlayCard";
import NavigationBar from "../NavigationBar/NavigationBar";
import { Form } from "../Shared/Form/Form";

interface IFormInput {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit = async (data: IFormInput) => {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/",
    });
  };

  const handleSignInGoogle = async () => {
    await signIn("google", {
      redirect: false,
      callbackUrl: "/",
    });
  };

  return (
    <div className={styles.page}>
      <NavigationBar />
      <div className={styles.main}>
        <div className={styles.titles}>
          <OverlayCard
            title={"Project Tailwind Login"}
            imageUrl="/images/emerson_logo_pink.png"
            content={
              <div className={styles.content}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className={styles["form-inputs"]}
                >
                  <Form.Container>
                    <Form.Field label="Email address">
                      <TextField {...register("email")} />
                    </Form.Field>
                    <Form.Field label="Password">
                      <TextField {...register("password")} type="password" />
                    </Form.Field>
                    <Button
                      type="submit"
                      variant="contained"
                      className={styles["auth-button"]}
                      fullWidth
                    >
                      Login
                    </Button>
                  </Form.Container>
                </form>
              </div>
            }
            footer={
              <div className={styles["auth-buttons"]}>
                <Button
                  onClick={() => handleSignInGoogle()}
                  variant="outlined"
                  size="small"
                  className={styles["auth-button-secondary"]}
                >
                  Sign in with Google
                </Button>
                <Button
                  href="/sign-up"
                  LinkComponent={Link}
                  variant="outlined"
                  size="small"
                  className={styles["auth-button-secondary"]}
                >
                  Sign Up
                </Button>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
