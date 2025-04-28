package com.example.Gestion_Etudiants.NiveauEtude;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NiveauEtudeRepository extends JpaRepository<niveauEtd, String> {

	niveauEtd findByCodeNivSco(String codeNivSco);

	@Query("SELECT ns FROM niveauEtd ns JOIN ns.filiere f WHERE f.codeFil = :codeFil")
	List<niveauEtd> findNiveauxScolairesByCodeFiliere(@Param("codeFil") String codeFil);
}