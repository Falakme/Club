import React from 'react';
import PendingApproval from '../components/PendingApproval';

interface PendingApprovalPageProps {
  userEmail: string;
  onLogout: () => void;
}

const PendingApprovalPage: React.FC<PendingApprovalPageProps> = ({ userEmail, onLogout }) => {
  return <PendingApproval userEmail={userEmail} onLogout={onLogout} />;
};

export default PendingApprovalPage;