import { Link } from 'react-router-dom';
import type { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="flex items-center gap-4 bg-transparent justify-center pb-6 pt-2">
      <Link
        to="/terms-and-conditions"
        className="text-footer text-gray-500"
      >
        Terms and Conditions
      </Link>
      <Link
        to="/privacy-policy"
        className="text-footer text-gray-500"
      >
        Privacy Policy
      </Link>
    </footer>
  );
};

export default Footer;
