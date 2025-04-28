package com.example.Gestion_Etudiants.Professeurs;

import com.example.Gestion_Etudiants.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ProfesseurService {

    private final ProfesseurRepository professeurRepository;


    public ProfesseurService(ProfesseurRepository professeurRepository) {
        this.professeurRepository = professeurRepository;
    }

    public List<Professeur> getAllProfesseurs() {
        return professeurRepository.findAll();
    }

    public Professeur getProfesseurById(Long id) {
        return professeurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professeur non trouvé avec l'id: " + id));
    }

    public Professeur getProfesseurByCin(String cin) {
        return professeurRepository.findByCin(cin);
    }

    @Transactional
    public Professeur createProfesseur(Professeur professeur) {
        return professeurRepository.save(professeur);
    }

    @Transactional
    public Professeur updateProfesseur(Long id, Professeur professeurDetails) {
        Professeur professeur = getProfesseurById(id);

        professeur.setCin(professeurDetails.getCin());
        professeur.setNom(professeurDetails.getNom());
        professeur.setPrenom(professeurDetails.getPrenom());
        professeur.setEmail(professeurDetails.getEmail());
        professeur.setTelephone(professeurDetails.getTelephone());
        professeur.setStatut(professeurDetails.getStatut());
        professeur.setSection(professeurDetails.getSection());

        return professeurRepository.save(professeur);
    }

    @Transactional
    public void deleteProfesseur(Long id) {
        Professeur professeur = getProfesseurById(id);
        professeurRepository.delete(professeur);
    }
}