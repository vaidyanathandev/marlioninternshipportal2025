import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #3B82F6',
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748B',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginVertical: 20,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 12,
    color: '#0F172A',
    marginBottom: 10,
  },
  rulesBox: {
    backgroundColor: '#F1F5F9',
    padding: 15,
    borderRadius: 5,
    marginVertical: 20,
  },
  rulesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 10,
  },
  rule: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 5,
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: '1px solid #E2E8F0',
    paddingTop: 20,
    fontSize: 9,
    color: '#64748B',
  },
  qrCode: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 20,
  },
  signature: {
    marginTop: 40,
    borderTop: '1px solid #0F172A',
    width: 150,
    paddingTop: 5,
    fontSize: 10,
    color: '#0F172A',
  },
});

interface OfferLetterProps {
  studentName: string;
  email: string;
  stream: string;
  startDate: string;
  endDate: string;
  college: string;
  qrCodeDataUrl: string;
  verificationCode: string;
}

export const OfferLetterPDF = ({
  studentName,
  email,
  stream,
  startDate,
  endDate,
  college,
  qrCodeDataUrl,
  verificationCode,
}: OfferLetterProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>MARLION TECHNOLOGIES</Text>
        <Text style={styles.subtitle}>
          A-34, Kumarasamy Street, Madurai 625006
        </Text>
        <Text style={styles.subtitle}>social@marliontech.com | +91 94867 34438</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>WINTER INTERNSHIP 2025 - OFFER LETTER</Text>

      {/* Congratulations */}
      <Text
        style={{
          fontSize: 12,
          color: '#0F172A',
          marginBottom: 20,
          lineHeight: 1.6,
        }}
      >
        Dear {studentName},
        {'\n\n'}
        Congratulations! We are pleased to offer you an internship position at
        Marlion Technologies for our Winter Internship 2025 program. Your
        passion and technical aptitude have impressed our team.
      </Text>

      {/* Student Details */}
      <View style={styles.section}>
        <Text style={styles.label}>Student Name</Text>
        <Text style={styles.value}>{studentName}</Text>

        <Text style={styles.label}>Email Address</Text>
        <Text style={styles.value}>{email}</Text>

        <Text style={styles.label}>College/University</Text>
        <Text style={styles.value}>{college}</Text>

        <Text style={styles.label}>Internship Stream</Text>
        <Text style={styles.value}>{stream}</Text>

        <Text style={styles.label}>Duration</Text>
        <Text style={styles.value}>
          {startDate} to {endDate}
        </Text>
      </View>

      {/* Rules & Guidelines */}
      <View style={styles.rulesBox}>
        <Text style={styles.rulesTitle}>Internship Rules & Guidelines</Text>
        <Text style={styles.rule}>
          1. Attendance: Maintain 90% attendance throughout the internship period.
        </Text>
        <Text style={styles.rule}>
          2. Daily Logs: Submit daily progress reports via the dashboard.
        </Text>
        <Text style={styles.rule}>
          3. Bootcamp: Complete all assigned modules with passing quiz scores.
        </Text>
        <Text style={styles.rule}>
          4. Project: Work on your assigned project and submit regular updates.
        </Text>
        <Text style={styles.rule}>
          5. Code of Conduct: Maintain professionalism and respect for all team
          members.
        </Text>
        <Text style={styles.rule}>
          6. Confidentiality: Do not share proprietary information outside the
          organization.
        </Text>
        <Text style={styles.rule}>
          7. Certificate: Will be issued upon successful completion (100%
          progress).
        </Text>
      </View>

      {/* QR Code */}
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Image src={qrCodeDataUrl} style={styles.qrCode} />
        <Text style={{ fontSize: 9, color: '#64748B', marginTop: 5 }}>
          Verification Code: {verificationCode}
        </Text>
      </View>

      {/* Signature */}
      <View style={{ alignItems: 'flex-end', marginTop: 30 }}>
        <View style={styles.signature}>
          <Text>CEO, Marlion Technologies</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>
          This offer letter is valid for the Winter Internship 2025 program. For
          queries, contact social@marliontech.com
        </Text>
      </View>
    </Page>
  </Document>
);
