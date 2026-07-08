console.log("app.js is running");

// ---- Shared: set date on any page that has #currentDate ----
const dateEl = document.querySelector("#currentDate");
if (dateEl) {
  const today = new Date();
  dateEl.textContent = today.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// ---- Mock "backend" for now ----
function fakeLoginCheck(username, password) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      if (username === "admin" && password === "1234") {
        resolve({ success: true });
      } else {
        resolve({ success: false, message: "Incorrect username or password." });
      }
    }, 500);
  });
}

if (document.querySelector("#loginForm")) {


const loginForm = document.querySelector("#loginForm");
const errorMessage = document.querySelector("#errorMessage");

console.log("loginForm found:", loginForm);

loginForm.addEventListener("submit", function(event) {
  event.preventDefault();

  console.log("Form submitted");

  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  errorMessage.textContent = "";

  fakeLoginCheck(username, password).then(function(result) {
    console.log("Result:", result);
    if (result.success) {
      window.location.href = "dashboard.html";
    } else {
      errorMessage.textContent = result.message;
    }
  });
});
}

// ==================
// DASHBOARD CODE
// ==================

if (document.querySelector("#todaySales")) {

  // ---- Mock data (replace with fetch() later) ----
  const dashboardData = {
    todaySales: 45800,
    transactions: 23,
    totalProfit: 12400,
    lowStockCount: 3,
    recentSales: [
      { item: "Indomie Noodles", quantity: 10, amount: 3500, employee: "Chidi", time: "09:15 AM" },
      { item: "Peak Milk (tin)", quantity: 5, amount: 6250, employee: "Amaka", time: "10:02 AM" },
      { item: "Milo 500g", quantity: 3, amount: 4200, employee: "Chidi", time: "11:30 AM" },
      { item: "Semovita 2kg", quantity: 8, amount: 9600, employee: "Tunde", time: "12:45 PM" },
      { item: "Groundnut Oil 1L", quantity: 2, amount: 3800, employee: "Amaka", time: "01:20 PM" },
    ],
    lowStockItems: [
      { name: "Indomie Noodles (Carton)", stock: 2 },
      { name: "Peak Milk (tin)", stock: 4 },
      { name: "Semovita 2kg", stock: 1 },
    ]
  };

  // ---- Fill KPI cards ----
  document.querySelector("#todaySales").textContent = "₦" + dashboardData.todaySales.toLocaleString();
  document.querySelector("#totalTransactions").textContent = dashboardData.transactions;
  document.querySelector("#totalProfit").textContent = "₦" + dashboardData.totalProfit.toLocaleString();
  document.querySelector("#lowStockCount").textContent = dashboardData.lowStockCount;

  // ---- Fill Recent Sales table ----
  const salesBody = document.querySelector("#recentSalesBody");
  dashboardData.recentSales.forEach(function(sale) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${sale.item}</td>
      <td>${sale.quantity}</td>
      <td>₦${sale.amount.toLocaleString()}</td>
      <td>${sale.employee}</td>
      <td>${sale.time}</td>
    `;
    salesBody.appendChild(row);
  });

  // ---- Fill Low Stock Alerts ----
  const alertList = document.querySelector("#lowStockList");
  dashboardData.lowStockItems.forEach(function(item) {
    const alertItem = document.createElement("div");
    alertItem.classList.add("alert-item");
    alertItem.innerHTML = `
      <span class="alert-item-name">${item.name}</span>
      <span class="alert-item-stock">Only ${item.stock} left</span>
    `;
    alertList.appendChild(alertItem);
  });

}

// ==================
// SALES PAGE CODE
// ==================

if (document.querySelector("#saleForm")) {

  
  // ---- Mock product list (replace with fetch() later) ----
  const products = [
    { id: 1, name: "Indomie Noodles", price: 350, stock: 2 },
    { id: 2, name: "Peak Milk (tin)", price: 1250, stock: 4 },
    { id: 3, name: "Milo 500g", price: 1400, stock: 20 },
    { id: 4, name: "Semovita 2kg", price: 1200, stock: 1 },
    { id: 5, name: "Groundnut Oil 1L", price: 1900, stock: 15 },
    { id: 6, name: "Dangote Sugar 1kg", price: 800, stock: 30 },
  ];

  // ---- Store today's sales in memory ----
  // (later this will come from and go to the backend)
  const todaySales = [];

  // ---- Fill product dropdown ----
  const productSelect = document.querySelector("#productSelect");

  products.forEach(function(product) {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.name + " (₦" + product.price.toLocaleString() + ")";
    productSelect.appendChild(option);
  });

  // ---- Auto-fill price and total when product is selected ----
  const quantityInput = document.querySelector("#quantityInput");
  const unitPriceInput = document.querySelector("#unitPrice");
  const totalAmountInput = document.querySelector("#totalAmount");

  function updateTotal() {
    const selectedId = parseInt(productSelect.value);
    const quantity = parseInt(quantityInput.value);

    if (!selectedId || !quantity || quantity < 1) {
      unitPriceInput.value = "";
      totalAmountInput.value = "";
      return;
    }

    const product = products.find(function(p) {
      return p.id === selectedId;
    });

    unitPriceInput.value = "₦" + product.price.toLocaleString();
    totalAmountInput.value = "₦" + (product.price * quantity).toLocaleString();
  }

  productSelect.addEventListener("change", updateTotal);
  quantityInput.addEventListener("input", updateTotal);

  // ---- Handle sale submission ----
  const saleForm = document.querySelector("#saleForm");
  const saleError = document.querySelector("#saleError");
  const saleSuccess = document.querySelector("#saleSuccess");

  saleForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // Clear previous messages
    saleError.textContent = "";
    saleSuccess.textContent = "";

    const selectedId = parseInt(productSelect.value);
    const quantity = parseInt(quantityInput.value);

    // Validate
    if (!selectedId) {
      saleError.textContent = "Please select a product.";
      return;
    }

    if (!quantity || quantity < 1) {
      saleError.textContent = "Please enter a valid quantity.";
      return;
    }

    const product = products.find(function(p) {
      return p.id === selectedId;
    });

    if (quantity > product.stock) {
      saleError.textContent = "Not enough stock. Only " + product.stock + " left.";
      return;
    }

    // Record the sale
    const total = product.price * quantity;
    const time = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const newSale = {
      product: product.name,
      quantity: quantity,
      unitPrice: product.price,
      total: total,
      time: time
    };

    // Deduct from stock
    product.stock -= quantity;

    // Add to today's sales list
    todaySales.push(newSale);

    // Update the table
    renderSalesTable();

    // Show success message
    saleSuccess.textContent = "✅ Sale recorded! " + product.name + " x" + quantity + " = ₦" + total.toLocaleString();

    // Reset form
    productSelect.value = "";
    quantityInput.value = 1;
    unitPriceInput.value = "";
    totalAmountInput.value = "";

  });

  // ---- Render today's sales table ----
  function renderSalesTable() {
    const tbody = document.querySelector("#salesTodayBody");
    const noSalesMsg = document.querySelector("#noSalesMsg");
    const countBadge = document.querySelector("#salesTodayCount");

    tbody.innerHTML = "";

    if (todaySales.length === 0) {
      noSalesMsg.style.display = "block";
      countBadge.textContent = "0 sales";
      return;
    }

    noSalesMsg.style.display = "none";
    countBadge.textContent = todaySales.length + " sale(s)";

    todaySales.forEach(function(sale) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${sale.product}</td>
        <td>${sale.quantity}</td>
        <td>₦${sale.unitPrice.toLocaleString()}</td>
        <td>₦${sale.total.toLocaleString()}</td>
        <td>${sale.time}</td>
      `;
      tbody.appendChild(row);
    });
  }

  // Run once on load
  renderSalesTable();

}

