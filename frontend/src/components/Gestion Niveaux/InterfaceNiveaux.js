import React, { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import niveauService from './NiveauService';
import { toast } from 'react-toastify';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function InterfaceNiveaux() {
  const history = useHistory();
  const [codeNiv, setCodeNiv] = useState('');
  const [designation, setDesignation] = useState('');
  const [statut, setStatut] = useState('');
  const [niveau, setNiveau] = useState([]);
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    niveauService.getNiveau().then((reponse) => {
      setNiveau(reponse.data);
    }).catch((err) => {
      console.error('Error fetching niveaux:', err);
      toast.error('Erreur lors du chargement des niveaux.', {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  }, []);

  useEffect(() => {
    setFormIsValid(codeNiv !== '' && designation !== '' && statut !== '');
  }, [codeNiv, designation, statut]);

  const saveNiveau = (e) => {
    e.preventDefault();
    if (formIsValid) {
      const niveauData = { codeNiv, designation, statut };
      niveauService.getNiveauById(codeNiv).then(() => {
        toast.error(`Le niveau ${codeNiv} existe déjà dans la base de données.`, {
          position: toast.POSITION.TOP_CENTER,
        });
      }).catch((err) => {
        if (err.response?.status === 404) {
          niveauService.createNiveau(niveauData).then(() => {
            toast.success('Niveau ajouté avec succès.', {
              position: toast.POSITION.TOP_CENTER,
            });
            setNiveau([...niveau, niveauData]);
            setCodeNiv('');
            setDesignation('');
            setStatut('');
          }).catch((createErr) => {
            console.error('Error creating niveau:', createErr);
            toast.error('Erreur lors de l\'ajout du niveau.', {
              position: toast.POSITION.TOP_CENTER,
            });
          });
        } else {
          console.error('Error checking niveau existence:', err);
          toast.error('Erreur lors de la vérification du niveau.', {
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

  const modifierNiveau = (codeNiv) => {
    if (window.confirm('Voulez-vous vraiment mettre à jour ce Niveau ?')) {
      history.push(`/modifier-niveau/${codeNiv}`);
    }
  };

  const deleteNiveau = (codeNiveau) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce Niveau ?')) {
      niveauService.deleteNiveau(codeNiveau).then(() => {
        setNiveau(niveau.filter((niv) => niv.codeNiv !== codeNiveau));
        toast.success('Niveau supprimé avec succès !', {
          position: toast.POSITION.TOP_CENTER,
        });
      }).catch((err) => {
        console.error('Error deleting niveau:', err);
        toast.error('Erreur lors de la suppression du niveau.', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }
  };

  const changeCodeNivHandler = (event) => setCodeNiv(event.target.value);
  const changeDesignationHandler = (event) => setDesignation(event.target.value);
  const changeStatutHandler = (event) => setStatut(event.target.value);

  const handlerAnnuler = () => {
    setCodeNiv('');
    setDesignation('');
    setStatut('');
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
        <h3
          className="text-center mb-4"
          style={{
            fontWeight: '600',
            background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Gestion des Niveaux
        </h3>
        <div
          className="mb-4"
          style={{
            animation: 'slideIn 0.5s ease-in',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '2rem',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            border: '2px solid #4dabf7',
          }}
        >
          <h4
            className="text-center mb-4"
            style={{
              fontWeight: '500',
              color: '#343a40',
            }}
          >
            Ajouter un Niveau
          </h4>
          <form onSubmit={saveNiveau}>
            {[
              {
                label: 'Code Niveau',
                value: codeNiv,
                onChange: changeCodeNivHandler,
                type: 'text',
                placeholder: 'Code Niveau',
                required: true,
              },
              {
                label: 'Désignation',
                value: designation,
                onChange: changeDesignationHandler,
                type: 'text',
                placeholder: 'Désignation',
                required: true,
              },
              {
                label: 'Statut',
                value: statut,
                onChange: changeStatutHandler,
                type: 'select',
                options: [
                  { value: '', label: 'Sélectionner le statut' },
                  { value: 'En cours', label: 'En cours' },
                  { value: 'En attente', label: 'En attente' },
                  { value: 'Terminé', label: 'Terminé' },
                ],
                required: true,
              },
            ].map((field) => (
              <div className="form-group row mb-3" key={field.label}>
                <label
                  className="col-sm-3 col-form-label"
                  style={{
                    fontSize: '0.9rem',
                    color: '#343a40',
                    fontWeight: '500',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {field.label} :
                </label>
                <div className="col-sm-9">
                  {field.type === 'select' ? (
                    <select
                      className={`form-control ${field.value === '' && !formIsValid ? 'is-invalid' : ''}`}
                      value={field.value}
                      onChange={field.onChange}
                      required={field.required}
                      aria-label={field.label}
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #4dabf7',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                      onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                    >
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className={`form-control ${field.value === '' && !formIsValid ? 'is-invalid' : ''}`}
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={field.onChange}
                      required={field.required}
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #4dabf7',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                      onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                      aria-label={field.label}
                    />
                  )}
                  {field.value === '' && !formIsValid && (
                    <div className="invalid-feedback">Ce champ est requis.</div>
                  )}
                </div>
              </div>
            ))}
            <div className="form-group row mt-4">
              <div className="col-sm-12 text-center">
                <button
                  type="submit"
                  className="btn"
                  style={{
                    width: '120px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid #4dabf7',
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
                    e.currentTarget.style.borderColor = '#1a91ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#4dabf7';
                  }}
                  aria-label="Enregistrer le niveau"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={handlerAnnuler}
                  style={{
                    width: '120px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid #ff6b6b',
                    color: '#343a40',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontWeight: '500',
                    marginLeft: '1rem',
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
                  aria-label="Annuler"
                >
                  Annuler
                </button>
              </div>
            </div>
          </form>
        </div>
        <div
          style={{
            animation: 'slideIn 0.5s ease-in',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            border: '2px solid #4dabf7',
            overflowX: 'auto',
          }}
        >
          <table
            className="table table-bordered"
            style={{
              borderRadius: '10px',
              overflow: 'hidden',
              borderCollapse: 'separate',
              fontSize: '0.9rem',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#4dabf7',
                  color: '#fff',
                  fontWeight: '500',
                }}
              >
                <th>Code Niveau</th>
                <th>Désignation</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {niveau.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center" style={{ color: '#343a40' }}>
                    Aucun Niveau disponible
                  </td>
                </tr>
              ) : (
                niveau.map((niv) => (
                  <tr
                    key={niv.codeNiv}
                    style={{
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f9ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td>{niv.codeNiv}</td>
                    <td>{niv.designation}</td>
                    <td>{niv.statut}</td>
                    <td>
                      <EditOutlined
                        style={{
                          color: '#28a745',
                          cursor: 'pointer',
                          fontSize: '22px',
                          marginRight: '15px',
                          transition: 'transform 0.3s ease',
                        }}
                        onClick={() => modifierNiveau(niv.codeNiv)}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        aria-label={`Modifier le niveau ${niv.codeNiv}`}
                      />
                      <DeleteOutlined
                        style={{
                          color: '#dc3545',
                          cursor: 'pointer',
                          fontSize: '22px',
                          transition: 'transform 0.3s ease',
                        }}
                        onClick={() => deleteNiveau(niv.codeNiv)}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        aria-label={`Supprimer le niveau ${niv.codeNiv}`}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-end mt-4">
          <button
            className="btn"
            onClick={() => history.push('/interface-principale-niveaux')}
            style={{
              width: '120px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid #4dabf7',
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
              e.currentTarget.style.borderColor = '#1a91ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#4dabf7';
            }}
            aria-label="Retour à l'interface principale des niveaux"
          >
            Retour
          </button>
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
        `}
      </style>
    </div>
  );
}

export default InterfaceNiveaux;