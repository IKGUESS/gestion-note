import React, { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import filierService from '../Gestion Filieres/FilierService';
import { toast } from 'react-toastify';
import { Pagination } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function InterfaceAffectationResponsable() {
  const history = useHistory();
  const [filier, setFilier] = useState([]);
  const [allFilieres, setAllFilieres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    filierService.getFilier().then((reponse) => {
      setFilier(reponse.data);
      setAllFilieres(reponse.data);
    }).catch((err) => {
      console.error('Error fetching filieres:', err);
      toast.error('Erreur lors du chargement des filières.', {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  }, []);

  const totalPages = Math.ceil(filier.length / itemsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const displayedFilieres = filier.length !== 0 ? filier.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

  const modifierFilier = (codeFil) => {
    if (window.confirm('Voulez-vous vraiment mettre à jour cette Filière ?')) {
      history.push(`/modifier-affectation-respo/${codeFil}`);
    }
  };

  const deleteFilier = (codeFil) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette Filière ?')) {
      filierService.deleteFiliere(codeFil).then(() => {
        const updatedFilieres = allFilieres.filter((filiere) => filiere.codeFil !== codeFil);
        setAllFilieres(updatedFilieres);
        setFilier(updatedFilieres.filter((filiere) =>
          filiere.responsable?.cin?.toLowerCase().includes(searchTerm.toLowerCase())
        ));
        toast.success('Filière supprimée avec succès !', {
          position: toast.POSITION.TOP_CENTER,
        });
      }).catch((err) => {
        console.error('Error deleting filiere:', err);
        toast.error('Erreur lors de la suppression de la filière.', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filteredFilieres = allFilieres.filter((filiere) =>
      filiere.responsable?.cin?.toLowerCase().includes(term.toLowerCase())
    );
    setFilier(filteredFilieres);
    setCurrentPage(1);
  };

  const reinitialiserPage = () => {
    setSearchTerm('');
    setFilier(allFilieres);
    setCurrentPage(1);
  };

  const retour = () => {
    history.push('/interface-responsable');
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
          Affectation des Responsables
        </h3>
        <div
          className="mb-4"
          style={{
            animation: 'slideIn 0.5s ease-in',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            padding: '1.5rem',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            border: '2px solid #4dabf7',
          }}
        >
          <div className="form-group d-flex align-items-center">
            <label
              htmlFor="search"
              style={{
                fontWeight: '500',
                color: '#343a40',
                marginRight: '1rem',
                fontSize: '0.9rem',
              }}
            >
              CIN :
            </label>
            <input
              type="text"
              className="form-control"
              id="search"
              placeholder="Rechercher par CIN"
              value={searchTerm}
              onChange={handleSearch}
              style={{
                width: '60%',
                borderRadius: '8px',
                border: '2px solid #4dabf7',
                padding: '0.5rem',
                fontSize: '0.9rem',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
              onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
              aria-label="Rechercher par CIN"
            />
            <button
              className="btn"
              onClick={reinitialiserPage}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #ff6b6b',
                color: '#343a40',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                marginLeft: '1rem',
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
              aria-label="Réinitialiser la recherche"
            >
              Réinitialiser
            </button>
          </div>
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
            <thead
              style={{
                backgroundColor: '#4dabf7',
                color: '#fff',
                fontWeight: '500',
              }}
            >
              <tr>
                <th>Code Niveau</th>
                <th>Niveau</th>
                <th>Code Filière</th>
                <th>Désignation</th>
                <th>CIN Responsable</th>
                <th>Nom Responsable</th>
                <th>Prénom Responsable</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedFilieres.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center" style={{ color: '#343a40' }}>
                    Aucune Filière disponible
                  </td>
                </tr>
              ) : (
                displayedFilieres.map((filiere) => (
                  <tr
                    key={filiere.codeFil}
                    style={{
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f9ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td>{filiere.niveau?.codeNiv || 'N/A'}</td>
                    <td>{filiere.niveau?.designation || 'N/A'}</td>
                    <td>{filiere.codeFil}</td>
                    <td>{filiere.designation}</td>
                    <td>{filiere.responsable?.cin || 'N/A'}</td>
                    <td>{filiere.responsable?.nom || 'N/A'}</td>
                    <td>{filiere.responsable?.prenom || 'N/A'}</td>
                    <td>
                      <EditOutlined
                        style={{
                          color: '#28a745',
                          cursor: 'pointer',
                          fontSize: '22px',
                          marginRight: '15px',
                          transition: 'transform 0.3s ease',
                        }}
                        onClick={() => modifierFilier(filiere.codeFil)}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        aria-label={`Modifier la filière ${filiere.codeFil}`}
                      />
                      <DeleteOutlined
                        style={{
                          color: '#dc3545',
                          cursor: 'pointer',
                          fontSize: '22px',
                          transition: 'transform 0.3s ease',
                        }}
                        onClick={() => deleteFilier(filiere.codeFil)}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        aria-label={`Supprimer la filière ${filiere.codeFil}`}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            className="btn"
            onClick={retour}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid #4dabf7',
              color: '#343a40',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontWeight: '500',
              width: '120px',
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
            aria-label="Retour à l'interface responsable"
          >
            Retour
          </button>
          <Pagination
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              padding: '0.5rem',
              border: '2px solid #4dabf7',
              backdropFilter: 'blur(5px)',
            }}
          >
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              style={{
                border: '2px solid #4dabf7',
                borderRadius: '8px',
                marginRight: '0.5rem',
                backgroundColor: currentPage === 1 ? '#e9ecef' : 'transparent',
                transition: 'border-color 0.3s ease',
              }}
              onMouseEnter={(e) => currentPage !== 1 && (e.currentTarget.style.borderColor = '#1a91ff')}
              onMouseLeave={(e) => currentPage !== 1 && (e.currentTarget.style.borderColor = '#4dabf7')}
              aria-label="Page précédente"
            >
              <FaChevronLeft />
            </Pagination.Prev>
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
                style={{
                  border: '2px solid #4dabf7',
                  borderRadius: '8px',
                  margin: '0 0.2rem',
                  backgroundColor: index + 1 === currentPage ? '#4dabf7' : 'transparent',
                  color: index + 1 === currentPage ? '#fff' : '#343a40',
                  transition: 'border-color 0.3s ease, background-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (index + 1 !== currentPage) {
                    e.currentTarget.style.borderColor = '#1a91ff';
                    e.currentTarget.style.backgroundColor = '#f1f9ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index + 1 !== currentPage) {
                    e.currentTarget.style.borderColor = '#4dabf7';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                aria-label={`Page ${index + 1}`}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              style={{
                border: '2px solid #4dabf7',
                borderRadius: '8px',
                marginLeft: '0.5rem',
                backgroundColor: currentPage === totalPages ? '#e9ecef' : 'transparent',
                transition: 'border-color 0.3s ease',
              }}
              onMouseEnter={(e) => currentPage !== totalPages && (e.currentTarget.style.borderColor = '#1a91ff')}
              onMouseLeave={(e) => currentPage !== totalPages && (e.currentTarget.style.borderColor = '#4dabf7')}
              aria-label="Page suivante"
            >
              <FaChevronRight />
            </Pagination.Next>
          </Pagination>
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

export default InterfaceAffectationResponsable;