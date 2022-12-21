import styled from 'styled-components';

export default function SVGButton(props) {
  return(
    <StyledSVG
      src={props.src}
      alt={props.label}
      width='25px'
      height='25px'
      onClick={() => {props.setViewState(props.label)}}
      selected={props.selected}
    />
  );
}

const StyledSVG = styled.img`
  cursor: pointer;
  filter: brightness(${props => (props.selected ? 0.5 : 1)});
  transition: 0.07s ease;
`;
