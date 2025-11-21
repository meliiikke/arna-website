import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './WysiwygEditor.css';

const WysiwygEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'İçerik yazın...',
  height = '400px',
  readOnly = false 
}) => {
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'code-block'
  ];

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          // Resmi base64'e çevir
          const base64 = await convertToBase64(file);
          
          // Quill editörüne resmi ekle
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', base64);
        } catch (error) {
          console.error('Resim yükleme hatası:', error);
          alert('Resim yüklenirken hata oluştu.');
        }
      }
    };
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      // Resim boyutunu kontrol et (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('Resim boyutu 5MB\'dan büyük olamaz'));
        return;
      }

      // Resmi sıkıştır
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Maksimum boyutları belirle (1920x1080)
        const maxWidth = 1920;
        const maxHeight = 1080;
        
        let { width, height } = img;
        
        // Boyutları orantılı olarak küçült
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        // Canvas boyutunu ayarla
        canvas.width = width;
        canvas.height = height;
        
        // Resmi çiz (kalite: 0.8)
        ctx.drawImage(img, 0, 0, width, height);
        
        // Base64'e çevir
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(base64);
      };
      
      img.onerror = () => reject(new Error('Resim yüklenemedi'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleToolbarClick = (e) => {
    if (e.target.classList.contains('ql-image')) {
      e.preventDefault();
      handleImageUpload();
    }
  };

  return (
    <div className="wysiwyg-editor-container">
      <div 
        className="wysiwyg-toolbar" 
        onClick={handleToolbarClick}
      >
        {/* Toolbar will be rendered by ReactQuill */}
      </div>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{ height: height }}
        className="wysiwyg-editor"
      />
    </div>
  );
};

export default WysiwygEditor;
