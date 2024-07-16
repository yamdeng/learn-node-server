import { create } from "zustand";
import { formBaseState, createFormSliceYup } from "@/stores/slice/formSlice";
import * as yup from "yup";

/* meta 반복: nullable 체크해서 required 적용 */
const yupFormSchema = yup.object({
  id: yup.string(),
  name: yup.string().required(),
  age: yup.number().required(),
  email: yup.string(),
  password: yup.string(),
  password2: yup.string(),
  job: yup.string(),
  description: yup.string(),
});

const initFormData = {
  ...formBaseState,
  /* meta 반복: nullable 체크해서 required 적용 */
  requiredFields: ["id", "name", "email", "job"],

  /* meta 반복해서 기본 값 반영 */
  id: "",
  name: "",
  age: null,
  email: "",
  password: "",
  password2: "",
  job: "",
  description: "",
};

const useReportTestFormStore2 = create<any>((set, get) => ({
  ...createFormSliceYup(set, get),

  ...initFormData,

  yupFormSchema: yupFormSchema,

  save: () => {
    const { validate, getApiParam } = get();
    if (validate()) {
      const apiParam = getApiParam();
      console.log(`apiParam : ${JSON.stringify(apiParam)}`);
    }
  },

  clear: () => {
    set(initFormData);
  },
}));

export default useReportTestFormStore2;
