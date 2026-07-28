import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { extractErrorMessage } from '../utils/errors';
import { Mail, Lock, User, Hash, GraduationCap } from 'lucide-react';

const initialForm = { studentCode: '', fullName: '', email: '', password: '' };

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500); 
    } catch (err) {
      setError(extractErrorMessage(err, 'Đăng ký thất bại, vui lòng thử lại'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10">
        
        {/* LOGO MỚI Ở ĐÂY */}
        <div className="mb-8 text-center">
           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-orange-400 shadow-lg shadow-pink-500/30">
            <GraduationCap size={32} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Tạo tài khoản</h1>
          <p className="text-sm text-slate-500 mt-2">Bắt đầu hành trình diệt deadline của bạn</p>
        </div>

        {error && (
          <div className="mb-6 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-3 flex items-start gap-2">
             <span className="mt-0.5"></span>
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-start gap-2">
            <span className="mt-0.5"></span>
            <p>Đăng ký thành công! Đang chuyển hướng...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Mã Sinh Viên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Hash size={16} />
                </div>
                <input
                  type="text"
                  name="studentCode"
                  required
                  value={form.studentCode}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all"
                  placeholder="SV001"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Họ và Tên
              </label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all"
                  placeholder="Meo Meo"
                />
              </div>
            </div>
          </div>

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
                minLength={6}
                value={form.password}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all"
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>
          </div>

          <Button type="submit" disabled={submitting} className="w-full py-3 mt-4 text-base">
            {submitting ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-pink-600 font-semibold hover:text-pink-700 hover:underline transition-colors">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
