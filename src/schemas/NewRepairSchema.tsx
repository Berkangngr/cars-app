import * as yup from "yup";

export const newRepairPageSchema = yup.object().shape({
  PlakaNo: yup
    .string()
    .required("Plaka No boş olamaz!")
    .matches(
      /^(0[1-9]|[1-7][0-9]|8[01])\s?[A-Z]{1,3}\s?\d{2,5}$/,
      "Geçerli bir plaka giriniz!"
    ),

  // SasiNo: yup.string()
  // .required("Şasi No boş olamaz!")
  // .matches(/^(?!.*[QOI])[A-HJ-NPR-Z0-9]{17}$/,
  //   "Geçerli bir şasi no giriniz!"
  // ),
});