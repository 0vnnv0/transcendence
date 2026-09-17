import type { FC } from 'react';
import LegalContent from './LegalContent';

const PrivacyPolicy: FC = () => {
  return (
    <LegalContent
      title="Privacy Policy"
      lastUpdated="September 2026"
      sections={[
        {
          heading: '1. Overview',
          paragraph:
            'This Privacy Policy outlines how our 42-based Social Media Application collects, uses, and protects your personal data. This project was developed for educational purposes as part of the 42 School curriculum (ft_transcendence).',
        },
        {
          heading: '2. Information We Collect',
          paragraph:
            'We process data necessary to provide social networking features on our platform:',
          list: [
            '42 API OAuth Data: When you log in via 42 OAuth 2.0, we request read-access to fetch public profile details, including your 42 intra login, display name, primary email address, campus location, and official avatar image URL.',
            'User-Generated Content: chat messages, uploaded media, and profile customizations.',
            'Social Connections: Friend lists.',
            'Technical Data & Session Management: JSON Web Tokens (JWT), IP addresses, and WebSocket connection logs necessary for maintaining active connections and real-time updates.',
          ],
        },
        {
          heading: '3. How We Use Your Data',
          paragraph: 'We use your information exclusively within the application to:',
          list: [
            'Authenticate your identity via 42 Intra single sign-on (SSO).',
            'Populate your public user profile with verified 42 campus data.',
            'Deliver real-time notifications and direct messaging services.',
          ],
        },
        {
          heading: '4. Data Storage & Security',
          paragraph:
            'Your authentication tokens and sensitive credentials are encrypted or securely hashed prior to database storage. While this application is an educational prototype, we apply standard web security practices (such as HTTPS transport security, and input sanitation) to prevent unauthorized access.',
        },
        {
          heading: '5. Third-Party Sharing',
          paragraph:
            'We do not sell, rent, or share user data with external commercial entities. Data communication occurs strictly between your browser, our application server, and the 42 API infrastructure for login verification.',
        },
        {
          heading: '6. Account & Data Deletion',
          paragraph:
            'You have the right to request the deletion of your account and associated social media data stored in our database. You can initiate account deletion by contacting a project maintainer on 42 Intra.',
        },
      ]}
    />
  );
};

export default PrivacyPolicy;
