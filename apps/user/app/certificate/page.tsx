'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, Button } from '@marlion/ui';
import { pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { CertificatePDF } from '../../lib/certificateGenerator';

export default function CertificatePage() {
  const router = useRouter();
  const { user } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);

  const student = useQuery(
    api.students.getByClerkId,
    user ? { clerkId: user.id } : 'skip'
  );

  const bootcampProgress = useQuery(
    api.bootcamp.getProgress,
    student ? { studentId: student._id } : 'skip'
  );

  const modules = useQuery(
    api.bootcamp.listModules,
    student ? { stream: student.stream } : 'skip'
  );

  const certificate = useQuery(
    api.certificates.getByStudent,
    student ? { studentId: student._id } : 'skip'
  );

  const createCertificate = useMutation(api.certificates.create);

  // Calculate overall progress
  const totalModules = modules?.length || 0;
  const completedModules = bootcampProgress?.filter((p) => p.completed).length || 0;
  const progress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  const isEligible = progress === 100;

  const handleGenerateCertificate = async () => {
    if (!student || !isEligible) return;

    setIsGenerating(true);
    try {
      // Generate verification code
      const verificationCode = `MC-${Date.now().toString(36).toUpperCase()}`;

      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(
        `${window.location.origin}/verify/${verificationCode}`,
        { width: 300 }
      );

      // Stream name mapping
      const streamNames = {
        immersive: 'Immersive Tech (AR/VR)',
        fullstack: 'Full Stack Apps',
        agentic: 'Agentic AI',
        datascience: 'Data Science (AI & ML)',
      };

      // Generate PDF
      const certificateDoc = (
        <CertificatePDF
          studentName={student.fullName}
          stream={streamNames[student.stream]}
          completionDate={new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
          qrCodeDataUrl={qrCodeDataUrl}
          verificationCode={verificationCode}
        />
      );

      const blob = await pdf(certificateDoc).toBlob();

      // Save certificate record
      await createCertificate({
        studentId: student._id,
        verificationCode,
        pdfUrl: verificationCode, // In production, upload to Convex storage
      });

      // Download PDF
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Marlion_Certificate_${student.fullName.replace(/\s/g, '_')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate certificate:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block p-4 bg-blue-500/10 rounded-full mb-4 animate-pulse">
            <svg className="w-12 h-12 text-blue-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-slate-300 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="max-w-3xl w-full" glass>
        {isEligible || certificate ? (
          <>
            {/* Success State */}
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-green-500/10 rounded-full mb-4">
                <svg className="w-16 h-16 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-slate-100 mb-4">
                Congratulations, {student.fullName}! 🎉
              </h1>
              <p className="text-xl text-slate-300">
                You've successfully completed the Winter Internship 2025
              </p>
            </div>

            {/* Journey Summary */}
            <Card className="mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">
                Your Internship Journey
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-slate-100">{completedModules}</p>
                  <p className="text-sm text-slate-400">Modules Completed</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-100">
                    {student.stream.charAt(0).toUpperCase() + student.stream.slice(1)}
                  </p>
                  <p className="text-sm text-slate-400">Stream</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-100">100%</p>
                  <p className="text-sm text-slate-400">Progress</p>
                </div>
              </div>
            </Card>

            {/* Download Button */}
            {certificate ? (
              <div className="text-center">
                <p className="text-slate-400 mb-4">
                  Certificate already generated. Download again below:
                </p>
                <Button onClick={handleGenerateCertificate} size="lg" disabled={isGenerating}>
                  {isGenerating ? (
                    'Generating...'
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Certificate
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button onClick={handleGenerateCertificate} className="w-full" size="lg" disabled={isGenerating}>
                {isGenerating ? (
                  'Generating Certificate...'
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Generate & Download Certificate
                  </>
                )}
              </Button>
            )}

            <div className="mt-8 flex gap-4">
              <Button variant="secondary" onClick={() => router.push('/dashboard')} className="flex-1">
                Back to Dashboard
              </Button>
              <Button variant="ghost" onClick={() => router.push('/')} className="flex-1">
                Go to Homepage
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Not Eligible State */}
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-blue-500/10 rounded-full mb-4">
                <svg className="w-16 h-16 text-blue-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-slate-100 mb-4">
                Certificate Not Yet Available
              </h1>
              <p className="text-slate-300 mb-2">
                Complete 100% of your internship to unlock your certificate
              </p>
              <p className="text-slate-400">Current Progress: {Math.round(progress)}%</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Remaining Tasks */}
            <Card className="mb-8 bg-blue-500/5 border-blue-500/20">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">
                To Earn Your Certificate
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <svg className={`w-5 h-5 ${progress >= 100 ? 'text-green-500' : 'text-slate-500'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Complete all bootcamp modules</span>
                  <span className="ml-auto text-sm text-slate-500">
                    {completedModules}/{totalModules}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Complete your project</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Submit daily logs regularly</span>
                </li>
              </ul>
            </Card>

            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Continue Internship
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
