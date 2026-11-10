import React, { useState } from 'react';
import { Building2, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Zap, Activity, Cpu } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>('adimin');
  const [password, setPassword] = useState<string>('admin123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showForgotToast, setShowForgotToast] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('请输入登录账号');
      return;
    }
    if (!password) {
      setErrorMessage('请输入登录密码');
      return;
    }

    // 仅允许账号 adimin 与密码 admin123 登录，其他均拒绝
    if (username.trim() !== 'adimin' || password !== 'admin123') {
      setErrorMessage('账号或密码错误，仅允许账号 adimin 且密码为 admin123 登录');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#020714] text-slate-100 flex font-sans select-none overflow-hidden">
      {/* Left Login Container */}
      <div className="w-full lg:w-[480px] xl:w-[540px] shrink-0 p-8 lg:p-12 flex flex-col justify-between bg-[#040e24] border-r border-cyan-500/30 shadow-2xl z-20 relative">
        {/* Background Subtle Tech Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Top Header & Brand */}
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] border border-cyan-400/50">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
                园区智能管控系统
              </h1>
              <p className="text-xs text-cyan-400 font-mono tracking-wider">
                CAMPUS INTELLIGENT CONTROL SYSTEM
              </p>
            </div>
          </div>
        </div>

        {/* Center Login Form */}
        <div className="relative z-10 my-auto py-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-wide">欢迎登录系统</h2>
            <p className="text-xs text-slate-400">请输入您的管理账号和密码访问全域智能管控平台</p>
          </div>

          {/* Login Type Switcher (Account & Password mode enforced) */}
          <div className="flex border-b border-[#133063] pb-1 gap-6 text-sm font-bold">
            <div className="text-cyan-400 border-b-2 border-cyan-400 pb-2 flex items-center gap-2 transition-all">
              <User className="w-4 h-4" />
              <span>账号密码登录</span>
            </div>
          </div>

          {/* Error Message banner */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-2 animate-shake">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">账号 / 工号</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入账号"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#081b42]/80 border border-[#133063] text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">密码</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#081b42]/80 border border-[#133063] text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-cyan-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#133063] bg-[#081b42] text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span>记住密码</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotToast(true)}
                className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                忘记密码？
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>登录中...</span>
                </>
              ) : (
                <>
                  <span>登录</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer & Badges */}
        <div className="relative z-10 pt-4 border-t border-[#133063]/60 space-y-3">
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>7×24h 智能管控</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Zap className="w-3.5 h-3.5" />
              <span>IoT 传感器联动</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-blue-400">
              <Activity className="w-3.5 h-3.5" />
              <span>3D 数字孪生</span>
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            © 2026 智慧园区综合管理平台 IBMS System. All Rights Reserved.
          </div>
        </div>
      </div>

      {/* Right Hero Image & Visual Display Container */}
      <div className="flex-1 relative hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden bg-[#020714]">
        {/* Generated 3D Smart Park Visual Background */}
        <img
          src="/src/assets/images/smart_park_login_hero_1794115095796.jpg"
          alt="智慧园区 3D 数字孪生"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => {
            e.currentTarget.src = "/assets/aistudio/image_083a1294.png";
          }}
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040e24] via-[#020714]/40 to-[#040e24]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040e24] via-transparent to-transparent w-48" />

        {/* Top Right Live Telemetry Badge */}
        <div className="relative z-10 flex justify-end">
          <div className="px-4 py-2 rounded-2xl bg-[#06122d]/80 border border-cyan-500/40 backdrop-blur-md text-xs font-mono flex items-center gap-4 text-cyan-300 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>园区系统运行状态：正常</span>
            </div>
            <span className="text-slate-600">|</span>
            <div>设备在线率：<span className="text-white font-bold">99.4%</span></div>
          </div>
        </div>

        {/* Bottom Left Floating Tech Cards */}
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wider uppercase">
              <Cpu className="w-3.5 h-3.5" />
              <span>Next-Gen Smart Campus Solution</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
              全域感知 · 3D 数字孪生 · 协同调度
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              基于物联网与 AI 告警引擎，实现园区变配电、给排水、暖通空调、照明、安防门禁与环境监测的万物互联与一站式图形化控制。
            </p>
          </div>

          {/* 3 Key Capability Feature Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#06122d]/80 border border-cyan-500/30 backdrop-blur-md space-y-1">
              <div className="text-cyan-300 font-bold text-xs">3D 数字孪生感知</div>
              <div className="text-[11px] text-slate-400">楼层可视化建模与全息监控</div>
            </div>
            <div className="p-4 rounded-xl bg-[#06122d]/80 border border-cyan-500/30 backdrop-blur-md space-y-1">
              <div className="text-cyan-300 font-bold text-xs">全域能耗双控</div>
              <div className="text-[11px] text-slate-400">水电气暖实时采集与超标预警</div>
            </div>
            <div className="p-4 rounded-xl bg-[#06122d]/80 border border-cyan-500/30 backdrop-blur-md space-y-1">
              <div className="text-cyan-300 font-bold text-xs">智能安防联动</div>
              <div className="text-[11px] text-slate-400">AI 视频巡检与工单闭环处理</div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Toast */}
      {showForgotToast && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#06122d] border border-cyan-500/50 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">重置密码提示</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              为保障园区系统安全，管理员密码重置请联系园区 IT 运维中心或值班主管。<br />
              <span className="font-mono text-cyan-300 block mt-2 font-bold">服务热线: 010-88889999</span>
            </p>
            <button
              onClick={() => setShowForgotToast(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow transition-all cursor-pointer"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
