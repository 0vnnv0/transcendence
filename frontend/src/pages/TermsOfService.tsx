import type { FC } from 'react';
import LegalContent from './LegalContent';

const TermsOfService: FC = () => {
  return (
    <LegalContent
      title="Terms of Service"
      lastUpdated="September 2026"
      sections={[
        {
          heading: '1. Acceptance of Terms',
          paragraph:
            'By registering, logging in via 42 OAuth, or using this social media platform, you agree to comply with these Terms of Service. This platform is an educational software project created for peer evaluation at 42 School.',
        },
        {
          heading: '2. User Accounts & 42 Authentication',
          paragraph:
            'Access to social features (messaging, adding friends) requires logging in with a valid 42 account via 42 OAuth. You remain responsible for all activity conducted through your session and account.',
        },
        {
          heading: '3. Community Standards & Code of Conduct',
          paragraph:
            'As a community platform, users are expected to adhere to the 42 Student Code of Conduct. You explicitly agree NOT to:',
          list: [
            'Post or transmit hate speech, offensive, harassing, pornographic, or abusive content in private messages.',
            'Impersonate other 42 students, staff members, or automated bots.',
            'Attempt cross-site scripting (XSS), API abuse, rate-limit circumvention, or unauthorized database access.',
            'Spam chats with automated scripts.',
          ],
        },
        {
          heading: '4. Content Ownership & Moderation',
          paragraph:
            'You retain ownership of the text and media you post. However, by posting content, you grant the platform permission to display it to other users. Platform administrators reserve the right to remove content or suspend accounts that violate community guidelines.',
        },
        {
          heading: '5. Service Availability & Project Scope',
          paragraph:
            'This site is provided on an "as-is" and "as-available" basis for testing and educational evaluation. The development team reserves the right to reset databases, purge message histories, or alter features without prior notice.',
        },
        {
          heading: '6. Limitation of Liability',
          paragraph:
            'The developers and 42 School carry no liability for lost data, service interruptions, or user disputes arising from the use of this social platform.',
        },
      ]}
    />
  );
};

export default TermsOfService;
