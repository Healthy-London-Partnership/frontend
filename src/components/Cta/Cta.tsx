import React from 'react';

import './Cta.scss';

import ButtonLink from '../../components/Button/ButtonLink';

interface IProps {
  title?: string;
  description?: string;
  buttonUrl?: string;
}

const Cta: React.FunctionComponent<IProps> = ({ title, description, buttonUrl }) => (
  <div className="cta">
    <div className="cta-info">
      <h2 className="cta-title">{title}</h2>
      <p className="cta-description">{description}</p>
    </div>
    {buttonUrl &&
      <ButtonLink
        text="Read more"
        href={buttonUrl}
        />
    }
  </div>  
);

export default Cta;
