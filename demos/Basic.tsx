import React from 'react';
import { Editor } from 'tiny-image-editor';
import image from './basic.jpg';

const Demo = () => {
  return (
    <div>
      <Editor url={image} />
    </div>
  );
};

export default Demo;
