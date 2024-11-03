import * as yup from 'yup';

 export const registerPageSchemas = yup.object().shape({
    username : yup.string().required("Kullanıcı adı boş olamaz."),
    password : yup.string().required("Şifre alanı boş olamaz."),
    name: yup.string().required("İsminiz boş olamaz."),
    lastName: yup.string().required("Soyisim boş olamaz."),
    confirmPassword: yup.string().required("Şifre tekrarı zorunlu.").oneOf([yup.ref('password')],'Şifreler eşleşmiyor.')
 })
