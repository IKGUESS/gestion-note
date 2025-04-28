package com.example.Gestion_Etudiants.Professeurs;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfesseurRepository extends JpaRepository<Professeur, Long> {
	Professeur findByCin(String cin);
}