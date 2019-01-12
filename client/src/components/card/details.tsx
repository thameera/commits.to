import { transparentize } from 'polished';
import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { prettyDate, relativeDate } from 'lib/helpers/format';
import { promisePath } from 'lib/helpers/path';

import { black, white } from 'lib/theme/colors';

const DetailDate = styled.div`
  color: ${white};
  font-size: .8rem;
  height: 100%;
  opacity: .75;
  padding: 1rem;
  text-align: right;
  text-transform: uppercase;
`;

const DetailDue = styled.div`
  background: ${transparentize(.25, black)};
  max-width: 25%;
`;

const DetailLink = styled(Link)`
  color: ${white};
  display: block;
  padding: 1rem;
  text-decoration: none;
`;

const DetailInfo = styled.div`
  flex: 3;
`;

const DetailText = styled.div`
  font-size: 1.1rem;
  letter-spacing: 0.025rem;
  margin-top: .25rem;
`;

const DetailNote = styled.div`
  font-size: .75rem;
  margin-top: .125rem;
  opacity: .75;
`;

const DetailRelativeDate = styled.div`
  color: ${white};
  font-size: .625rem;
  font-weight: 300;
  margin-bottom: .5rem;
  opacity: .7;
`;

const DetailWrapper = styled.div`
  flex: 1;
  display: flex;
`;

const CardDetails = ({ what, note, tdue, username, urtext }) => (
  <DetailWrapper>
    <DetailInfo>
      <DetailLink to={promisePath({ username, urtext })}>
        <DetailText>
          { what }
        </DetailText>
        { note &&
          <DetailNote>
            { note }
          </DetailNote>
        }
      </DetailLink>
    </DetailInfo>

    { tdue &&
      <DetailDue>
        <DetailDate>
          <DetailRelativeDate>
            { relativeDate(tdue) }
          </DetailRelativeDate>
          <div className='momentable'>
            <span>{ prettyDate(tdue) }</span>
          </div>
        </DetailDate>
      </DetailDue>
    }
  </DetailWrapper>
);

export default CardDetails;
