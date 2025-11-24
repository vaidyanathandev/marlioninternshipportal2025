'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, Button } from '@marlion/ui';
import { pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { OfferLetterPDF } from '../../lib/pdfGenerator';

export default function ResultsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const student = useQuery(
    api.students.getByClerkId,
    user ? { clerkId: user.id } : 'skip'
  );

  const interview = useQuery(
    api.interviews.getByStudent,
    student ? { studentId: student._id } : 'skip'
  );

  const updateStatus = useMutation(api.students.updateStatus);
  const createCertificate = useMutation(api.certificates.create);

  useEffect(() => {
    // Auto-update status based on interview results
    if (student && interview && interview.completedAt) {
      if (interview.score >= 60 && !interview.flagged) {
        if (student.registrationStatus !== 'selected') {
          updateStatus({ studentId: student._id, status: 'selected' });
        }
      } else {
        if (student.registrationStatus !== 'rejected') {
          updateStatus({ studentId: student._id, status: 'rejected' });
        }
      }
    }
  }, [student, interview]);

  const generateOfferLetter = async () => {
    if (!student || !agreedToTerms) return;

    setIsGenerating(true);
    try {
      // Generate verification code
      const verificationCode = `ML-${Date.now().toString(36).toUpperCase()}`;

      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(
        `${window.location.origin}/verify/${verificationCode}`,
        { width: 300 }
      );

      // Generate PDF
      const streamName = {
        immersive: 'Immersive Tech (AR/VR)',
        fullstack: 'Full Stack Apps',
        agentic: 'Agentic AI',
        datascience: 'Data Science (AI & ML)',
      }[student.stream];

      const pdfDoc = (
        <OfferLetterPDF
          studentName={student.fullName}
          email={student.email}
          stream={streamName}
          startDate={student.startDate}
          endDate={student.endDate}
          college={student.college}
          qrCodeDataUrl={qrCodeDataUrl}
          verificationCode={verificationCode}
        />
      );

      const blob = await pdf(pdfDoc).toBlob();

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
      link.download = `Marlion_Offer_Letter_${student.fullName.replace(/\s/g, '_')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Failed to generate offer letter:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!student || !interview) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="text-center">
          <div className="inline-block p-4 bg-blue-500/10 rounded-full mb-4 animate-pulse">
            <svg className="w-12 h-12 text-blue-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-slate-300 text-lg">Loading results...</p>
        </div>
      </div>
    );
  }

  const isSelected = student.registrationStatus === 'selected';
  const isRejected = student.registrationStatus === 'rejected';

  if (isSelected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="max-w-3xl" glass>
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-green-500/10 rounded-full mb-4">
              <svg className="w-16 h-16 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-100 mb-4">
              Congratulations, {student.fullName}!
            </h1>
            <p className="text-xl text-slate-300">
              You've been selected for the Marlion Winter Internship 2025
            </p>
          </div>

          {/* Interview Scores */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <p className="text-sm text-slate-400 mb-2">Overall Score</p>
              <p className="text-3xl font-bold text-blue-400">{interview.score}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <p className="text-sm text-slate-400 mb-2">Technical</p>
              <p className="text-3xl font-bold text-purple-400">
                {interview.technicalScore}
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <p className="text-sm text-slate-400 mb-2">Mindset</p>
              <p className="text-3xl font-bold text-green-400">
                {interview.psychologicalScore}
              </p>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">
              AI Assessment Summary
            </h3>
            <p className="text-slate-300 leading-relaxed">{interview.summary}</p>
          </div>

          {/* Rules & Guidelines */}
          <div className="bg-slate-800/50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Internship Rules & Guidelines
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Maintain 90% attendance throughout the internship</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Submit daily progress logs via the dashboard</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Complete all bootcamp modules with passing scores</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Work on your assigned project with regular updates</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Maintain professionalism and respect for all team members</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Do not share proprietary information outside the organization</span>
              </li>
            </ul>
          </div>

          {/* Agreement Checkbox */}
          <label className="flex items-start gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-5 h-5 rounded bg-[#0f172a] border-slate-700 text-blue-600 focus:ring-2 focus:ring-blue-500 mt-0.5"
            />
            <span className="text-slate-300">
              I have read and agree to abide by all the internship rules and
              guidelines stated above.
            </span>
          </label>

          {/* Download Button */}
          <Button
            onClick={generateOfferLetter}
            disabled={!agreedToTerms || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              'Generating Offer Letter...'
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Offer Letter
              </>
            )}
          </Button>
        </Card>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="max-w-2xl text-center" glass>
          <div className="mb-6">
            <div className="inline-block p-4 bg-slate-700/30 rounded-full mb-4">
              <svg className="w-16 h-16 text-slate-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Thank You for Your Interest
            </h2>
            <p className="text-slate-300 text-lg mb-6">
              After careful consideration, we regret to inform you that we are
              unable to offer you a position in this internship cycle.
            </p>
            <p className="text-slate-400 mb-8">
              We received an overwhelming number of applications, and the
              selection process was highly competitive. We encourage you to
              continue developing your skills and apply for future opportunities.
            </p>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">
              Keep Learning & Growing
            </h3>
            <p className="text-slate-300 mb-4">
              Here are some resources to help you prepare for future internships:
            </p>
            <ul className="text-left text-slate-400 space-y-2">
              <li>• Practice coding on platforms like LeetCode and HackerRank</li>
              <li>• Build projects focused on assistive technology</li>
              <li>• Contribute to open-source projects</li>
              <li>• Stay updated with AI and XR technologies</li>
            </ul>
          </div>

          <Button onClick={() => router.push('/')} variant="secondary">
            Return to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  // Pending state
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="max-w-2xl text-center" glass>
        <div className="inline-block p-4 bg-blue-500/10 rounded-full mb-4 animate-pulse">
          <svg className="w-16 h-16 text-blue-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-100 mb-4">
          Results Under Review
        </h2>
        <p className="text-slate-300 text-lg">
          Your interview has been completed successfully. Our team is reviewing
          all applications. Please check back within 24 hours for your results.
        </p>
      </Card>
    </div>
  );
}
