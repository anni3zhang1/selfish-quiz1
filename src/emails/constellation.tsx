import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Link,
  Hr,
  Preview,
} from "@react-email/components";
import type { Constellation, RelationshipType } from "@/lib/types";

const RELATIONSHIP_ORDER: { key: RelationshipType; label: string; emoji: string }[] = [
  { key: "mirror", label: "Your Reflection", emoji: "🪞" },
  { key: "complement", label: "Your Blind Spot", emoji: "🧩" },
  { key: "precursor", label: "Your Root", emoji: "🌱" },
  { key: "antagonist", label: "Your Sharpener", emoji: "⚔️" },
  { key: "horizon", label: "Your Next Step", emoji: "🌅" },
  { key: "shadow", label: "Your Dismissal", emoji: "🌑" },
  { key: "integrated_self", label: "Your Destination", emoji: "✨" },
];

type Props = {
  name: string;
  topicLabel: string;
  profileSummary?: string;
  constellation: Constellation;
  resultsUrl: string;
  profileUrl: string;
};

export default function ConstellationEmail({
  name,
  topicLabel,
  profileSummary,
  constellation,
  resultsUrl,
  profileUrl,
}: Props) {
  const previewText = `${name}, here's your ${topicLabel} intellectual map`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={overline}>Your {topicLabel} Intellectual Map</Text>
            <Heading style={h1}>{name}&rsquo;s intellectual map</Heading>
            {profileSummary && <Text style={lede}>{profileSummary}</Text>}
          </Section>

          <Hr style={hr} />

          {RELATIONSHIP_ORDER.map((r) => {
            const card = constellation[r.key];
            if (!card) return null;
            return (
              <Section key={r.key} style={cardSection}>
                <Text style={typeLabel}>
                  {r.emoji} {r.label}
                </Text>
                <Heading as="h2" style={h2}>
                  {card.name}
                </Heading>
                <Text style={tagline}>{card.tagline}</Text>
                <Text style={para}>
                  <strong style={bold}>Why you: </strong>
                  {card.match_reason}
                </Text>
              </Section>
            );
          })}

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              <Link href={resultsUrl} style={link}>
                View your intellectual map online →
              </Link>
            </Text>
            <Text style={footerText}>
              <Link href={profileUrl} style={link}>
                See all your intellectual maps
              </Link>
            </Text>
            <Text style={footerSmall}>
              Come back any time to explore a new topic.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#fafaf8",
  fontFamily:
    "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "32px 24px",
  backgroundColor: "#fafaf8",
};

const header: React.CSSProperties = {
  paddingBottom: 12,
};

const overline: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: "#737373",
  margin: "0 0 8px",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
};

const h1: React.CSSProperties = {
  fontSize: 30,
  lineHeight: 1.2,
  color: "#1a1a1a",
  margin: "0 0 12px",
  fontWeight: 400,
};

const lede: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.5,
  color: "#404040",
  margin: "8px 0 0",
  fontStyle: "italic",
};

const hr: React.CSSProperties = {
  borderColor: "#e5e5e5",
  margin: "28px 0",
};

const cardSection: React.CSSProperties = {
  padding: "20px 0",
  borderBottom: "1px solid #ededed",
};

const typeLabel: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: "#737373",
  margin: "0 0 8px",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
  fontWeight: 600,
};

const h2: React.CSSProperties = {
  fontSize: 22,
  lineHeight: 1.3,
  color: "#1a1a1a",
  margin: "0 0 4px",
  fontWeight: 500,
};

const tagline: React.CSSProperties = {
  fontSize: 14,
  fontStyle: "italic",
  color: "#525252",
  margin: "0 0 14px",
};

const para: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: "#262626",
  margin: "0 0 10px",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
};

const bold: React.CSSProperties = { color: "#1a1a1a" };

const footer: React.CSSProperties = {
  paddingTop: 12,
  textAlign: "center",
};

const footerText: React.CSSProperties = {
  margin: "8px 0",
  fontSize: 14,
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
};

const footerSmall: React.CSSProperties = {
  margin: "16px 0 0",
  fontSize: 12,
  color: "#737373",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
};

const link: React.CSSProperties = {
  color: "#1a1a1a",
  textDecoration: "underline",
};
