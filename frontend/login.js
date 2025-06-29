const handleSubmit = async (event) => {
  event.preventDefault();

  const data = {
    email: event.target.email.value,
    password: event.target.password.value,
  };

  try {
    const res = await axios.post(`http://13.200.237.174:8000/user/login`, data);

    const token = res.data.token;
    const userId = res.data.user.id;
    console.log(res.data.user.id);

    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("userId", JSON.stringify(userId));

    alert(res.data.msg);
    window.location.href = "./expense.html";
  } catch (error) {
    alert(error.response.data.msg);
    console.log(error.response.data.msg);
  }

  event.target.email.value = "";
  event.target.password.value = "";
};
