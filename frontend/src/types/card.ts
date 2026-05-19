export type CardType = 'user' | 'project' | 'pin';

export interface CardProps {
  type: CardType;
  image: string;
  title: string;    // h1
  subtitle: string; // h2
  description: string; // p
  tags: string[];
  ctaText: string;
  onCtaClick: () => void;
}
