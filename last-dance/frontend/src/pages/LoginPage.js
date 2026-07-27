import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { extractErrorMessage } from '../utils/errors';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(extractErrorMessage(err, 'Đăng nhập thất bại, vui lòng thử lại'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6">
          <p className="text-lg font-bold text-[#1e2a5e] leading-tight">Student</p>
          <p className="text-lg font-bold text-pink-500 leading-tight">Deadline Manager</p>
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-1">Đăng nhập</h1>
        <p className="text-sm text-gray-400 mb-6">Chào mừng bạn quay trở lại</p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              placeholder="ban@gmail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-orange-600 font-semibold hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
