import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { extractErrorMessage } from '../utils/errors';
import { Mail, Lock, GraduationCap } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10">
        
        {/* LOGO MỚI Ở ĐÂY */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-orange-400 shadow-lg shadow-pink-500/30">
            <GraduationCap size={32} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Chào mừng trở lại!</h1>
          <p className="text-sm text-slate-500 mt-2">Đăng nhập để tiếp tục quản lý deadline</p>
        </div>

        {error && (
          <div className="mb-6 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-3 flex items-start gap-2">
            <span className="mt-0.5"></span>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all"
                placeholder="mail-your@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" disabled={submitting} className="w-full py-3 mt-2 text-base">
            {submitting ? 'Đang xác thực...' : 'Đăng nhập'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-pink-600 font-semibold hover:text-pink-700 hover:underline transition-colors">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
