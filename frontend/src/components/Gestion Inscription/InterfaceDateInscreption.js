import React, { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import DateInsciprtionService from './DateInsciprtionService';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function InterfaceDateInscription(props) {
    const [dateNaissance, setDateNaissance] = useState('');
    const [date, setDate] = useState([]);
    const history = useHistory();

    useEffect(() => {
        DateInsciprtionService.getDate().then((reponse) => {
            setDate(reponse.data);
        });
    }, [date]);
    
    function ModifierDate(id) { 
        if (window.confirm("Voulez-vous vraiment mettre à jour cette date d'inscription ?")) {
            history.replace(`/modifier-date-inscription/${id}`); 
        }
    }

    function DeleteDate(id) {  
        if (window.confirm("Voulez-vous vraiment supprimer cette date d'inscription ?")) {
            DateInsciprtionService.deleteDateInscription(id).then(reponse => {
                setDate(date.filter(dateInscrip => dateInscrip.id !== id)); 
            });
            toast.success("Date d'inscription supprimée avec succès !", {
                position: toast.POSITION.TOP_CENTER 
            }); 
        }
    }

    const validateForm = () => {
        return dateNaissance !== '';
    };

    const saveDate = (e) => {
        e.preventDefault();
        if(validateForm()) {  
            let dateInscrep = { dateInscreption: dateNaissance };
            DateInsciprtionService.createDate(dateInscrep).then(res => {
                toast.success("Date d'inscription ajoutée avec succès.", {
                    position: toast.POSITION.TOP_CENTER
                });
                history.replace('/interface-date-inscription');  
            });
        } else {
            toast.error('Veuillez remplir tous les champs.', {
                position: toast.POSITION.TOP_CENTER 
            });
        } 
    }

    const changeNaissanceHandler = (event) => {
        setDateNaissance(event.target.value);
    }

    function HandlerAnnuler() {
        setDateNaissance('');
    }

    function Retour() {
        history.replace('/interface-admin');
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#e7f1ff',
            animation: 'fadeIn 1s ease-in',
        }}>
            <HeaderAdmin />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-7" style={{
                        animation: 'slideIn 0.5s ease-in',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '15px',
                        padding: '2rem',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                        border: '2px solid #4dabf7',
                        marginBottom: '2rem'
                    }}>
                        <h3 className="text-center mb-4" style={{
                            fontWeight: '600',
                            background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            La date d'inscription
                        </h3>
                        <form onSubmit={saveDate}>
                            <div className="form-group row mb-3">
                                <label className="col-sm-3 col-form-label" style={{
                                    fontSize: '0.9rem',
                                    color: '#343a40',
                                    fontWeight: '500',
                                    transition: 'color 0.3s ease',
                                    whiteSpace: 'nowrap',
                                }}>
                                    Date d'inscription :
                                </label>
                                <div className="col-sm-9">
                                    <input 
                                        type='date' 
                                        className={`form-control ${dateNaissance === '' ? 'is-invalid' : ''}`}
                                        value={dateNaissance} 
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
                                    />
                                    {dateNaissance === '' && (
                                        <div className="invalid-feedback">Ce champ est requis.</div>
                                    )}
                                </div>
                            </div>
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
                                    >
                                        Enregistrer
                                    </button>
                                    <button
                                        type="button"
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
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-md-10" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '15px',
                        padding: '2rem',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                        border: '2px solid #4dabf7',
                    }}>
                        <table className='table table-hover' style={{ marginBottom: '2rem' }}>
                            <thead>
                                <tr style={{
                                    backgroundColor: '#4dabf7',
                                    color: 'white',
                                }}>
                                    <th className='text-center'>ID</th>
                                    <th className='text-center'>Date d'inscription</th>
                                    <th className='text-center'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {date.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="text-center">
                                            Aucune date d'inscription disponible
                                        </td>
                                    </tr>
                                ) : ( 
                                    date.map(etu => (
                                        <tr key={etu.id} className='text-center'>
                                            <td>{etu.id}</td>
                                            <td>{etu.dateInscreption}</td>
                                            <td>
                                                <EditOutlined 
                                                    onClick={() => ModifierDate(etu.id)}
                                                    style={{
                                                        color: "#4dabf7",
                                                        cursor: 'pointer',
                                                        marginLeft: "1px",
                                                        fontSize: '22px',
                                                        transition: 'color 0.3s ease',
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#1a91ff')}
                                                    onMouseLeave={(e) => (e.currentTarget.style.color = '#4dabf7')}
                                                />
                                                <DeleteOutlined
                                                    onClick={() => DeleteDate(etu.id)}
                                                    style={{
                                                        color: "#ff6b6b",
                                                        cursor: 'pointer',
                                                        marginLeft: "8px",
                                                        fontSize: '22px',
                                                        transition: 'color 0.3s ease',
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#e63946')}
                                                    onMouseLeave={(e) => (e.currentTarget.style.color = '#ff6b6b')}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div className="text-right">
                            <button 
                                onClick={Retour}
                                style={{
                                    width: '120px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    border: '2px solid #4dabf7',
                                    color: '#343a40',
                                    borderRadius: '8px',
                                    padding: '0.5rem 1rem',
                                    fontWeight: '500',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
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
                            >
                                Retour
                            </button>
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
                `}
            </style>
        </div>
    );
}

export default InterfaceDateInscription;