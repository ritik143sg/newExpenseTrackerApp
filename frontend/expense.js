const handleSubmit = async (event) => {
  event.preventDefault();
  const amount = event.target.amount.value;
  const description = event.target.description.value;
  const category = event.target.category.value;

  const data = {
    amount: amount,
    description: description,
    category: category,
  };

  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const res = await axios.post(`http://13.232.57.29:8000/expense/add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // showItems();
    inintialize();
  } catch (error) {
    console.log(error);
  }
  event.target.amount.value = "";
  event.target.description.value = "";
};

// const showItems = () => {
//   const body = document.querySelector("body");
//   body.innerHTML = "";
// };

const style = (button) => {
  button.style.backgroundColor = "#28a745"; // Bootstrap-style green
  button.style.color = "white";
  button.style.padding = "8px 16px";
  button.style.margin = "5px";
  button.style.borderRadius = "8px";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.style.fontSize = "16px";
  button.style.fontWeight = "bold";
  button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  button.style.transition = "background-color 0.3s ease, transform 0.2s ease";

  // Optional Hover Effect
  button.addEventListener("mouseenter", () => {
    button.style.backgroundColor = "#218838"; // Darker green on hover
    button.style.transform = "scale(1.05)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.backgroundColor = "#28a745";
    button.style.transform = "scale(1)";
  });
};

const paginatingButton = (page) => {
  console.log(page);
  const body = document.querySelector("body");
  const leaderBoardList = document.getElementById("leaderBoard");

  const token = JSON.parse(localStorage.getItem("token"));
  const preButton = document.createElement("button");
  const currButton = document.createElement("button");
  const nextButton = document.createElement("button");

  if (page.pre === true) {
    preButton.addEventListener("click", async () => {
      const limit = JSON.parse(localStorage.getItem("pageNo"));
      const expenses = await axios.get(
        `http://13.232.57.29:8000/expense/${
          Number(page.pageId) - 1
        }?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const items = expenses.data.expense;
      const ul = document.querySelector("ul");
      ul.innerHTML = "";

      items.map((item) => {
        display(item);
      });
      currButton.remove();
      nextButton.remove();
      preButton.remove();
      paginatingButton(expenses.data.page);
    });

    preButton.innerText = `${Number(page.pageId) - 1}`;
    style(preButton);
    body.insertBefore(preButton, leaderBoardList);
  }

  if (page.curr === true) {
    //const currButton = document.createElement("button");

    currButton.addEventListener("click", async () => {
      const limit = JSON.parse(localStorage.getItem("pageNo"));
      const expenses = await axios.get(
        `http://13.232.57.29:8000/expense/${Number(
          page.pageId
        )}?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const items = expenses.data.expense;
      const ul = document.querySelector("ul");
      ul.innerHTML = "";

      items.map((item) => {
        display(item);
      });
      currButton.remove();
      nextButton.remove();
      preButton.remove();
      paginatingButton(expenses.data.page);
    });

    currButton.innerText = `${page.pageId}`;
    style(currButton);

    currButton.style.height = "50px";
    //  currButton.style.backgroundColor = "pink";

    body.insertBefore(currButton, leaderBoardList);
  }
  if (page.next === true) {
    //const nextButton = document.createElement("button");
    nextButton.addEventListener("click", async () => {
      const limit = JSON.parse(localStorage.getItem("pageNo"));
      const expenses = await axios.get(
        `http://13.232.57.29:8000/expense/${
          Number(page.pageId) + 1
        }?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const items = expenses.data.expense;
      const ul = document.querySelector("ul");
      ul.innerHTML = "";

      items.map((item) => {
        display(item);
      });
      currButton.remove();
      nextButton.remove();
      preButton.remove();
      paginatingButton(expenses.data.page);
    });

    nextButton.innerText = `${Number(page.pageId) + 1}`;
    style(nextButton);
    body.insertBefore(nextButton, leaderBoardList);
  }
};

async function display2(item) {
  const leaderBoard = document.getElementById("leaderBoard");
  const ul = document.querySelector("#leaderBoardList");

  const li = document.createElement("li");

  li.innerText = `UserId: ${item.id}, Name: ${item.username}, TotalAmount: ${item.totalCost}`;

  ul.appendChild(li);
  leaderBoard.appendChild(ul);
}

async function display(item) {
  const ul = document.querySelector("ul");

  const li = document.createElement("li");
  const del = document.createElement("button");

  li.innerText = `${item.amount}-${item.description}-${item.category}`;

  del.innerText = "delete";

  try {
    del.addEventListener("click", async () => {
      const token = JSON.parse(localStorage.getItem("token"));
      await axios.delete(`http://13.232.57.29:8000/expense/delete/${item.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      inintialize();
    });
  } catch (error) {
    console.log(error);
  }

  li.appendChild(del);
  ul.appendChild(li);
}

async function inintialize() {
  const token = JSON.parse(localStorage.getItem("token"));
  const ul = document.querySelector("ul");
  ul.innerHTML = "";

  const select = document.getElementById("pageNo");

  localStorage.setItem("pageNo", JSON.stringify(select.value));

  select.addEventListener("click", async () => {
    console.log(select.value);
    localStorage.setItem("pageNo", JSON.stringify(select.value));

    ul.innerHTML = "";
    const id = 1;

    const limit = JSON.parse(localStorage.getItem("pageNo"));

    const expenses = await axios.get(
      `http://13.232.57.29:8000/expense/${id}/?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(expenses);
    const items = expenses.data.expense;

    items.map((item) => {
      display(item);
    });
    // paginatingButton(expenses.data.page);
  });

  const premiumButton = document.getElementById("premium");

  try {
    const result = await axios.get(`http://13.232.57.29:8000/order`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (result.data.order) {
      const status = result.data.order.OrderStatus;

      console.log(status);

      if (status == "Success") {
        const form = document.querySelector("form");

        if (premiumButton) {
          form.removeChild(premiumButton);

          const premium = document.createElement("button");
          premium.style.backgroundColor = "rgb(236, 101, 124)";
          premium.innerText = "You are a Premium User";
          premium.id = "Premium";
          premium.addEventListener("click", () => {
            alert("Already A Premium User");
          });
          form.appendChild(premium);

          const leaderBoard = document.getElementById("leaderBoard");
          console.log(leaderBoard);

          const leaderBoardButton = document.createElement("button");
          leaderBoardButton.innerText = "Leader Board";
          leaderBoard.appendChild(leaderBoardButton);

          const expenseDetailsButton = document.createElement("button");
          expenseDetailsButton.innerText = "Expense Details";
          leaderBoard.appendChild(expenseDetailsButton);

          expenseDetailsButton.addEventListener("click", async () => {
            window.location.href = "./view/dailyExpenses.html";
          });

          leaderBoardButton.addEventListener("click", async () => {
            const expenses = await axios.get(
              `http://13.232.57.29:8000/premiumFeature`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log(expenses);
            const items = expenses.data.data;
            console.log(items);

            const ul = document.querySelector("#leaderBoardList");
            ul.innerHTML = "";

            items.map((item) => {
              display2(item);
            });
          });
        }
      }
    }

    const id = 1;

    const limit = JSON.parse(localStorage.getItem("pageNo"));

    const expenses = await axios.get(
      `http://13.232.57.29:8000/expense/${id}/?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(expenses);
    const items = expenses.data.expense;

    items.map((item) => {
      display(item);
    });
    paginatingButton(expenses.data.page);
  } catch (error) {
    if (error && error.response.data.message === "Invalid token") {
      alert("User Logged Out Invalid Token");
      window.location.href = "./login.html";
    }
    console.log(error);
  }
}

inintialize();
