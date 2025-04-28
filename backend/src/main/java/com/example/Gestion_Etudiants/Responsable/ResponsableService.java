package com.example.Gestion_Etudiants.Responsable;

import com.example.Gestion_Etudiants.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ResponsableService {

    private final ResponsableRepository responsableRepository;

    public ResponsableService(ResponsableRepository responsableRepository) {
        this.responsableRepository = responsableRepository;
    }

    public List<Responsable> getAllResponsables() {
        return responsableRepository.findAll();
    }

    public Responsable getResponsableById(String cin) {
        return responsableRepository.findById(cin)
                .orElseThrow(() -> new ResourceNotFoundException("Responsable non trouvé avec le CIN: " + cin));
    }

    @Transactional
    public Responsable createResponsable(Responsable responsable) {
        return responsableRepository.save(responsable);
    }

    @Transactional
    public Responsable updateResponsable(String cin, Responsable responsableDetails) {
        Responsable responsable = getResponsableById(cin);

        responsable.setNom(responsableDetails.getNom());
        responsable.setPrenom(responsableDetails.getPrenom());
        responsable.setDateNaissance(responsableDetails.getDateNaissance());
        responsable.setTelephone(responsableDetails.getTelephone());
        responsable.setEmail(responsableDetails.getEmail());
        responsable.setNationalite(responsableDetails.getNationalite());
        responsable.setVille(responsableDetails.getVille());
        responsable.setSexe(responsableDetails.getSexe());
        responsable.setStatut(responsableDetails.getStatut());
        responsable.setLogin(responsableDetails.getLogin());
        responsable.setPassword(responsableDetails.getPassword());

        return responsableRepository.save(responsable);
    }

    @Transactional
    public void deleteResponsable(String cin) {
        Responsable responsable = getResponsableById(cin);
        responsableRepository.delete(responsable);
    }
}