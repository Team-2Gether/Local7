import { useState } from 'react';

const useFormData = (initialData) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFormData = () => {
    setFormData(initialData);
  };

  return { formData, setFormData, handleChange, resetFormData };
};

export default useFormData;