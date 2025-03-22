import * as yup from "yup";

export const newPasswordSchema = yup.object().shape({
    oldPassword:yup.string().required("Eski şifre boş olamaz !"),
    newPassword:yup.string().required("Yeni şifre alanı boş olamaz !"),
});