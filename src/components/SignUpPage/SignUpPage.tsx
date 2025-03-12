import { Form } from "@/src/components/Shared/Form/Form";
import styles from "./SignUpPage.module.css";

import UsersContainer from "@/src/containers/UsersContainer";
import UserDTO from "@/src/models/users/UserDTO";
import { Button, TextField } from "@mui/material";
import { signIn } from "next-auth/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import NavigationBar from "../NavigationBar/NavigationBar";
import OverlayCard from "../Shared/OverlayCard/OverlayCard";

const SignUpPage = () => {
  const { register, handleSubmit } = useForm<UserDTO>();
  const { createUser, initializeFromRemote } = UsersContainer.useContainer();

  useEffect(() => {
    initializeFromRemote();
  }, []);

  const onSubmit = async (data: UserDTO) => {
    const user = await createUser(data);
    if (user) {
      await signIn("credentials", {
        email: user.email,
        password: data.password,
        callbackUrl: "/",
      });
    }
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
            title={"Sign Up"}
            imageUrl="/images/emerson_logo_pink.png"
            content={
              <div className={styles.content}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Container>
                    <Form.Field label="First Name">
                      <TextField {...register("firstName")} />
                    </Form.Field>
                    <Form.Field label="Last Name">
                      <TextField {...register("lastName")} />
                    </Form.Field>
                    <Form.Field label="Email">
                      <TextField {...register("email")} type="email" />
                    </Form.Field>
                    <Form.Field label="Password">
                      <TextField {...register("password")} type="password" />
                    </Form.Field>
                  </Form.Container>
                  <Button
                    type="submit"
                    variant="contained"
                    className={styles["auth-button"]}
                    fullWidth
                  >
                    Sign Up
                  </Button>
                </form>
                <Button
                  onClick={() => handleSignInGoogle()}
                  variant="outlined"
                  size="small"
                  className={styles["auth-button-secondary"]}
                >
                  Sign up with Google
                </Button>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
