const handleSubmit = async (event) => {
  event.preventDefault();

  const data = {
    email: event.target.email.value,
  };

  try {
    const res = await axios.post(
      `http://13.232.57.29:8000/password/forgetPassword`,
      data
    );
    const password = res.data.user.password;

    console.log(res.data.user.password);
    alert(`Password is  ${password}`);
  } catch (error) {
    console.log(error);
  }
  event.target.email.value = "";
};
