import React, { useState, useEffect } from 'react';
import sectionService from './SectionService';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function InterfaceSection(props) {
  const [codeSec, setCodeSec] = useState('');
  const [section, setSection] = useState([]);
  const [designation, setDesignation] = useState('');

  const history = useHistory();

  useEffect(() => {
    sectionService.getSection().then((reponse) => {
      setSection(reponse.data);
    });
  }, []);

  function ModifierSection(codeSec) {
    if (window.confirm('Voulez-vous vraiment mettre à jour cette Section ?')) {
      history.replace(`/modifier-section/${codeSec}`);
    }
  }

  function DeleteSection(codeSec) {
    if (window.confirm('Voulez-vous vraiment supprimer cette Section ?')) {
      sectionService.deleteSection(codeSec).then((reponse) => {
        setSection(section.filter((sectio) => sectio.codeSec !== codeSec));
        toast.success('Section supprimée avec succès !', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }
  }

  // Form validation
  const validateForm = () => {
    return codeSec !== '' && designation !== '';
  };

  const saveSection = (e) => {
    e.preventDefault();
    if (validateForm()) {
      let sec = { codeSec, designation };
      // Check if the code exists
      let codeExists = [];
      sectionService.getSectionByCodeSec(codeSec).then((res) => {
        codeExists = res.data;
        if (codeExists.codeSec !== codeSec) {
          sectionService.createSection(sec).then((res) => {
            window.alert('Section ajoutée avec succès.');
            window.location.href = '/interface-section';
          });
        } else {
          toast.error('Cette Section ' + codeSec + ' existe déjà dans la base de données.', {
            position: toast.POSITION.TOP_CENTER,
          });
        }
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

  function HandlerAnnuler() {
    setCodeSec('');
    setDesignation('');
  }

  function Retour() {
    history.replace('/interface-principale-section');
  }

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
              Ajouter Section
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
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #4dabf7',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                      onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
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
                      onClick={saveSection}
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
                      aria-label="Enregistrer la section"
                    >
                      Enregistrer
                    </button>
                    <button
                      className="btn"
                      onClick={HandlerAnnuler}
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
        <br />
        <div
          className="row"
          style={{
            animation: 'slideIn 0.5s ease-in',
          }}
        >
          <div className="col-md-12">
            <table
              className="table table-striped table-bordered"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
              }}
            >
              <thead
                style={{
                  background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
                  color: '#fff',
                  fontWeight: '600',
                }}
              >
                <tr>
                  <th>Code Section</th>
                  <th>Designation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {section.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center" style={{ color: '#343a40', fontWeight: '500' }}>
                      Aucun Section disponible
                    </td>
                  </tr>
                ) : (
                  section.map((etu) => (
                    <tr
                      key={etu.codeSec}
                      style={{
                        transition: 'background-color 0.3s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e7f1ff')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td>{etu.codeSec}</td>
                      <td>{etu.designation}</td>
                      <td>
                        <EditOutlined
                          style={{
                            color: '#51cf66',
                            cursor: 'pointer',
                            marginLeft: '1px',
                            fontSize: '22px',
                            transition: 'color 0.3s ease, transform 0.3s ease',
                          }}
                          onClick={() => ModifierSection(etu.codeSec)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#37b24d';
                            e.currentTarget.style.transform = 'scale(1.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#51cf66';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                          aria-label="Modifier la section"
                        />
                        <DeleteOutlined
                          style={{
                            color: '#ff6b6b',
                            cursor: 'pointer',
                            marginLeft: '8px',
                            fontSize: '22px',
                            transition: 'color 0.3s ease, transform 0.3s ease',
                          }}
                          onClick={() => DeleteSection(etu.codeSec)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#e63946';
                            e.currentTarget.style.transform = 'scale(1.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#ff6b6b';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                          aria-label="Supprimer la section"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="form-group row mt-4">
          <div className="col-sm-4 offset-sm-10 d-flex justify-content-end">
            <button
              className="btn"
              onClick={() => Retour()}
              style={{
                width: '120px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #4dabf7',
                color: '#343a40',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontWeight: '500',
                fontSize: '1.1rem',
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
              aria-label="Retour à l'interface principale"
            >
              Retour
            </button>
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
          .table th, .table td {
            padding: 0.75rem;
            vertical-align: middle;
          }
        `}
      </style>
    </div>
  );
}

export default InterfaceSection;