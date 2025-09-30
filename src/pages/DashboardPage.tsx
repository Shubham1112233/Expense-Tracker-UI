import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { api } from '../lib/api';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

type Tx = {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
  date: string;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#7b61ff', '#e76f51'];

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [items, setItems] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [q, setQ] = useState<string>('');

  async function fetchList() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.listTransactions({ type, category, q, limit: 100 }, token);
      setItems(res.data as any);
    } catch (err: any) {
      setError(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      type: String(formData.get('type')) as 'income'|'expense',
      amount: Number(formData.get('amount')),
      category: String(formData.get('category')),
      description: String(formData.get('description') || ''),
      date: new Date(String(formData.get('date') || new Date().toISOString())).toISOString()
    };
    try {
      await api.createTransaction(payload, token);
      form.reset();
      await fetchList();
    } catch (err: any) {
      alert(err.message || 'Failed to create');
    }
  }

  async function onDelete(id: string) {
    if (!token) return;
    if (!confirm('Delete this item?')) return;
    try {
      await api.deleteTransaction(id, token);
      await fetchList();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  }

  const categoryData = useMemo(() => {
    const sums = new Map<string, number>();
    items.forEach(it => {
      const key = it.category;
      const sign = it.type === 'expense' ? -1 : 1;
      sums.set(key, (sums.get(key) || 0) + sign * it.amount);
    });
    return Array.from(sums.entries()).map(([name, value]) => ({ name, value: Math.abs(value) }));
  }, [items]);

  const totalIncome = useMemo(() => 
    items.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0), [items]
  );
  
  const totalExpense = useMemo(() => 
    items.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0), [items]
  );

  return (
    <div>
      {/* Welcome Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-6 mb-1">
            <i className="bi bi-graph-up text-primary me-2"></i>
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted">Track and manage your personal finances</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Income</h6>
                  <h3 className="mb-0">${totalIncome.toFixed(2)}</h3>
                </div>
                <i className="bi bi-arrow-up-circle" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Expenses</h6>
                  <h3 className="mb-0">${totalExpense.toFixed(2)}</h3>
                </div>
                <i className="bi bi-arrow-down-circle" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Net Balance</h6>
                  <h3 className="mb-0">${(totalIncome - totalExpense).toFixed(2)}</h3>
                </div>
                <i className="bi bi-wallet2" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-plus-circle me-2"></i>
            Add New Transaction
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={onCreate} className="row g-3">
            <div className="col-md-2">
              <label className="form-label">Type</label>
              <select name="type" className="form-select" defaultValue="expense" required>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Amount</label>
              <input 
                name="amount" 
                type="number" 
                step="0.01" 
                className="form-control" 
                placeholder="0.00" 
                required 
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Category</label>
              <input 
                name="category" 
                className="form-control" 
                placeholder="e.g., Food, Rent" 
                required 
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Description</label>
              <input 
                name="description" 
                className="form-control" 
                placeholder="Optional description" 
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Date</label>
              <input 
                name="date" 
                type="datetime-local" 
                className="form-control" 
                defaultValue={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="col-md-1 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100">
                <i className="bi bi-plus"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-funnel me-2"></i>
            Filters
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Type</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value)} 
                className="form-select"
              >
                <option value="">All Types</option>
                <option value="expense">Expenses</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Category</label>
              <input 
                placeholder="Filter by category" 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="form-control"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Search</label>
              <input 
                placeholder="Search descriptions" 
                value={q} 
                onChange={e => setQ(e.target.value)} 
                className="form-control"
              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button onClick={fetchList} className="btn btn-outline-primary w-100">
                <i className="bi bi-search me-1"></i>
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Transactions Table */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-list-ul me-2"></i>
                Recent Transactions
              </h5>
            </div>
            <div className="card-body p-0">
              {loading && (
                <div className="text-center p-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="alert alert-danger m-3" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
              {!loading && !error && (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th className="text-end">Amount</th>
                        <th>Description</th>
                        <th width="100">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center text-muted py-4">
                            <i className="bi bi-inbox" style={{ fontSize: '2rem' }}></i>
                            <div className="mt-2">No transactions found</div>
                          </td>
                        </tr>
                      ) : (
                        items.map(it => (
                          <tr key={it._id}>
                            <td>
                              <small className="text-muted">
                                {new Date(it.date).toLocaleDateString()}
                              </small>
                            </td>
                            <td>
                              <span className={`badge ${it.type === 'expense' ? 'bg-danger' : 'bg-success'}`}>
                                {it.type}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-secondary">{it.category}</span>
                            </td>
                            <td className="text-end">
                              <span className={`fw-bold ${it.type === 'expense' ? 'text-danger' : 'text-success'}`}>
                                {it.type === 'expense' ? '-' : '+'}${it.amount.toFixed(2)}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">{it.description || '-'}</small>
                            </td>
                            <td>
                              <button 
                                onClick={() => onDelete(it._id)} 
                                className="btn btn-sm btn-outline-danger"
                                title="Delete transaction"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Chart */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-pie-chart me-2"></i>
                Spending by Category
              </h5>
            </div>
            <div className="card-body">
              {categoryData.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-pie-chart" style={{ fontSize: '2rem' }}></i>
                  <div className="mt-2">No data to display</div>
                </div>
              ) : (
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={categoryData} 
                        dataKey="value" 
                        nameKey="name" 
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