// ==================
// INVENTORY PAGE CODE
// ==================

if (document.querySelector("#inventoryTableBody")) {

  // ---- Mock products (replace with fetch() later) ----
  let inventoryProducts = [
    { id: 1, name: "Indomie Noodles", costPrice: 250, sellingPrice: 350, stock: 2 },
    { id: 2, name: "Peak Milk (tin)", costPrice: 950, sellingPrice: 1250, stock: 4 },
    { id: 3, name: "Milo 500g", costPrice: 1100, sellingPrice: 1400, stock: 20 },
    { id: 4, name: "Semovita 2kg", costPrice: 900, sellingPrice: 1200, stock: 1 },
    { id: 5, name: "Groundnut Oil 1L", costPrice: 1500, sellingPrice: 1900, stock: 15 },
    { id: 6, name: "Dangote Sugar 1kg", costPrice: 600, sellingPrice: 800, stock: 30 },
  ];

  let nextId = 7;
  let editingId = null; // tracks which product is being edited

  // ---- Show/hide form ----
  const productFormBox = document.querySelector("#productFormBox");
  const showFormBtn = document.querySelector("#showFormBtn");
  const cancelFormBtn = document.querySelector("#cancelFormBtn");
  const formTitle = document.querySelector("#formTitle");
  const productFormBtn = document.querySelector("#productFormBtn");

  showFormBtn.addEventListener("click", function() {
    editingId = null;
    formTitle.textContent = "Add New Product";
    productFormBtn.textContent = "✅ Save Product";
    document.querySelector("#productForm").reset();
    document.querySelector("#productFormError").textContent = "";
    productFormBox.style.display = "block";
    showFormBtn.style.display = "none";
  });

  cancelFormBtn.addEventListener("click", function() {
    productFormBox.style.display = "none";
    showFormBtn.style.display = "block";
    editingId = null;
  });

  // ---- Handle form submit (add or edit) ----
  document.querySelector("#productForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.querySelector("#productName").value.trim();
    const costPrice = parseInt(document.querySelector("#costPrice").value);
    const sellingPrice = parseInt(document.querySelector("#sellingPrice").value);
    const stock = parseInt(document.querySelector("#stockQuantity").value);
    const errorEl = document.querySelector("#productFormError");

    // Validate
    errorEl.textContent = "";

    if (!name) {
      errorEl.textContent = "Please enter a product name.";
      return;
    }

    if (!costPrice || costPrice < 1) {
      errorEl.textContent = "Please enter a valid cost price.";
      return;
    }

    if (!sellingPrice || sellingPrice < 1) {
      errorEl.textContent = "Please enter a valid selling price.";
      return;
    }

    if (sellingPrice < costPrice) {
      errorEl.textContent = "Selling price cannot be lower than cost price.";
      return;
    }

    if (isNaN(stock) || stock < 0) {
      errorEl.textContent = "Please enter a valid stock quantity.";
      return;
    }

    if (editingId !== null) {
      // Edit existing product
      const product = inventoryProducts.find(function(p) {
        return p.id === editingId;
      });
      product.name = name;
      product.costPrice = costPrice;
      product.sellingPrice = sellingPrice;
      product.stock = stock;

    } else {
      // Add new product
      inventoryProducts.push({
        id: nextId,
        name: name,
        costPrice: costPrice,
        sellingPrice: sellingPrice,
        stock: stock
      });
      nextId++;
    }

    // Hide form, show button, re-render table
    productFormBox.style.display = "none";
    showFormBtn.style.display = "block";
    editingId = null;
    renderInventoryTable();
  });

  // ---- Render inventory table ----
  function renderInventoryTable() {
    const tbody = document.querySelector("#inventoryTableBody");
    const noProductsMsg = document.querySelector("#noProductsMsg");
    const productCount = document.querySelector("#productCount");

    tbody.innerHTML = "";

    if (inventoryProducts.length === 0) {
      noProductsMsg.style.display = "block";
      productCount.textContent = "0 products";
      return;
    }

    noProductsMsg.style.display = "none";
    productCount.textContent = inventoryProducts.length + " product(s)";

    inventoryProducts.forEach(function(product) {
      const isLowStock = product.stock <= 5;
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${product.name}</td>
        <td>₦${product.costPrice.toLocaleString()}</td>
        <td>₦${product.sellingPrice.toLocaleString()}</td>
        <td>${product.stock}</td>
        <td class="${isLowStock ? "stock-low" : "stock-ok"}">
          ${isLowStock ? "⚠️ Low Stock" : "✅ OK"}
        </td>
        <td>
          <button class="btn-edit" onclick="editProduct(${product.id})">Edit</button>
          <button class="btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
        </td>
      `;

      tbody.appendChild(row);
    });
  }

  // ---- Edit product ----
  window.editProduct = function(id) {
    const product = inventoryProducts.find(function(p) {
      return p.id === id;
    });

    editingId = id;
    formTitle.textContent = "Edit Product";
    productFormBtn.textContent = "✅ Update Product";

    document.querySelector("#productName").value = product.name;
    document.querySelector("#costPrice").value = product.costPrice;
    document.querySelector("#sellingPrice").value = product.sellingPrice;
    document.querySelector("#stockQuantity").value = product.stock;
    document.querySelector("#productFormError").textContent = "";

    productFormBox.style.display = "block";
    showFormBtn.style.display = "none";
  };

  // ---- Delete product ----
  window.deleteProduct = function(id) {
    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    inventoryProducts = inventoryProducts.filter(function(p) {
      return p.id !== id;
    });

    renderInventoryTable();
  };

  // Run once on load
  renderInventoryTable();

}

// ==================
// REPORTS PAGE CODE
// ==================

if (document.querySelector("#generateReportBtn")) {

  // Set today's date as default in the date picker
  const reportDateInput = document.querySelector("#reportDate");
  const todayStr = new Date().toISOString().split("T")[0];
  reportDateInput.value = todayStr;

  // ---- Mock report data (replace with fetch() later) ----
  function getMockReportData(period) {
    if (period === "daily") {
      return {
        revenue: 45800,
        profit: 12400,
        orders: 23,
        topProduct: "Indomie Noodles",
        breakdown: [
          { product: "Indomie Noodles", qtySold: 10, revenue: 3500, profit: 1000 },
          { product: "Peak Milk (tin)", qtySold: 5, revenue: 6250, profit: 1500 },
          { product: "Milo 500g", qtySold: 3, revenue: 4200, profit: 900 },
          { product: "Semovita 2kg", qtySold: 8, revenue: 9600, profit: 2400 },
          { product: "Groundnut Oil 1L", qtySold: 2, revenue: 3800, profit: 800 },
        ]
      };
    }

    if (period === "weekly") {
      return {
        revenue: 287500,
        profit: 76400,
        orders: 142,
        topProduct: "Peak Milk (tin)",
        breakdown: [
          { product: "Indomie Noodles", qtySold: 68, revenue: 23800, profit: 6800 },
          { product: "Peak Milk (tin)", qtySold: 41, revenue: 51250, profit: 12300 },
          { product: "Milo 500g", qtySold: 29, revenue: 40600, profit: 8700 },
          { product: "Semovita 2kg", qtySold: 55, revenue: 66000, profit: 16500 },
          { product: "Groundnut Oil 1L", qtySold: 18, revenue: 34200, profit: 7200 },
          { product: "Dangote Sugar 1kg", qtySold: 34, revenue: 27200, profit: 6800 },
        ]
      };
    }

    if (period === "monthly") {
      return {
        revenue: 1245000,
        profit: 334800,
        orders: 621,
        topProduct: "Semovita 2kg",
        breakdown: [
          { product: "Indomie Noodles", qtySold: 290, revenue: 101500, profit: 29000 },
          { product: "Peak Milk (tin)", qtySold: 178, revenue: 222500, profit: 53400 },
          { product: "Milo 500g", qtySold: 124, revenue: 173600, profit: 37200 },
          { product: "Semovita 2kg", qtySold: 240, revenue: 288000, profit: 72000 },
          { product: "Groundnut Oil 1L", qtySold: 89, revenue: 169100, profit: 35600 },
          { product: "Dangote Sugar 1kg", qtySold: 156, revenue: 124800, profit: 31200 },
        ]
      };
    }
  }

  // ---- Render report ----
  function renderReport() {
    const period = document.querySelector("#reportPeriod").value;
    const data = getMockReportData(period);

    // Update summary cards
    document.querySelector("#reportRevenue").textContent =
      "₦" + data.revenue.toLocaleString();
    document.querySelector("#reportProfit").textContent =
      "₦" + data.profit.toLocaleString();
    document.querySelector("#reportOrders").textContent =
      data.orders;
    document.querySelector("#reportTopProduct").textContent =
      data.topProduct;

    // Update period label on table
    const labels = {
      daily: "Daily Report",
      weekly: "Weekly Report",
      monthly: "Monthly Report"
    };
    document.querySelector("#reportPeriodLabel").textContent =
      labels[period];

    // Fill breakdown table
    const tbody = document.querySelector("#reportTableBody");
    const noReportMsg = document.querySelector("#noReportMsg");

    tbody.innerHTML = "";
    noReportMsg.style.display = "none";

    data.breakdown.forEach(function(item) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.product}</td>
        <td>${item.qtySold}</td>
        <td>₦${item.revenue.toLocaleString()}</td>
        <td>₦${item.profit.toLocaleString()}</td>
      `;
      tbody.appendChild(row);
    });
  }

  // ---- Generate button click ----
  document.querySelector("#generateReportBtn").addEventListener("click", renderReport);

}

