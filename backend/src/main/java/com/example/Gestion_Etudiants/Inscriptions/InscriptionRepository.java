package com.example.Gestion_Etudiants.Inscriptions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, String> {
    Inscription findInscriptionByCin(String cin);
}