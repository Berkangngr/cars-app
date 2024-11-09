import * as yup from 'yup';

 export const registerPageSchemas = yup.object().shape({
   UserName : yup.string().required("Kullanıcı adı boş olamaz."),
   Password : yup.string().required("Şifre alanı boş olamaz."),
    FirstName: yup.string().required("İsminiz boş olamaz."),
    LastName: yup.string().required("Soyisim boş olamaz."),
    Email:yup.string().email().required("Email boş olamaz."),
 })
