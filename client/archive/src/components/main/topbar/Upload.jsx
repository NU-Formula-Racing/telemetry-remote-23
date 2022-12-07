import { useRef, useState } from 'react';
import styled from "styled-components";

import HorizSpacer from "../../shared/HorizSpacer";

import upload from '../../../assets/upload.svg';

export default function ButtonTray() {
  const [file, setFile] = useState(null)

  const uploadRef = useRef(null);

  const handleFiles = (e) => {
    let f = e.target.files[0];
    setFile(f);
  }

  return(
    <UploadHolder>
      <input type='file' hidden ref={uploadRef} onChange={(e) => {handleFiles(e)}} />
      <HorizSpacer />
      <Clickable src={upload} alt='upload' width='25px' height='25px' onClick={() => {uploadRef.current.click()}} />
      <HorizSpacer />
    </UploadHolder>
  );
}

const UploadHolder = styled.div`
  flex: 0.1;
  max-width: 110px;
  display: flex;
  flex-direction: row;
  justify-content: right;
`;

const Clickable = styled.img`
  cursor: pointer;
`;
