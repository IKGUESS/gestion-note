package com.example.Gestion_Etudiants.Inscriptions;

import com.example.Gestion_Etudiants.ResourceNotFoundException;
import com.example.Gestion_Etudiants.Filieres.Filiere;
import com.example.Gestion_Etudiants.Filieres.FiliereRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class InscriptionService {

    private final InscriptionRepository inscriptionRepository;
    private final FiliereRepository filiereRepository;

    public InscriptionService(InscriptionRepository inscriptionRepository,
                              FiliereRepository filiereRepository) {
        this.inscriptionRepository = inscriptionRepository;
        this.filiereRepository = filiereRepository;
    }

    public List<Inscription> getAllInscriptions() {
        return inscriptionRepository.findAll();
    }

    public Inscription getInscriptionById(String cin) {
        return inscriptionRepository.findInscriptionByCin(cin);
    }

    @Transactional
    public Inscription createInscription(Inscription inscription) {
        // Vérifier et associer la filière
        if (inscription.getFiliere() != null && inscription.getFiliere().getCodeFil() != null) {
            Filiere filiere = filiereRepository.findFilierByCodeFil(inscription.getFiliere().getCodeFil());
            if (filiere == null) {
                throw new ResourceNotFoundException("Filière non trouvée avec le code: " + inscription.getFiliere().getCodeFil());
            }
            inscription.setFiliere(filiere);
        }
        return inscriptionRepository.save(inscription);
    }

    @Transactional
    public Inscription updateInscription(String cin, Inscription inscriptionDetails) {
        Inscription inscription = inscriptionRepository.findInscriptionByCin(cin);
        if (inscription == null) {
            throw new ResourceNotFoundException("Inscription non trouvée avec le CIN: " + cin);
        }

        inscription.setNom(inscriptionDetails.getNom());
        inscription.setPrenom(inscriptionDetails.getPrenom());
        inscription.setDateNaissance(inscriptionDetails.getDateNaissance());

        if (inscriptionDetails.getFiliere() != null && inscriptionDetails.getFiliere().getCodeFil() != null) {
            Filiere filiere = filiereRepository.findFilierByCodeFil(inscriptionDetails.getFiliere().getCodeFil());
            if (filiere == null) {
                throw new ResourceNotFoundException("Filière non trouvée avec le code: " + inscriptionDetails.getFiliere().getCodeFil());
            }
            inscription.setFiliere(filiere);
        }

        return inscriptionRepository.save(inscription);
    }

    @Transactional
    public void deleteInscription(String cin) {
        Inscription inscription = inscriptionRepository.findInscriptionByCin(cin);
        if (inscription == null) {
            throw new ResourceNotFoundException("Inscription non trouvée avec le CIN: " + cin);
        }
        inscriptionRepository.delete(inscription);
    }
}