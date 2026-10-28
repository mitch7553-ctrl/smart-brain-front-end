import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit, isDetecting, input }) => (
  <div>
    <p className="f3">This Magic Brain will detect faces in your pictures. Give it a try.</p>
    <div className="center">
      <form className="form center pa4 br3 shadow-5" onSubmit={onButtonSubmit}>
        <label htmlFor="image-url" className="db">Image URL</label>
        <input id="image-url" className="f4 pa2 w-70 center"
          type="url" value={input} onChange={onInputChange}
          placeholder="https://example.com/photo.jpg" required />
        <button type="submit" disabled={isDetecting}
          className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple">
          {isDetecting ? 'Detecting…' : 'Detect'}
        </button>
      </form>
    </div>
  </div>
);

export default ImageLinkForm;
