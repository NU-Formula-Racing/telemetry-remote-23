import styled from 'styled-components';

import SearchBar from './SearchBar';
import Upload from './Upload';
import ButtonTray from './ButtonTray';
import RowHolder from '../../shared/RowHolder';
import StyledStatus from '../../shared/StyledStatus';

export default function Topbar(props) {
  var display;
  if (props.isLive) {
    display =
      <>
        <RowHolder>
          Status:
          {props.receiving
            ? <StyledStatus valid> Reading Live Data</StyledStatus> // Keep whitespace before text
            : <StyledStatus> No Data Received</StyledStatus>        // Keep whitespace before text
          }
        </RowHolder>
        <ButtonTray viewState={props.viewState} setViewState={props.setViewState} />
      </>;
  } else {
    display =
    <>
      <SearchBar/>
      {/* <Upload /> */}
    </>;
  }

  return (
    <Container>
      {display}
    </Container>
  );
}

const Container = styled.div`
  width: calc(100% + 16px);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
