import * as requests from "../../util/http/requests";

import {
  PopupMessage,
  validatePassword,
  validateUsername,
} from "../../util/validate";
import { Router, redirect, useState } from "@hydrophobefireman/ui-lib";
import { UserDataResponse, authData, passwordData } from "../../state";
import { notify, set } from "statedrive";

import { AnimatedInput } from "../../components/AnimatedInput";
import { AuthForm } from "../../components/AuthForm";
import { PassIcon } from "../../components/Icons/Pass";
import { UserIcon } from "../../components/Icons/User";
import { center } from "../../styles";
import { css } from "catom";
import { userRoutes } from "../../util/http/api_routes";

const inputCls = css({ marginTop: "1rem" });
export default function Login() {
  const [message, setMessage] = useState<PopupMessage>({
    message: "",
    isError: false,
    onClose: null,
  });

  const [user, setUsername] = useState("");
  const [password, setPasswowrd] = useState("");

  function onSubmit() {
    if (
      validateUsername(user, setMessage) ||
      validatePassword(password, setMessage)
    ) {
      return;
    }
    return requests
      .postJSON<UserDataResponse>(userRoutes.login, { user, password })
      .result.then((response) => {
        const { data, error } = response;
        if (error) {
          return setMessage({ message: response.error, isError: true });
        }
        if (data.user_data.user) {
          set(passwordData, password);
          set(authData, data.user_data);
          const next = new URLSearchParams(Router.qs).get("next");
          redirect(next || "/dashboard");
        }
      });
  }
  return (
    <section class={center}>
      <AuthForm
        message={message.message}
        isError={message.isError}
        onClose={() => {
          message.onClose && message.onClose();
          setMessage({});
        }}
        onSubmit={onSubmit}
        buttonText="login"
        altLink="register"
      >
        <AnimatedInput
          onInput={setUsername}
          labelText="username"
          spellcheck={false}
          value={user}
          required
          maxLength={30}
          minLength={4}
          inputClass={inputCls}
          pattern="(\w|-|_){3,30}"
          icon={<UserIcon />}
        />
        <AnimatedInput
          onInput={setPasswowrd}
          labelText="password"
          type="password"
          required
          value={password}
          inputClass={inputCls}
          icon={<PassIcon />}
        />
      </AuthForm>
    </section>
  );
}
