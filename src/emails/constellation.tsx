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

const RELATIONSHIP_ORDER: { key: RelationshipType; label: string; oneLine: string; emoji: string }[] = [
  { key: "precursor", label: "YOUR ROOT", oneLine: "This is where your thinking came from.", emoji: "🌱" },
  { key: "mirror", label: "YOUR REFLECTION", oneLine: "This is you — somewhere else entirely.", emoji: "🪞" },
  { key: "complement", label: "YOUR BLIND SPOT", oneLine: "This is what you don't naturally carry.", emoji: "🧩" },
  { key: "antagonist", label: "YOUR SHARPENER", oneLine: "This is the strongest case against you.", emoji: "⚔️" },
  { key: "shadow", label: "YOUR DISMISSAL", oneLine: "This is what you've been too quick to ignore.", emoji: "🌑" },
  { key: "horizon", label: "YOUR NEXT STEP", oneLine: "This is one step further than you've gone.", emoji: "🌅" },
  { key: "integrated_self", label: "YOUR DESTINATION", oneLine: "This is who you're becoming.", emoji: "✨" },
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
  const previewText = `${name}, here's your ${topicLabel} constellation`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={overline}>Your {topicLabel} Constellation</Text>
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
                <Text style={oneLineStyle}>{r.oneLine}</Text>
                <Heading as="h2" style={h2}>
                  {card.name}
                </Heading>
                {card.tagline && <Text style={tagline}>{card.tagline}</Text>}
                <Text style={para}>
                  <strong style={bold}>Why you: </strong>
                  {card.match_reason}
                </Text>
                {card.entry_point && (
                  <Text style={para}>
                    <strong style={bold}>Start with: </strong>
                    {card.entry_point}
                  </Text>
                )}
              </Section>
            );
          })}

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              <Link href={resultsUrl} style={link}>
                View your constellation online →
              </Link>
            </Text>
            <Text style={footerText}>
              <Link href={profileUrl} style={link}>
                See all your constellations
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
  margin: "0 0 4px",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
  fontWeight: 600,
};

const oneLineStyle: React.CSSProperties = {
  fontSize: 12,
  fontStyle: "italic",
  color: "#a3a3a3",
  margin: "0 0 10px",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
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
