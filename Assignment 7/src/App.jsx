
import { useState } from "react";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  function addExpense(e) {
    e.preventDefault();

    if (name.trim() === "" || amount === "" || Number(amount) <= 0) {
      alert("Please enter a valid expense name and amount.");
      return;
    }

    const newExpense = {
      id: Date.now(),
      name: name.trim(),
      amount: Number(amount),
      category: category,
    };

    setExpenses([...expenses, newExpense]);
    setName("");
    setAmount("");
    setCategory("Food");
  }

  function deleteExpense(id) {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  }

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const categories = [...new Set(expenses.map((expense) => expense.category))];

  return (
    <div className="app">
      <header className="header">
        <div className="logo">₹</div>
        <h1>Smart Kharcha</h1>
        <p>Track your expenses. Manage your money.</p>
      </header>

      <main className="container">
        <section className="total-card">
          <p>Total Expenses</p>
          <h2>₹{total.toFixed(2)}</h2>
          <span>{expenses.length} expenses recorded</span>
        </section>

        <section className="card">
          <h2>Add New Expense</h2>

          <form onSubmit={addExpense}>
            <label>Expense Name</label>
            <input
              type="text"
              placeholder="e.g. Lunch, Travel, Books"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Amount (₹)</label>
            <input
              type="number"
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Food</option>
              <option>Travel</option>
              <option>Education</option>
              <option>Shopping</option>
              <option>Entertainment</option>
              <option>Other</option>
            </select>

            <button type="submit">+ Add Expense</button>
          </form>
        </section>

        <section className="card">
          <h2>Expense History</h2>

          {expenses.length === 0 ? (
            <p className="empty">No expenses added yet. Add your first expense!</p>
          ) : (
            <div className="expense-list">
              {expenses.map((expense) => (
                <div className="expense-item" key={expense.id}>
                  <div>
                    <h3>{expense.name}</h3>
                    <p>{expense.category}</p>
                  </div>

                  <div className="expense-right">
                    <strong>₹{expense.amount.toFixed(2)}</strong>
                    <button
                      className="delete-btn"
                      onClick={() => deleteExpense(expense.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <h2>Category Analysis</h2>

          {categories.length === 0 ? (
            <p className="empty">Your category analysis will appear here.</p>
          ) : (
            categories.map((item) => {
              const categoryTotal = expenses
                .filter((expense) => expense.category === item)
                .reduce((sum, expense) => sum + expense.amount, 0);

              return (
                <div className="category-item" key={item}>
                  <span>{item}</span>
                  <strong>₹{categoryTotal.toFixed(2)}</strong>
                </div>
              );
            })
          )}
        </section>
      </main>

      <footer>
        <p>Smart Kharcha © 2026 | Personal Expense Tracker</p>
      </footer>
    </div>
  );
}

export default App;
