const p = document.querySelector("p");

setInterval(() => {
  p.innerText = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
}, 1000);

let income = 0;
let expense = 0;

const display = (item) => {
  console.log(item);

  const div0 = document.getElementById("values");
  const div1 = document.createElement("div");
  div1.className = "excel-row";

  const data = [];

  for (let key in item) {
    const div2 = document.createElement("div");
    div2.className = "excel-cell";

    if (key == "createdAt") {
      div2.innerText = `${item["createdAt"].slice(0, 10)}`;
      data[0] = div2;
    } else if (key == "description") {
      div2.innerText = `${item["description"]}`;
      data[1] = div2;
    } else if (key == "category") {
      div2.innerText = `${item["category"]}`;
      data[2] = div2;

      if (item["category"] == "salary") {
        income += Number(item["amount"]);

        const divSalary = document.createElement("div");
        divSalary.className = "excel-cell";

        divSalary.innerText = `${item["amount"]}`;
        data[3] = divSalary;

        const divNotSalary = document.createElement("div");
        divNotSalary.className = "excel-cell";

        divNotSalary.innerText = `0`;
        data[4] = divNotSalary;
      } else {
        expense += Number(item["amount"]);
        const divSalary = document.createElement("div");
        divSalary.className = "excel-cell";

        divSalary.innerText = `0`;
        data[3] = divSalary;

        const divNotSalary = document.createElement("div");
        divNotSalary.className = "excel-cell";

        divNotSalary.innerText = `${item["amount"]}`;
        data[4] = divNotSalary;
      }
    } else continue;
  }

  for (let i = 0; i < 5; i++) {
    console.log(data[i]);
    div1.appendChild(data[i]);
  }

  div0.appendChild(div1);
};

const initialize = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const userId = JSON.parse(localStorage.getItem("userId"));

    const result = await axios.get(
      `http://13.200.237.174:8000/expense/get/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const items = result.data.expense;

    console.log(result.data.expense);

    items.map((item) => {
      display(item, income, expense);
    });

    const totalIncome = document.getElementById("totalIncome");
    const totalexpense = document.getElementById("totalExpenses");
    totalIncome.innerText = `${income}`;
    totalexpense.innerText = `${expense}`;

    const downloadFile = document.getElementById("downloadFile");

    downloadFile.addEventListener("click", async () => {
      console.log(downloadFile);
      const result = await axios.get(
        `http://13.200.237.174:8000/file/getfile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.open(result.data.fileUrl, "_blank");
      console.log(result.data.fileUrl);
    });
  } catch (error) {
    console.log(error);
  }
};

initialize();
