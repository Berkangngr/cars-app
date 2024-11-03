import * as yup from 'yup';

 export const loginPageSchema = yup.object().shape({
    username : yup.string().required("Kullanıcı adı boş olamaz."),
    password : yup.string().required("Şifre alanı boş olamaz."),
 })
