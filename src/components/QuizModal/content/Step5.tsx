import React, { Fragment, FunctionComponent, useState } from 'react';
import '../QuizModal.scss';

import Input from '../../Input';

interface IProps {
  stepTitle?: string;
}

const Step5: FunctionComponent<IProps> = ({ stepTitle }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  return (
    <Fragment>
      <div className="quiz-modal__step">
        <div className="quiz-modal__step_number">
          <span>5</span>
          <span>from 5</span>
        </div>
        <div className="quiz-modal__step_title">{stepTitle}</div>
      </div>
      <h4 className="modal__title quiz-modal__title">Contact details (optional)</h4>
      <small>
        Please add your contact details here so that we can contact you with new opportunities that
        fit your requirements, as well as check how you are getting on.
      </small>
      <div className="quiz-modal__content">
        <p className="title">Your information will remain completely confidential.</p>

        <div className="form-control-text">
          <label htmlFor="fullname">Full Name</label>
          <Input
            id="fullname"
            type="text"
            onChange={e => setFullName(e.target.value)}
            value={fullName}
          />
        </div>

        <div className="form-control-text">
          <label htmlFor="email">Email Address</label>
          <Input id="email" type="email" onChange={e => setEmail(e.target.value)} value={email} />
        </div>

        <div className="form-control-text">
          <label htmlFor="phone">Mobile phone number</label>
          <Input
            id="phone"
            type="text"
            onChange={e => setPhone(e.target.value)}
            value={phone}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Step5;
