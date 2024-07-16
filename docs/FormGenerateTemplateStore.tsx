import { create } from 'zustand';
import { formBaseState, createFormSliceYup } from '@/stores/slice/formSlice';
import * as yup from 'yup';

/* db meta 기준으로 반영 : required만 반영 */
const yupFormSchema = yup.object({
  id: yup.string().required('id는 필수입니다.'),
  name: yup.string().required().min(5).max(10),
  age: yup.number().required().nullable().max(100),
  email: yup.string().required().email(),
  password: yup.string().required(),
  password2: yup.string().required(),
  job: yup.string(),
  description: yup.string(),
});

/* requiredFields : not null 인 필드만 나열 */
/* db meta 기준으로 반영 : 특정 컬럼은 제거해야함 */
const initFormData = {
  ...formBaseState,
  requiredFields: ['id', 'name', 'email', 'job'],

  id: '',
  name: '',
  age: null,
  email: '',
  password: '',
  password2: '',
  job: '',
  description: '',
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
