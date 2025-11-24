import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 60,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  border: {
    border: '10px solid #3B82F6',
    padding: 40,
    height: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 20,
  },
  certificateTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginVertical: 30,
    letterSpacing: 2,
  },
  presentedTo: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 15,
  },
  studentName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 30,
    borderBottom: '2px solid #3B82F6',
    paddingBottom: 10,
  },
  description: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 1.6,
    marginBottom: 40,
    paddingHorizontal: 40,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  signature: {
    borderTop: '1px solid #0F172A',
    width: 150,
    paddingTop: 5,
    textAlign: 'center',
  },
  signatureLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  qrCode: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginTop: 20,
  },
  verificationText: {
    fontSize: 8,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 5,
  },
});

interface CertificateProps {
  studentName: string;
  stream: string;
  completionDate: string;
  qrCodeDataUrl: string;
  verificationCode: string;
}

export const CertificatePDF = ({
  studentName,
  stream,
  completionDate,
  qrCodeDataUrl,
  verificationCode,
}: CertificateProps) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.border}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>MARLION TECHNOLOGIES</Text>
          <Text style={styles.subtitle}>
            A-34, Kumarasamy Street, Madurai 625006
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.certificateTitle}>CERTIFICATE OF COMPLETION</Text>

        {/* Presented To */}
        <Text style={styles.presentedTo}>This certificate is proudly presented to</Text>

        {/* Student Name */}
        <Text style={styles.studentName}>{studentName}</Text>

        {/* Description */}
        <Text style={styles.description}>
          For successfully completing the Winter Internship 2025 program in{' '}
          <Text style={{ fontWeight: 'bold', color: '#3B82F6' }}>{stream}</Text>.
          {'\n\n'}
          Throughout this internship, the recipient demonstrated exceptional dedication,
          technical proficiency, and a strong commitment to building assistive
          technology solutions for neurodiverse children.
        </Text>

        {/* Date */}
        <Text
          style={{
            fontSize: 12,
            color: '#475569',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          Completed on {completionDate}
        </Text>

        {/* QR Code */}
        <View style={{ alignItems: 'center' }}>
          <Image src={qrCodeDataUrl} style={styles.qrCode} />
          <Text style={styles.verificationText}>
            Verification Code: {verificationCode}
          </Text>
        </View>

        {/* Footer with Signature */}
        <View style={styles.footer}>
          <View style={styles.signature}>
            <Text style={signatureLabel}>CEO</Text>
            <Text style={signatureLabel}>Marlion Technologies</Text>
          </View>
          <View style={styles.signature}>
            <Text style={styles.signatureLabel}>Date of Issue</Text>
            <Text style={styles.signatureLabel}>{completionDate}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
