import * as Yup from "yup";

export const schema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
 
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});
