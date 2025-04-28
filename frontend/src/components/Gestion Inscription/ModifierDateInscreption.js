import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import dateInscriptionService from './DateInsciprtionService'; // Note: Typo in service name
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import 'bootstrap/dist/css/bootstrap.min.css';

function ModifierDateInscription(props) {
  const [dateInscreption, setDateInscreption] = useState(''); // Corrected variable name
  const history = useHistory();

  useEffect(() => {
    dateInscriptionService.getDateById(props.match.params.id).then((res) => {
      let date = res.data;
      // Convert date to ISO format
      const dateNaissanceObj = new Date(date.dateInscreption);
      const dateNaissanceISO = moment(dateNaissanceObj).format('YYYY-MM-DD');
      setDateInscreption(dateNaissanceISO);
    });
  }, [props.match.params.id]);

  // Form validation
  const validateForm = () => {
    return dateInscreption !== '';
  };

  // Update inscription date
  const ModifierDate = (e) => {
    e.preventDefault();
    if (validateForm()) {
      let dateInscrip = { dateInscreption };
      dateInscriptionService.updateDate(dateInscrip, props.match.params.id).then((res) => {
        window.alert("Date d'inscription modifiée avec succès.");
        history.replace('/interface-date-inscription');
      });
    } else {
      toast.error('Veuillez remplir tous les champs.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  // Handle date input change
  const changeNaissanceHandler = (event) => {
    setDateInscreption(event.target.value);
  };

  // Cancel and navigate back
  const fonctionAnnuler = () => {
    history.replace('/interface-date-inscription');
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
        <div className="row" style={{ animation: 'slideIn 0.5s ease-in' }}>
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
              Modifier Date d'Inscription
            </h3>
            <div className="card-body">
              <form>
                <div className="form-group row mb-4">
                  <label
                    className="col-sm-3 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Date d'inscription :
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="date"
                      placeholder="La date"
                      className={`form-control ${dateInscreption ? 'is-valid' : 'is-invalid'}`}
                      value={dateInscreption}
                      onChange={changeNaissanceHandler}
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
                      aria-label="Date d'inscription"
                    />
                    <div className="invalid-feedback">Veuillez sélectionner une date.</div>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-sm-5 offset-sm-8 d-flex justify-content-end">
                    <button
                      className="btn"
                      onClick={ModifierDate}
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
                      aria-label="Enregistrer la date"
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
                      aria-label="Annuler"
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

export default ModifierDateInscription;