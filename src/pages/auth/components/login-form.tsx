import React, { useState } from "react";
import TextInput from "@/components/ui/TextInput";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router";
import { useNavigate } from "react-router";

// Yup validation schema
const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [checked, setChecked] = useState(false);
   const navigate = useNavigate(); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit = (data: LoginFormInputs) => {
    console.log("Form Data:", data, "Keep signed in:", checked);
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <TextInput
        name="email"
        label="Email"
        type="email"
        register={register}
        error={errors.email}
        className="h-13 text-base"
        placeholder="Enter your email"
        required
      />

      <TextInput
        name="password"
        label="Password"
        type="password"
        register={register}
        error={errors.password}
        className="h-13 text-base"
        placeholder="Enter your password"
        hasicon={true}
        required
      />

      <div className="flex justify-between items-center pt-2">
        <Checkbox
          id="keep-signed-in"
          name="keepSignedIn"
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Keep me signed in"
        />
        <Link
          to="/forgot-password"
          className="text-sm text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          Forgot Password?
        </Link>
      </div>

      <Button
        type="submit"
        text="Sign in"
        className="btn btn-dark block w-full text-center h-13 text-base font-semibold mt-8"
      />
    </form>
  );
};

export default LoginForm;
