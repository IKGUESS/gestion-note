package com.example.Gestion_Etudiants.Niveau;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NiveauRepository extends JpaRepository<niveau, String> {
	niveau findNiveauByCodeNiv(String codeNiv);
}