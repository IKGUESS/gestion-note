import React, { useState, useEffect } from 'react';
import sectionService from './SectionService';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import 'bootstrap/dist/css/bootstrap.min.css';

function ModifierSection(props) {
  const [codeSec, setCodeSec] = useState('');
  const [designation, setDesignation] = useState('');
  const history = useHistory();

  useEffect(() => {
    sectionService.getSectionByCodeSec(props.match.params.codeSec).then((res) => {
      let sec = res.data;
      setCodeSec(sec.codeSec);
      setDesignation(sec.designation);
    });
  }, [props.match.params.codeSec]);

  // Form validation
  const validateForm = () => {
    return codeSec !== '' && designation !== '';
  };

  const ModifierSection = (e) => {
    e.preventDefault();
    if (validateForm()) {
      let sec = { codeSec, designation };
      sectionService.updateSection(sec, props.match.params.codeSec).then((res) => {
        window.alert('Section modifiée avec succès.');
        history.replace('/interface-section');
      });
    } else {
      toast.error('Veuillez remplir tous les champs.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const changeSectionHandler = (event) => {
    setCodeSec(event.target.value);
  };

  const changeDesignationHandler = (event) => {
    setDesignation(event.target.value);
  };

  const fonctionAnnuler = () => {
    history.replace('/interface-section');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#e7f1ff',
        animation: 'fadeIn 1s ease-in',
      }}
    >
      <HeaderAdmin />
      <div className="container py-5">
        <div
          className="row"
          style={{
            animation: 'slideIn 0.5s ease-in',
          }}
        >
          <div
            className="card col-md-7 offset-md-2 offset-md-3 col-lg-6"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '15px',
              padding: '2rem',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              border: '2px solid #4dabf7',
            }}
          >
            <h3
              className="text-center mb-4"
              style={{
                fontWeight: '600',
                background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Modifier Section
            </h3>
            <div className="card-body">
              <form>
                <div className="form-group row mb-3">
                  <label
                    className="col-sm-3 col-form-label"
                    style={{
                      whiteSpace: 'nowrap',
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Code Section :
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      placeholder="Code Section"
                      className="form-control"
                      value={codeSec}
                      onChange={changeSectionHandler}
                      required
                      readOnly
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #4dabf7',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        backgroundColor: '#f1f3f5',
                        cursor: 'not-allowed',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      aria-label="Code de la section"
                    />
                  </div>
                </div>
                <div className="form-group row mb-4">
                  <label
                    className="col-sm-3 col-form-label"
                    style={{
                      whiteSpace: 'nowrap',
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Designation :
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      placeholder="Designation de section"
                      className="form-control"
                      value={designation}
                      onChange={changeDesignationHandler}
                      required
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #4dabf7',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                      onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                      aria-label="Designation de la section"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-sm-5 offset-sm-8 d-flex justify-content-end">
                    <button
                      className="btn"
                      onClick={ModifierSection}
                      style={{
                        width: '120px',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '2px solid #4dabf7',
                        color: '#343a40',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        fontWeight: '500',
                        marginRight: '1rem',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                        animation: 'pulse 2s infinite',
                        backdropFilter: 'blur(5px)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                        e.currentTarget.style.borderColor = '#1a91ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = '#4dabf7';
                      }}
                      aria-label="Enregistrer les modifications"
                    >
                      Enregistrer
                    </button>
                    <button
                      className="btn"
                      onClick={fonctionAnnuler}
                      style={{
                        width: '120px',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '2px solid #ff6b6b',
                        color: '#343a40',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        fontWeight: '500',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                        animation: 'pulse 2s infinite',
                        backdropFilter: 'blur(5px)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                        e.currentTarget.style.borderColor = '#e63946';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = '#ff6b6b';
                      }}
                      aria-label="Annuler les modifications"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
          }
          .form-control.is-invalid {
            border-color: #e63946;
            background-image: none;
          }
          .form-control.is-valid {
            border-color: #1a91ff;
            background-image: none;
          }
        `}
      </style>
    </div>
  );
}

export default ModifierSection;