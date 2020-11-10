import * as requests from "../../util/http/requests";

import {
  PopupMessage,
  validateName,
  validatePassword,
  validateUsername,
} from "../../util/validate";
import { redirect, useState } from "@hydrophobefireman/ui-lib";

import { AnimatedInput } from "../../components/AnimatedInput";
import { AuthForm } from "../../components/AuthForm";
import { NameIcon } from "../../components/Icons/Name";
import { PassIcon } from "../../components/Icons/Pass";
import { UserDataResponse } from "../../state";
import { UserIcon } from "../../components/Icons/User";
import { center } from "../../styles";
import { css } from "catom";
import { userRoutes } from "../../util/http/api_routes";

const inputCls = css({ marginTop: "1rem" });
export default function Register() {
  const [message, setMessage] = useState<PopupMessage>({
    message: "",
    isError: false,
    onClose: null,
  });

  const [name, setName] = useState("");
  const [user, setUsername] = useState("");
  const [password, setPasswowrd] = useState("");

  function onSubmit() {
    if (
      validateName(name, setMessage) ||
      validateUsername(user, setMessage) ||
      validatePassword(password, setMessage)
    ) {
      return;
    }
    return requests
      .postJSON<UserDataResponse>(userRoutes.register, { user, name, password })
      .result.then((response) => {
        const { data, error } = response;
        if (error) {
          return setMessage({ message: response.error, isError: true });
        }
        if (data.user_data.user) {
          return setMessage({
            message: "your account has been created, press ok to login",
            onClose: () => redirect("/login"),
          });
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
        buttonText="register"
        altLink="login"
      >
        <AnimatedInput
          onInput={setName}
          labelText="name"
          spellcheck={false}
          value={name}
          required
          inputClass={inputCls}
          icon={<NameIcon />}
        />
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
