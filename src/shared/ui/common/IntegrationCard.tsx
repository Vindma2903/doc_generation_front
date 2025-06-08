import React from 'react';

interface IntegrationCardProps {
  logo: string;
  title: string;
  description: string;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  logo,
  title,
  description
}) => {
  return (
    <div className="integration-card">
      <img src={logo} alt={title} className="integration-logo" />
      <h3 className="integration-title">{title}</h3>
      <p className="integration-description">{description}</p>
      <button className="integration-button">
        Подключить
      </button>
    </div>
  );
};