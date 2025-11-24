'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@clerk/nextjs';
import { Card, CardHeader, CardTitle, CardContent, Input, Button, StepProgress } from '@marlion/ui';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function RegisterPage() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const createStudent = useMutation(api.students.create);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Basic Info
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });

  // Step 2: OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);

  // Step 3: Student Details
  const [studentData, setStudentData] = useState({
    college: '',
    customCollege: '',
    yearOfStudy: 1,
    department: '',
    registerNumber: '',
    stream: 'fullstack' as 'immersive' | 'fullstack' | 'agentic' | 'datascience',
    startDate: '',
    endDate: '',
    specialRequests: '',
  });

  const colleges = [
    'Thiagarajar College of Engineering',
    'Kamaraj College of Engineering',
    'SRM Madurai College of Engineering',
    'Anna University Regional Campus (Ramanathapuram)',
    'Others',
  ];

  const streams = [
    { value: 'immersive', label: 'Immersive Tech (AR/VR)' },
    { value: 'fullstack', label: 'Full Stack Apps' },
    { value: 'agentic', label: 'Agentic AI' },
    { value: 'datascience', label: 'Data Science (AI & ML)' },
  ];

  // Step 1: Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError('');

    try {
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.fullName.split(' ')[0],
        lastName: formData.fullName.split(' ').slice(1).join(' '),
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setStep(2);
      startResendTimer();
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: otpCode,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        setStep(3);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete Registration
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const college =
        studentData.college === 'Others'
          ? studentData.customCollege
          : studentData.college;

      await createStudent({
        clerkId: signUp?.createdUserId || '',
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        college,
        yearOfStudy: studentData.yearOfStudy,
        department: studentData.department,
        registerNumber: studentData.registerNumber,
        stream: studentData.stream,
        startDate: studentData.startDate,
        endDate: studentData.endDate,
        specialRequests: studentData.specialRequests || undefined,
      });

      router.push('/interview');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const startResendTimer = () => {
    let time = 60;
    const interval = setInterval(() => {
      time--;
      setResendTimer(time);
      if (time === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    try {
      await signUp?.prepareEmailAddressVerification({ strategy: 'email_code' });
      startResendTimer();
    } catch (err) {
      setError('Failed to resend code');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-2xl" glass>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Student Registration</CardTitle>
            <button
              onClick={() => router.push('/')}
              className="text-slate-400 hover:text-slate-200"
            >
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <StepProgress steps={3} currentStep={step} />
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <form onSubmit={handleSignUp} className="space-y-6">
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />

              <Input
                label="Create Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />

              <Input
                label="Phone Number (For Contact)"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Next Step →'}
              </Button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-blue-500/10 rounded-full mb-4">
                  <svg className="w-12 h-12 text-blue-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-slate-300 mb-2">
                  Enter the 6-digit code sent to
                </p>
                <p className="text-blue-400 font-semibold">{formData.email}</p>
              </div>

              <div className="flex gap-3 justify-center mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold rounded-lg bg-[#0f172a] border-2 border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ))}
              </div>

              <div className="text-center mb-6">
                {resendTimer > 0 ? (
                  <p className="text-slate-400 text-sm">
                    Resend code in {resendTimer}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>
          )}

          {/* Step 3: Student Details */}
          {step === 3 && (
            <form onSubmit={handleCompleteRegistration} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wide">
                    College
                  </label>
                  <select
                    value={studentData.college}
                    onChange={(e) =>
                      setStudentData({ ...studentData, college: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select College</option>
                    {colleges.map((college) => (
                      <option key={college} value={college}>
                        {college}
                      </option>
                    ))}
                  </select>
                </div>

                {studentData.college === 'Others' && (
                  <div className="md:col-span-2">
                    <Input
                      label="College Name"
                      placeholder="Enter your college name"
                      value={studentData.customCollege}
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          customCollege: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wide">
                    Year of Study
                  </label>
                  <select
                    value={studentData.yearOfStudy}
                    onChange={(e) =>
                      setStudentData({
                        ...studentData,
                        yearOfStudy: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>

                <Input
                  label="Department"
                  placeholder="e.g., Computer Science"
                  value={studentData.department}
                  onChange={(e) =>
                    setStudentData({ ...studentData, department: e.target.value })
                  }
                  required
                />

                <Input
                  label="Register Number"
                  placeholder="e.g., 917719C045"
                  value={studentData.registerNumber}
                  onChange={(e) =>
                    setStudentData({
                      ...studentData,
                      registerNumber: e.target.value,
                    })
                  }
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wide">
                    College ID Proof
                  </label>
                  <label className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-slate-700 text-slate-400 cursor-pointer hover:border-blue-500 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm">Choose File</span>
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                  </label>
                  <p className="mt-2 text-xs text-slate-500">Allowed: PDF, DOC (Max 5MB)</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wide">
                    Internship Stream
                  </label>
                  <select
                    value={studentData.stream}
                    onChange={(e) =>
                      setStudentData({
                        ...studentData,
                        stream: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {streams.map((stream) => (
                      <option key={stream.value} value={stream.value}>
                        {stream.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Start Date"
                  type="date"
                  value={studentData.startDate}
                  onChange={(e) =>
                    setStudentData({ ...studentData, startDate: e.target.value })
                  }
                  required
                />

                <Input
                  label="End Date"
                  type="date"
                  value={studentData.endDate}
                  onChange={(e) =>
                    setStudentData({ ...studentData, endDate: e.target.value })
                  }
                  required
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wide">
                    Special Requests
                  </label>
                  <textarea
                    value={studentData.specialRequests}
                    onChange={(e) =>
                      setStudentData({
                        ...studentData,
                        specialRequests: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Any special requirements or accommodations needed?"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Completing Registration...' : 'Complete Registration'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
