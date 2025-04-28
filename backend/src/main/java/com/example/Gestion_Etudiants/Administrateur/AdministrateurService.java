package com.example.Gestion_Etudiants.Administrateur;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AdministrateurService {
    private final AdministrateurRepository administrateurRepository;

    public AdministrateurService(AdministrateurRepository administrateurRepository) {
        this.administrateurRepository = administrateurRepository;
    }

    public List<Administrateur> getAllAdministrateurs() {
        return administrateurRepository.findAll();
    }

    public Administrateur createAdministrateur(Administrateur administrateur) {
        return administrateurRepository.save(administrateur);
    }

    public Administrateur getAdministrateurById(Long id) {
        return administrateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrateur non trouvé"));
    }

    public Administrateur updateAdministrateur(Long id, Administrateur administrateurDetails) {
        Administrateur administrateur = getAdministrateurById(id);
        administrateur.setNom(administrateurDetails.getNom());
        administrateur.setEmail(administrateurDetails.getEmail());
        administrateur.setMotDePasse(administrateurDetails.getMotDePasse());
        return administrateurRepository.save(administrateur);
    }

    public void deleteAdministrateur(Long id) {
        administrateurRepository.deleteById(id);
    }

    public Optional<Administrateur> findByEmail(String email) {
        return administrateurRepository.findByEmail(email);
    }



}