// ==================
// EMPLOYEES PAGE CODE
// ==================

if (document.querySelector("#employeeTableBody")) {

  // ---- Mock employees (replace with fetch() later) ----
  let employees = [
    { id: 1, name: "Chidi Okeke", role: "manager", salesToday: 12, active: true },
    { id: 2, name: "Amaka Eze", role: "employee", salesToday: 8, active: true },
    { id: 3, name: "Tunde Bello", role: "employee", salesToday: 5, active: true },
    { id: 4, name: "Ngozi Obi", role: "employee", salesToday: 0, active: false },
  ];

  let nextEmployeeId = 5;
  let editingEmployeeId = null;

  // ---- Show/hide form ----
  const employeeFormBox = document.querySelector("#employeeFormBox");
  const showEmployeeFormBtn = document.querySelector("#showEmployeeFormBtn");
  const cancelEmployeeFormBtn = document.querySelector("#cancelEmployeeFormBtn");
  const employeeFormTitle = document.querySelector("#employeeFormTitle");
  const employeeFormBtn = document.querySelector("#employeeFormBtn");

  showEmployeeFormBtn.addEventListener("click", function() {
    editingEmployeeId = null;
    employeeFormTitle.textContent = "Add New Employee";
    employeeFormBtn.textContent = "✅ Save Employee";
    document.querySelector("#employeeForm").reset();
    document.querySelector("#employeeFormError").textContent = "";
    employeeFormBox.style.display = "block";
    showEmployeeFormBtn.style.display = "none";
  });

  cancelEmployeeFormBtn.addEventListener("click", function() {
    employeeFormBox.style.display = "none";
    showEmployeeFormBtn.style.display = "block";
    editingEmployeeId = null;
  });

  // ---- Handle form submit ----
  document.querySelector("#employeeForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.querySelector("#employeeName").value.trim();
    const role = document.querySelector("#employeeRole").value;
    const pin = document.querySelector("#employeePin").value.trim();
    const errorEl = document.querySelector("#employeeFormError");

    errorEl.textContent = "";

    if (!name) {
      errorEl.textContent = "Please enter the employee's full name.";
      return;
    }

    if (!pin || pin.length !== 4 || isNaN(pin)) {
      errorEl.textContent = "PIN must be exactly 4 digits.";
      return;
    }

    if (editingEmployeeId !== null) {
      // Edit existing
      const employee = employees.find(function(e) {
        return e.id === editingEmployeeId;
      });
      employee.name = name;
      employee.role = role;
    } else {
      // Add new
      employees.push({
        id: nextEmployeeId,
        name: name,
        role: role,
        salesToday: 0,
        active: true
      });
      nextEmployeeId++;
    }

    employeeFormBox.style.display = "none";
    showEmployeeFormBtn.style.display = "block";
    editingEmployeeId = null;
    renderEmployeeTable();
  });

  // ---- Render table ----
  function renderEmployeeTable() {
    const tbody = document.querySelector("#employeeTableBody");
    const noEmployeesMsg = document.querySelector("#noEmployeesMsg");
    const employeeCount = document.querySelector("#employeeCount");

    tbody.innerHTML = "";

    if (employees.length === 0) {
      noEmployeesMsg.style.display = "block";
      employeeCount.textContent = "0 employees";
      return;
    }

    noEmployeesMsg.style.display = "none";
    employeeCount.textContent = employees.length + " employee(s)";

    employees.forEach(function(employee) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${employee.name}</td>
        <td>
          <span class="role-pill role-${employee.role}">
            ${employee.role}
          </span>
        </td>
        <td>${employee.salesToday} sales</td>
        <td class="${employee.active ? "status-active" : "status-inactive"}">
          ${employee.active ? "✅ Active" : "❌ Inactive"}
        </td>
        <td>
          <button class="btn-toggle"
            onclick="toggleEmployee(${employee.id})">
            ${employee.active ? "Deactivate" : "Activate"}
          </button>
          <button class="btn-edit"
            onclick="editEmployee(${employee.id})">
            Edit
          </button>
          <button class="btn-delete"
            onclick="deleteEmployee(${employee.id})">
            Delete
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  // ---- Edit employee ----
  window.editEmployee = function(id) {
    const employee = employees.find(function(e) {
      return e.id === id;
    });

    editingEmployeeId = id;
    employeeFormTitle.textContent = "Edit Employee";
    employeeFormBtn.textContent = "✅ Update Employee";

    document.querySelector("#employeeName").value = employee.name;
    document.querySelector("#employeeRole").value = employee.role;
    document.querySelector("#employeePin").value = "";
    document.querySelector("#employeeFormError").textContent = "";

    employeeFormBox.style.display = "block";
    showEmployeeFormBtn.style.display = "none";
  };

  // ---- Toggle active/inactive ----
  window.toggleEmployee = function(id) {
    const employee = employees.find(function(e) {
      return e.id === id;
    });
    employee.active = !employee.active;
    renderEmployeeTable();
  };

  // ---- Delete employee ----
  window.deleteEmployee = function(id) {
    const confirmDelete = confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    employees = employees.filter(function(e) {
      return e.id !== id;
    });

    renderEmployeeTable();
  };

  // Run on load
  renderEmployeeTable();

}