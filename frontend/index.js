const handleSubmit = async (event) => {
  event.preventDefault();
  console.log(event);

  console.log(event.target);

  const data = {
    username: event.target.username.value,
    email: event.target.email.value,
    password: event.target.password.value,
  };

  try {
    console.log("User Post Request");
    const res = await axios.post(
      `http://13.232.57.29:8000/user/signup/add`,
      data
    );
    console.log(res);
    alert(res.data.msg);
    console.log(res);
    window.location.href = "./login.html";
  } catch (error) {
    console.log(error);
  }
  event.target.username.value = "";
  event.target.email.value = "";
  event.target.password.value = "";
};
