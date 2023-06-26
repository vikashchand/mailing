import React, { useState, useEffect } from 'react';
import './sendMail.css';

const ManageTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState('');
  const [newTemplateType, setNewTemplateType] = useState('');
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  useEffect(() => {
    // Fetch the templates from the backend when the component mounts
    fetchTemplates();
  }, []);

  const fetchTemplates = () => {
    // Make a GET request to fetch the templates from the backend
    fetch('http://localhost:5000/user/templates')
      .then(response => response.json())
      .then(data => setTemplates(data))
      .catch(error => console.log(error));
  };

  const handleEdit = template => {
    setCurrentTemplate(template);
    setIsCreatingTemplate(false);
    setPreviewTemplate(null);
  };

  const handleDelete = templateId => {
    // Make a DELETE request to the backend to delete the template
    fetch(`http://localhost:5000/user/templates/${templateId}`, { method: 'DELETE' })
      .then(() => fetchTemplates())
      .catch(error => console.log(error));
  };

  const handleCreate = () => {
    setIsCreatingTemplate(true);
    setCurrentTemplate(null);
    setPreviewTemplate(null);
  };

  const handleTemplateClose = () => {
    setCurrentTemplate(null);
    setIsCreatingTemplate(false);
    setPreviewTemplate(null);
    fetchTemplates();
  };

  const handleUpdate = () => {
    if (currentTemplate) {
      // Make a PUT request to update the existing template
      fetch(`http://localhost:5000/user/templates/${currentTemplate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: currentTemplate.body }),
      })
        .then(() => {
          setCurrentTemplate(null);
          fetchTemplates();
        })
        .catch(error => console.log(error));
    } else {
      if (newTemplate && newTemplateType) {
        // Make a POST request to create a new template
        fetch('http://localhost:5000/user/templates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: newTemplate, type: newTemplateType }),
        })
          .then(() => {
            setNewTemplate('');
            setNewTemplateType('');
            setIsCreatingTemplate(false);
            setPreviewTemplate(null);
            fetchTemplates();
          })
          .catch(error => console.log(error));
      } else {
        console.log('Please enter both template body and type');
      }
    }
  };

  const handlePreview = template => {
    setPreviewTemplate(template);
  };

  return (
    <div className='managetemp-container'>
      {!isCreatingTemplate && !currentTemplate && !previewTemplate && (
        <div className=''>
        <br></br>
        <button onClick={handleCreate}>Create New Template</button>
          <h3>Available Templates</h3>
          {templates.map(template => (
            <div className="templ templateedits" key={template.id}>
              <div>
                <h3>{template.Type}</h3>
              </div>
              <button onClick={() => handleEdit(template)}>Edit</button>
              <button onClick={() => handleDelete(template.id)}>Delete</button>
              <button onClick={() => handlePreview(template)}>View</button>
            </div>
          ))}
         
        </div>
      )}

      {currentTemplate && (
        <div className="template-editor ">
          <h3>Edit Template</h3>
          <textarea 
            value={currentTemplate.body}
            onChange={e => setCurrentTemplate({ ...currentTemplate, body: e.target.value })}
            style={{ width: '50%', height: '200px' }}
          ></textarea>
            <div className="templateedits">
          <button onClick={handleUpdate}>Save</button>
          <button onClick={handleTemplateClose}>Close</button>
          </div>
        </div>
      )}

      {isCreatingTemplate && (
        <div className="templateeditor">
          <h3>Create New Template</h3>
          <textarea
            value={newTemplate}
            onChange={e => setNewTemplate(e.target.value)}
            style={{ width: '50%', height: '200px', border: '1px solid black', borderRadius: '5px' }}
            placeholder="Paste The Template Here"
          ></textarea>
          <div className="templateedits">
            <input
              type="text"
              value={newTemplateType}
              style={{ width: '30%', height: '30px', margin: '10px' }}
              onChange={e => setNewTemplateType(e.target.value)}
              placeholder="Template Name"
            />
            <button onClick={handleUpdate}>Save</button>
            <button onClick={handleTemplateClose}>Close</button>
          </div>
        </div>
      )}

      {previewTemplate && (
        <div className="template-preview">
          <h3>Template Preview</h3>
          <div
            className="preview-body"
            dangerouslySetInnerHTML={{ __html: previewTemplate.body }}
          ></div>
          <button onClick={() => setPreviewTemplate(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ManageTemplate;
