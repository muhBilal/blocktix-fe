import { formatPrice } from "@/lib/format";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EventCreatedEmailProps {
  userFirstname: string | null;
  eventPrice: number;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const EventCreatedEmail = ({
  userFirstname,
  eventPrice,
}: EventCreatedEmailProps) => (
  <Html>
    <Head />
    <Preview>Event Anda berhasil diupload, segera lakukan pembayaran.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/logo.png`}
          width="170"
          height="50"
          alt="Company Logo"
          style={{
            objectFit: "contain",
            margin: "0 auto",
          }}
        />
        <Text style={paragraph}>Hi {userFirstname},</Text>
        <Text style={paragraph}>
          Terima kasih telah membuat event di Annect! Sebelum event Anda dapat
          diakses oleh komunitas, Anda perlu menyelesaikan pembayaran sebesar{" "}
          <strong>{formatPrice(eventPrice)}</strong>.
        </Text>
        <Text style={paragraph}>
          Setelah pembayaran sebesar <strong>{formatPrice(eventPrice)}</strong>{" "}
          selesai, event Anda akan segera tersedia untuk seluruh komunitas
          Annect.
        </Text>
        <Text style={paragraph}>
          <strong>Informasi Rekening Pembayaran:</strong>
          <br />
          Bank: <strong>BCA</strong>
          <br />
          Nomor Rekening: <strong>2737423456</strong>
          <br />
          Atas Nama: <strong>Annect Head Officer</strong>
        </Text>
        <Text style={paragraph}>
          Best,
          <br />
          The Annect team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          Universitas Pembangunan Negeri Veteran Jawa Timur, Indonesia
        </Text>
      </Container>
    </Body>
  </Html>
);

EventCreatedEmail.PreviewProps = {
  userFirstname: "Alan",
} as EventCreatedEmailProps;

export default EventCreatedEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
