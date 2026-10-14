import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signin } from "../../API/action/auth";

import AuthTextInput from "../../components/ui/AuthUi/AuthTextInput";
import AuthButton from "../../components/ui/AuthUi/AuthButton";
import AuthRedirectButton from "../../components/ui/AuthUi/AuthRedirectButton";
import BoldText from "../../components/ui/BoldText";
import AuthLayout from "../../components/ui/AuthUi/AuthLayout";

function LogIn({ navigation }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [displayEmail, setDisplayEmail] = useState("");
  const dispatch = useDispatch();

  async function handleLogin() {
    try {
      await dispatch(signin(formData));
    } catch (error) {
      console.error("Error during login:", error);
    }
  }

  function handleSignUp() {
    navigation.navigate("SignUp");
  }

  function handleForgotPass() {
    navigation.navigate("ForgotPassword");
  }

  return (
    <AuthLayout message="Back for more? Let's get you logged in!">
      <AuthTextInput
        placeholder="Email"
        value={displayEmail}
        onChangeText={(text) => {
          setDisplayEmail(text);
          setFormData({ ...formData, email: text.toLowerCase().trim() });
        }}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <AuthTextInput
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />

      <AuthButton onPress={handleLogin}>Log In</AuthButton>

      <AuthRedirectButton onPress={handleSignUp}>
        Don't have an account? {<BoldText>Sign Up</BoldText>}
      </AuthRedirectButton>

      <AuthRedirectButton onPress={handleForgotPass}>
        Forgot Password?
      </AuthRedirectButton>
    </AuthLayout>
  );
}

export default LogIn;
